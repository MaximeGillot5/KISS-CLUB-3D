import React, { useRef, useState, useEffect } from "react";
import { useGLTF, MeshTransmissionMaterial } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import { useControls } from "leva";

export default function Model() {
  const { nodes, materials } = useGLTF("src/assets/3d/r_bottle.glb");
  const { viewport } = useThree();
  const torus = useRef(null);
  const materialProps = useControls({
    thickness: { value: 0.2, min: 0, max: 3, step: 0.05 },
    roughness: { value: 0, min: 0, max: 1, step: 0.1 },
    transmission: { value: 1, min: 0, max: 1, step: 0.1 },
    ior: { value: 1.2, min: 0, max: 3, step: 0.1 },
    chromaticAberration: { value: 0.5, min: 0, max: 1 },
    backside: { value: false },
  });
  const position = [-1, 0, 1.5];
  const scrollSpeed = 0.04; // Vitesse de rotation lors du scroll
  const [isScrolling, setIsScrolling] = useState(false);

  const handleScroll = () => {
    setIsScrolling(true);

    // Réinitialiser l'état isScrolling après un délai
    setTimeout(() => {
      setIsScrolling(false);
    }, 150); // 150 ms de délai pour arrêter la rotation après l'arrêt du scroll
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useFrame(() => {
    if (isScrolling && torus.current) {
      torus.current.rotation.z += scrollSpeed;
    }
  });

  if (!nodes || !materials) return null;

  return (
    <group position={position} scale={viewport.width / 6} dispose={null}>
      <mesh
        ref={torus}
        castShadow
        receiveShadow
        geometry={nodes.Cylinder002.geometry}
        material={materials["Material.001"]}
        scale={[0.341, 0.398, 0.341]}
      >
        <MeshTransmissionMaterial {...materialProps} />
      </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder003.geometry}
        material={nodes.Cylinder003.material}
        position={[0, 2.133, 0]}
        scale={0.397}
      />
    </group>
  );
}
