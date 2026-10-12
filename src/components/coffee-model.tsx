"use client";
import { useMemo } from "react";
import * as THREE from "three";
export function CoffeeModel({ color }: { color: string }) {
  const profile = useMemo(
    () =>
      [
        [0, -0.84],
        [0.58, -0.84],
        [0.72, -0.73],
        [0.87, 0.57],
        [0.88, 0.73],
        [0.84, 0.77],
        [0.78, 0.72],
        [0.7, -0.61],
        [0, -0.61],
      ].map(([x, y]) => new THREE.Vector2(x, y)),
    [],
  );
  const heart = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, -0.28);
    s.bezierCurveTo(-0.7, 0.05, -0.22, 0.5, 0, 0.19);
    s.bezierCurveTo(0.22, 0.5, 0.7, 0.05, 0, -0.28);
    return s;
  }, []);
  const steam = useMemo(
    () =>
      [-0.37, 0, 0.37].map(
        (x, i) =>
          new THREE.CatmullRomCurve3([
            new THREE.Vector3(x, 1.01, 0),
            new THREE.Vector3(x - 0.1, 1.26, 0.03),
            new THREE.Vector3(x + 0.09, 1.5, 0),
            new THREE.Vector3(x, 1.73 + i * 0.1, -0.03),
          ]),
      ),
    [],
  );
  return (
    <group position={[-0.16, 0.05, 0]} scale={1.22}>
      <mesh>
        <latheGeometry args={[profile, 64]} />
        <meshStandardMaterial color={color} roughness={0.26} metalness={0.08} />
      </mesh>
      <mesh position={[0.98, 0.06, 0]} scale={[0.73, 1, 1]}>
        <torusGeometry args={[0.45, 0.13, 20, 64]} />
        <meshStandardMaterial color={color} roughness={0.26} />
      </mesh>
      <mesh position={[0, 0.667, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.78, 64]} />
        <meshStandardMaterial color="#91502d" roughness={0.22} />
      </mesh>
      <mesh position={[0, 0.673, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.72, 0.77, 64]} />
        <meshStandardMaterial color="#d09b61" roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.68, 0.04]} rotation={[-Math.PI / 2, 0, -0.18]}>
        <shapeGeometry args={[heart]} />
        <meshStandardMaterial
          color="#ffebc9"
          roughness={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
      {[-0.19, 0.19].map((x) => (
        <mesh key={x} position={[x, 0.12, 0.812]} scale={[1, 1.35, 0.4]}>
          <sphereGeometry args={[0.047, 16, 16]} />
          <meshStandardMaterial color="#302131" roughness={0.7} />
        </mesh>
      ))}
      <mesh position={[0, -0.09, 0.787]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[0.2, 0.029, 10, 40, Math.PI]} />
        <meshStandardMaterial color="#302131" roughness={0.7} />
      </mesh>
      <mesh position={[0, -1.1, 0]}>
        <cylinderGeometry args={[1.28, 1.18, 0.12, 64]} />
        <meshStandardMaterial color="#b7a0ed" roughness={0.3} />
      </mesh>
      <mesh position={[0, -1.032, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.18, 0.06, 12, 64]} />
        <meshStandardMaterial color="#d3c0ff" roughness={0.28} />
      </mesh>
      {steam.map((curve, i) => (
        <mesh key={i}>
          <tubeGeometry args={[curve, 20, 0.014, 6, false]} />
          <meshBasicMaterial color="#dfcfff" transparent opacity={0.28} />
        </mesh>
      ))}
    </group>
  );
}
