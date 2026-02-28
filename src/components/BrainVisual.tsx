import { useRef, useEffect, Component, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

// ─── Error boundary ──────────────────────────────────────────────────────────
// Catches WebGL / Three.js runtime errors so the rest of the page keeps working.

interface BoundaryState { hasError: boolean }

class BrainCanvasErrorBoundary extends Component<
  { children: ReactNode; width: number; height: number },
  BoundaryState
> {
  state: BoundaryState = { hasError: false };

  static getDerivedStateFromError(): BoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div style={{ width: this.props.width, height: this.props.height }} />;
    }
    return this.props.children;
  }
}
// ─────────────────────────────────────────────────────────────────────────────

interface BrainMeshProps {
  speed?: number;
}

function BrainMesh({ speed = 0.3 }: BrainMeshProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  const { scene } = useGLTF("/brain.glb");

  // Replace every mesh material with cyan wireframe
  useEffect(() => {
    const mat = new THREE.MeshBasicMaterial({ color: "#06b6d4", wireframe: true });
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        (obj as THREE.Mesh).material = mat;
      }
    });
  }, [scene]);

  // Auto-rotation + cursor tracking
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * speed;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      pointer.y * 0.3,
      0.04
    );
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      -pointer.x * 0.2,
      0.04
    );
  });

  return (
    <group ref={groupRef} scale={2.5} position={[0, 0, 0]}>
      <primitive object={scene} />
    </group>
  );
}

interface BrainVisualProps {
  size?: number;
  speed?: number;
}

const BrainVisual = ({ size = 340, speed = 0.3 }: BrainVisualProps) => (
  <BrainCanvasErrorBoundary width={size} height={size}>
    <div style={{ width: size, height: size }}>
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[5, 5, 5]} intensity={0.4} />
        <BrainMesh speed={speed} />
      </Canvas>
    </div>
  </BrainCanvasErrorBoundary>
);

useGLTF.preload("/brain.glb");

export default BrainVisual;
