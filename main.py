# ============================================================
# NeuroScan AI — Brain Haemorrhage Detection Backend
# FastAPI server running on http://localhost:8000
# ============================================================
#
# BEFORE YOU START — read this top to bottom, one step at a time.
#
# ─── STEP 1: Check Python is installed ─────────────────────
#   Open your terminal (Mac: press Cmd+Space, type "Terminal")
#   Type this and press Enter:
#       python3 --version
#   You should see something like "Python 3.10.x". If you see
#   "command not found", download Python from https://python.org
#
# ─── STEP 2: Create a virtual environment ───────────────────
#   In your terminal, navigate to this project folder:
#       cd ~/Downloads/neuroscan-ai-haemorrhage-detector-main
#
#   Create the virtual environment (only do this once):
#       python3 -m venv venv
#
#   Activate it (do this every time you open a new terminal):
#       Mac/Linux:  source venv/bin/activate
#       Windows:    venv\Scripts\activate
#
#   You'll know it's active when you see "(venv)" at the start
#   of your terminal prompt.
#
# ─── STEP 3: Install dependencies ───────────────────────────
#   With the venv active, run:
#       pip install -r requirements.txt
#
#   This may take a minute or two — that's normal.
#
# ─── STEP 4: Get an OpenAI API key ──────────────────────────
#   This backend uses OpenAI's GPT-4o Vision model to analyse
#   CT scans. You need a free account + API key.
#
#   1. Go to https://platform.openai.com/api-keys
#   2. Sign in or create a free account
#   3. Click "Create new secret key" and copy it
#
# ─── STEP 5: Create your .env file ──────────────────────────
#   In the same folder as this file, create a new file called
#   exactly:  .env   (note the dot at the start — no .txt!)
#
#   Put this inside it (replace the value with your real key):
#       OPENAI_API_KEY=sk-proj-your-real-key-here
#
#   Save the file. That's it — never share this file publicly.
#
# ─── STEP 6: Run the server ─────────────────────────────────
#   With your venv active, run:
#       uvicorn main:app --host 0.0.0.0 --port 8000 --reload
#
#   You should see:
#       INFO:     Uvicorn running on http://0.0.0.0:8000
#
#   The server is now live! Leave this terminal open while
#   using the app.
#
# ─── STEP 7: Test it ────────────────────────────────────────
#   Visit http://localhost:8000/docs in your browser.
#   You'll see interactive API documentation where you can
#   upload a test image and see the JSON response.
#
# ─── STOPPING THE SERVER ────────────────────────────────────
#   Press Ctrl+C in the terminal to stop it.
#
# ─── ABOUT THE MODEL ────────────────────────────────────────
#   This backend uses OpenAI GPT-4o Vision for CT classification.
#   No reliable, freely accessible HuggingFace model exists for
#   intracranial haemorrhage classification on CT images that
#   can be used out-of-the-box — GPT-4o Vision is the strongest
#   available option for a reliable demo.
#
# ============================================================

import os
import json
import base64
import re
from io import BytesIO

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image
import openai
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# ─── App Setup ───────────────────────────────────────────────

app = FastAPI(
    title="NeuroScan AI",
    description="Brain Haemorrhage Classification API — powered by GPT-4o Vision",
    version="1.0.0",
)

# Allow the React frontend to call this API.
# "allow_origins" lists which URLs are permitted to make requests.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8080",
        "http://127.0.0.1:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Response Schema ─────────────────────────────────────────

class AnalysisResult(BaseModel):
    haemorrhage_type: str
    severity: str        # One of: "Critical" | "High" | "Moderate"
    description: str
    procedure: list[str] # Always exactly 4 clinical action steps

# ─── OpenAI Client ───────────────────────────────────────────

def get_openai_client() -> openai.OpenAI:
    """Create and return an OpenAI client, raising a clear error if no key is set."""
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail=(
                "OPENAI_API_KEY is not set. "
                "Create a .env file in the project root and add: "
                "OPENAI_API_KEY=sk-your-key-here"
            ),
        )
    return openai.OpenAI(api_key=api_key)

# ─── Medical Classification Prompt ───────────────────────────

CLASSIFICATION_PROMPT = """You are an expert neuroradiology AI assistant. You are analysing a brain CT scan.

Identify any intracranial haemorrhage and classify it into EXACTLY ONE of the following types:
  • Epidural Haemorrhage
  • Subdural Haemorrhage
  • Subarachnoid Haemorrhage
  • Intracerebral Haemorrhage
  • Intraventricular Haemorrhage
  • No Haemorrhage Detected

For severity, choose EXACTLY ONE of:
  • Critical  — Immediately life-threatening; emergency surgical intervention likely required
  • High      — Urgent neurosurgical consultation required within hours
  • Moderate  — Requires hospital admission, close neurological monitoring

Respond with ONLY a valid JSON object — no markdown, no code fences, no extra text.
Use this exact structure:

{
  "haemorrhage_type": "<type from list above>",
  "severity": "<Critical|High|Moderate>",
  "description": "<Two plain-English sentences: (1) what this haemorrhage type is and where it occurs, (2) what this means clinically for the patient>",
  "procedure": [
    "<Step 1: immediate action>",
    "<Step 2: diagnostic or monitoring action>",
    "<Step 3: specialist involvement or intervention>",
    "<Step 4: ongoing management or disposition>"
  ]
}

If the image does not appear to be a brain CT scan, or image quality is too poor to assess, return:
{
  "haemorrhage_type": "Image Quality Insufficient",
  "severity": "Moderate",
  "description": "The uploaded image could not be assessed as a brain CT scan. Please ensure you are uploading a DICOM export or CT screenshot in JPEG/PNG format.",
  "procedure": [
    "Re-upload a valid brain CT scan image",
    "Ensure the image is a standard axial brain CT slice",
    "Contact your PACS administrator if exporting from a DICOM viewer",
    "Consult a radiologist directly if urgent clinical assessment is needed"
  ]
}"""

# ─── Image Helpers ───────────────────────────────────────────

def preprocess_image(raw_bytes: bytes) -> bytes:
    """
    Validate the upload is a real image, convert it to JPEG,
    and ensure it is RGB (handles greyscale CT exports correctly).
    Raises HTTP 400 if the file is not a valid image.
    """
    try:
        # Open with Pillow — this will raise if the file is corrupt/not an image
        image = Image.open(BytesIO(raw_bytes))
        image.verify()  # Verify integrity (closes the image after calling)

        # Re-open after verify (verify() closes the file handle)
        image = Image.open(BytesIO(raw_bytes))

        # CT scans are often greyscale — convert to RGB so OpenAI processes them correctly
        image = image.convert("RGB")

        # Re-encode as high-quality JPEG for the Vision API
        buffer = BytesIO()
        image.save(buffer, format="JPEG", quality=95)
        return buffer.getvalue()

    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=400,
            detail=(
                "The uploaded file is not a valid image. "
                "Please upload a CT scan exported as JPEG, PNG, BMP, or TIFF."
            ),
        )


def to_base64(image_bytes: bytes) -> str:
    """Encode image bytes as a base64 string for the OpenAI Vision API."""
    return base64.b64encode(image_bytes).decode("utf-8")

# ─── Classification Logic ─────────────────────────────────────

def classify_ct_scan(image_bytes: bytes) -> AnalysisResult:
    """
    Send the CT scan to GPT-4o Vision with the medical prompt.
    Parse the JSON response and return a validated AnalysisResult.
    """
    client = get_openai_client()
    image_b64 = to_base64(image_bytes)

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": CLASSIFICATION_PROMPT,
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{image_b64}",
                                "detail": "high",  # Use high-detail mode for medical imaging
                            },
                        },
                    ],
                }
            ],
            max_tokens=700,
            temperature=0.1,  # Low temperature = more consistent, factual output
        )
    except openai.AuthenticationError:
        raise HTTPException(
            status_code=500,
            detail="Invalid OpenAI API key. Check the value in your .env file.",
        )
    except openai.RateLimitError:
        raise HTTPException(
            status_code=429,
            detail="OpenAI rate limit reached. Wait a moment and try again.",
        )
    except openai.APIError as exc:
        raise HTTPException(
            status_code=502,
            detail=f"OpenAI API error: {exc}",
        )

    raw = response.choices[0].message.content.strip()

    # Parse the JSON — strip markdown code fences if the model adds them
    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", raw, re.DOTALL)
        if match:
            try:
                data = json.loads(match.group())
            except json.JSONDecodeError:
                raise HTTPException(
                    status_code=500,
                    detail="Model returned an unparseable response. Please try again.",
                )
        else:
            raise HTTPException(
                status_code=500,
                detail="Model returned an unparseable response. Please try again.",
            )

    # Validate severity is one of the three allowed values
    valid_severities = {"Critical", "High", "Moderate"}
    if data.get("severity") not in valid_severities:
        data["severity"] = "High"  # Fail safe to High rather than silently dropping

    # Ensure procedure always has exactly 4 steps
    procedure: list[str] = data.get("procedure", [])
    while len(procedure) < 4:
        procedure.append("Monitor patient vitals and neurological status closely.")
    procedure = procedure[:4]

    return AnalysisResult(
        haemorrhage_type=data.get("haemorrhage_type", "Unknown"),
        severity=data["severity"],
        description=data.get("description", "No description available."),
        procedure=procedure,
    )

# ─── Endpoints ───────────────────────────────────────────────

@app.post(
    "/analyse",
    response_model=AnalysisResult,
    summary="Analyse a brain CT scan for haemorrhage",
)
async def analyse(file: UploadFile = File(...)):
    """
    Upload a brain CT scan image (JPEG, PNG, BMP, or TIFF).

    Returns:
    - **haemorrhage_type**: The classified haemorrhage type
    - **severity**: Critical / High / Moderate
    - **description**: Plain-English explanation (2 sentences)
    - **procedure**: 4 clinical action steps
    """
    # Guard: reject obviously wrong file types by extension
    allowed_extensions = {".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".tif"}
    filename = file.filename or ""
    ext = os.path.splitext(filename)[1].lower()
    if ext and ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=(
                f"File type '{ext}' is not supported. "
                "Upload a CT scan as JPEG, PNG, BMP, or TIFF."
            ),
        )

    # Read uploaded bytes
    raw_bytes = await file.read()
    if not raw_bytes:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    # Validate image and convert to JPEG RGB
    processed = preprocess_image(raw_bytes)

    # Run classification
    return classify_ct_scan(processed)


@app.get("/health", summary="Health check")
async def health():
    """Returns 200 OK when the server is running."""
    return {"status": "ok", "service": "NeuroScan AI", "version": "1.0.0"}
