import { useRef, useMemo, useEffect, useState } from "react";
import { useControls } from "leva";
import { debounce } from "lodash";
import styles from "./style.module.scss";
import Model from "../../models/Shape";

// 3D
import * as THREE from "three";
import { PointLightHelper } from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useHelper, Html, Environment } from "@react-three/drei";
import CustomShaderMaterial from "three-custom-shader-material";
import vertexShader from "../../shaders/vertex.glsl";
import fragmentShader from "../../shaders/fragment.glsl";
import html2canvas from "html2canvas";

const useDomToCanvas = (domEl) => {
  const [texture, setTexture] = useState();
  useEffect(() => {
    if (!domEl) return;
    const convertDomToCanvas = async () => {
      const canvas = await html2canvas(domEl, { backgroundColor: null });
      setTexture(new THREE.CanvasTexture(canvas));
    };

    convertDomToCanvas();

    const debouncedResize = debounce(() => {
      convertDomToCanvas();
    }, 100);

    window.addEventListener("resize", debouncedResize);
    return () => {
      window.removeEventListener("resize", debouncedResize);
    };
  }, [domEl]);

  return texture;
};

function Lights() {
  const pointLightRef = useRef();

  useHelper(pointLightRef, PointLightHelper, 0.7, "cyan");

  const config = useControls("Lights", {
    color: "#ffffff",
    intensity: { value: 120, min: 0, max: 5000, step: 0.01 },
    distance: { value: 15, min: 0, max: 100, step: 0.1 },
    decay: { value: 1.1, min: 0, max: 5, step: 0.1 },
    position: { value: [2, 4, 6] },
  });
  return <pointLight ref={pointLightRef} {...config} />;
}

function SceneContent() {
  const state = useThree();

  const { width, height } = state.viewport;
  const [domEl, setDomEl] = useState(null);

  const materialRef = useRef();
  const textureDOM = useDomToCanvas(domEl);

  const uniforms = useMemo(
    () => ({
      uTexture: { value: textureDOM },
      uMouse: { value: new THREE.Vector2(0, 0) },
      circlePosition: { value: new THREE.Vector2(0.8, 0.8) }, // Centre du cercle
      radius: { value: 0.5 },
    }),
    [textureDOM]
  );

  const mouseLerped = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    const mouse = state.mouse;
    mouseLerped.current.x = THREE.MathUtils.lerp(
      mouseLerped.current.x,
      mouse.x,
      0.1
    );
    mouseLerped.current.y = THREE.MathUtils.lerp(
      mouseLerped.current.y,
      mouse.y,
      0.1
    );
    materialRef.current.uniforms.uMouse.value.x = mouseLerped.current.x;
    materialRef.current.uniforms.uMouse.value.y = mouseLerped.current.y;
  });

  return (
    <>
      <Html zIndexRange={[-1, -10]} prepend fullscreen>
        <div ref={(el) => setDomEl(el)} className={styles.dom_element}>
          <p className="flex flex-col">
            KISS <br />
            CLUB <br />
            NEW <br />
            BLOG
            <br />
          </p>
        </div>
      </Html>
      <mesh>
        <planeGeometry args={[width, height, 254, 254]} />
        <CustomShaderMaterial
          ref={materialRef}
          baseMaterial={THREE.MeshStandardMaterial}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          flatShading
          silent
        />
        <Lights />
      </mesh>
    </>
  );
}

function Scene() {
  return (
    <div>
      <Canvas className={styles.canvas}>
        <SceneContent />
        <Model />
      </Canvas>
    </div>
  );
}

export default Scene;
