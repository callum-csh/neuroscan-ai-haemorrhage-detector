import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Icosahedron } from "@react-three/drei";
import * as THREE from "three";

function BrainMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.3;
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      pointer.y * 0.4,
      0.05
    );
    meshRef.current.rotation.z = THREE.MathUtils.lerp(
      meshRef.current.rotation.z,
      -pointer.x * 0.3,
      0.05
    );
  });

  return (
    <Icosahedron ref={meshRef} args={[1.6, 3]}>
      <meshStandardMaterial
        color="#0f2b4e"
        wireframe
        transparent
        opacity={0.6}
      />
    </Icosahedron>
  );
}

const BrainVisual = () => (
  <div className="h-[320px] w-[320px]">
    <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      <BrainMesh />
    </Canvas>
  </div>
);

export default BrainVisual;
