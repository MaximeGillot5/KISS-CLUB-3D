import React, { useRef, useEffect } from "react";
import { useGLTF, MeshTransmissionMaterial } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import { useControls } from "leva";

export default function Model() {
  const { nodes, materials } = useGLTF("src/assets/3d/bottle.glb");
  const { viewport } = useThree();
  const bottleRef = useRef(null); // Renamed for clarity
  const materialProps = useControls({
    // Your materialProps configuration remains the same
  });
  const position = [-1, 0, 1.5];

  // Function to calculate scroll progress
  const calculateScrollProgress = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    return scrollTop / scrollHeight;
  };

  useEffect(() => {
    // You no longer need to set up event listeners for scroll events here
    // since the rotation is being handled within useFrame
  }, []);

  useFrame(() => {
    if (bottleRef.current) {
      // Calculate the current scroll progress
      const scrollProgress = calculateScrollProgress();
      // Rotate the bottle based on scroll progress (full rotation by the end of the page)
      bottleRef.current.rotation.y = scrollProgress * Math.PI * 2;
    }
  });

  if (!nodes || !materials) return null;

  return (
    <group position={position} scale={viewport.width / 6} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]} scale={0.511}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <mesh
            ref={bottleRef}
            castShadow
            receiveShadow
            geometry={nodes.Object_4.geometry}
            material={materials.bottiglia}
            rotation={[0, -1.356, 0]}
            scale={[0.28, 0.575, 0.28]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_6.geometry}
            material={materials.tappo}
            position={[0, 0.218, 0]}
            scale={[0.026, 0.017, 0.026]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_8.geometry}
            material={materials.etichetta}
            position={[0.127, -0.024, 0]}
            rotation={[0, 0, -Math.PI / 2]}
            scale={[0.092, 0.185, 0.121]}
          />
        </group>
      </group>
    </group>
  );
}
