import React, { useRef } from "react";
import { MeshTransmissionMaterial, useGLTF } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import { useControls } from "leva";

export default function Model() {
  const { nodes, materials } = useGLTF("public/assets/3d/torrus.glb");
  const { viewport } = useThree();
  const bottleRef = useRef(null);
  const materialProps = useControls({
    opacity: { value: 2, min: 0, max: 2 }, // Use Leva to control opacity
  });
  const position = [1.5, 0, 2.8];

  useFrame((state, delta) => {
    if (bottleRef.current) {
      bottleRef.current.rotation.y += delta * 1; // Continuous rotation
    }
  });

  if (!nodes || !materials) return null;

  return (
    <group position={position} scale={viewport.width / 6} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]} scale={1}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <mesh
            ref={bottleRef}
            castShadow
            receiveShadow
            geometry={nodes.Torus002.geometry}
            material={materials.Material}
            material-transparent={true} // Enable transparency
            material-opacity={materialProps.opacity} // Control opacity
            rotation={[0, -1.356, 0]}
            scale={[0.28, 0.575, 0.28]}
          >
<MeshTransmissionMaterial
  transmission={1}        // Transmission maximale pour une transparence complète
  thickness={1}         // Contrôle la réfraction à travers l'objet
  roughness={0}           // Surface parfaitement lisse
  ior={1.9}               // Index de réfraction pour le verre
  chromaticAberration={20}  // Léger effet de dispersion de couleurs
  clearcoat={4}           // Revêtement transparent brillant
  clearcoatRoughness={0}  // Revêtement parfaitement lisse
  envMapIntensity={1}     // Intensité de la réflexion de l'environnement
  attenuationDistance={1} // Atténuation sur une plus grande distance
  attenuationColor="#ffffff" // Couleur d'atténuation blanche
/>

          </mesh>
        </group>
      </group>
    </group>
  );
}
