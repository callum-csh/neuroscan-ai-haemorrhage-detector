import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface BrainMeshProps {
  speed?: number;
}

function BrainMesh({ speed = 0.3 }: BrainMeshProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  // Create organic brain-like geometry from merged distorted spheres
  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1.5, 4);
    const pos = geo.attributes.position;
    const v = new THREE.Vector3();

    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);

      // Create hemisphere split and organic folds
      const fold = Math.sin(v.x * 4) * 0.06 + Math.sin(v.y * 6) * 0.04 + Math.cos(v.z * 5) * 0.05;
      // Central fissure
      const fissure = Math.exp(-v.x * v.x * 8) * -0.12;
      // Temporal lobe bulge
      const temporal = Math.exp(-(v.y + 0.5) * (v.y + 0.5) * 3) * 0.08;

      const scale = 1 + fold + fissure + temporal;
      v.multiplyScalar(scale);
      pos.setXYZ(i, v.x, v.y, v.z);
    }

    geo.computeVertexNormals();
    return geo;
  }, []);

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
    <group ref={groupRef}>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color="#0f2b4e"
          wireframe
          transparent
          opacity={0.35}
        />
      </mesh>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color="#0d9488"
          transparent
          opacity={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

interface BrainVisualProps {
  size?: number;
  speed?: number;
}

const BrainVisual = ({ size = 340, speed = 0.3 }: BrainVisualProps) => (
  <div style={{ width: size, height: size }}>
    <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 5, 5]} intensity={0.4} />
      <BrainMesh speed={speed} />
    </Canvas>
  </div>
);

export default BrainVisual;
