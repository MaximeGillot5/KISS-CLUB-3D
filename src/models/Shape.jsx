import React, { useRef } from "react";
import { useGLTF, Text, MeshTransmissionMaterial } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import styles from "./style.module.scss";
import { useControls } from "leva";

export default function Model() {
  const { nodes } = useGLTF("src/assets/3d/torrus.glb");
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

  useFrame(() => {
    torus.current.rotation.x += 0.04;
  });

  return (
    <group position={position} scale={viewport.width / 6}>
      <mesh ref={torus} {...nodes.Torus002}>
        <MeshTransmissionMaterial {...materialProps} />
      </mesh>
    </group>
  );
}
