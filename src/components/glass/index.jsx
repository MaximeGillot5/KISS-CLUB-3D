import React from "react";
import styles from "./style.module.scss";
import { Canvas } from "@react-three/fiber";

import Model from "../../models/Shape";

import { Environment } from "@react-three/drei";

const index = () => {
  return (
    <Canvas>
      <Model />
      <directionalLight intensity={2} position={[0, 2, 3]} />
      <Environment preset="city" />
    </Canvas>
  );
};

export default index;
