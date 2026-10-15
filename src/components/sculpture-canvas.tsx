"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, Float, TrackballControls } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import { CoffeeModel } from "./coffee-model";
function Form({
  color,
  product,
  progress,
}: {
  color: string;
  product: boolean;
  progress?: React.RefObject<number>;
}) {
  const mesh = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!mesh.current || product) return;
    const scroll = product ? 0 : (progress?.current ?? 0);
    const targetY =
      scroll * Math.PI +
      state.pointer.x * 0.4 +
      Math.sin(state.clock.elapsedTime * 0.3) * 0.12;
    mesh.current.rotation.y = THREE.MathUtils.damp(
      mesh.current.rotation.y,
      targetY,
      12,
      delta,
    );
    mesh.current.rotation.z = THREE.MathUtils.damp(
      mesh.current.rotation.z,
      product ? -0.2 : -0.12,
      5,
      delta,
    );
    mesh.current.rotation.x = THREE.MathUtils.damp(
      mesh.current.rotation.x,
      state.pointer.y * 0.18 + 0 + 0.3,
      3,
      delta,
    );
  });
  return (
    <Float enabled={!product} speed={1.4} rotationIntensity={0.12} floatIntensity={0.25}>
      <group ref={mesh} rotation={[0.3, 0, product ? -0.2 : -0.12]}>
        {product ? (
          <>
            <mesh>
              <cylinderGeometry args={[0.87, 0.87, 2.4, 64]} />
              <meshStandardMaterial
                color={color}
                metalness={0.7}
                roughness={0.4}
              />
            </mesh>
            {Array.from({ length: 30 }, (_, i) => (
              <mesh
                key={i}
                position={[0, -1.12 + i * 0.077, 0]}
                rotation={[Math.PI / 2, 0, 0]}
              >
                <torusGeometry args={[0.875, 0.013, 6, 64]} />
                <meshStandardMaterial
                  color="#252b23"
                  metalness={0.5}
                  roughness={0.6}
                />
              </mesh>
            ))}
            <mesh position={[0, 1.21, 0]}>
              <cylinderGeometry args={[0.79, 0.79, 0.025, 64]} />
              <meshStandardMaterial
                color="#20281d"
                metalness={0.6}
                roughness={0.3}
              />
            </mesh>
            <mesh position={[0, -0.94, 0.88]}>
              <sphereGeometry args={[0.025, 12, 12]} />
              <meshStandardMaterial
                color="#d6f76f"
                emissive="#d6f76f"
                emissiveIntensity={2}
              />
            </mesh>
          </>
        ) : (
          <CoffeeModel color={color} />
        )}
      </group>
    </Float>
  );
}
export default function SculptureCanvas({
  color = "#ff9669",
  product = false,
  active = true,
  onFailure,
  progress,
}: {
  color?: string;
  product?: boolean;
  active?: boolean;
  onFailure: () => void;
  progress?: React.RefObject<number>;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, 6.2], fov: 42 }}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", onFailure, {
          once: true,
        });
      }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 5]} intensity={3} />
      <Form color={color} product={product} progress={progress} />
      {product && (
        <TrackballControls
          makeDefault
          enabled={active}
          noZoom
          noPan
          staticMoving
          rotateSpeed={3}
        />
      )}
      <Environment resolution={128}>
        <Lightformer intensity={4} position={[0, 4, -2]} scale={[10, 3, 1]} />
        <Lightformer
          intensity={3}
          position={[-5, 1, 2]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[5, 5, 1]}
        />
        <Lightformer
          intensity={2}
          position={[5, -2, 1]}
          rotation={[0, -Math.PI / 2, 0]}
          scale={[6, 2, 1]}
        />
      </Environment>
    </Canvas>
  );
}
