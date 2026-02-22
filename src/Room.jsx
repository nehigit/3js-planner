import { useState, useRef } from 'react'
import {
    OrbitControls,
    useHelper
} from '@react-three/drei'
import * as THREE from 'three'


export default function Room({ width = 5, height = 3, depth = 5, wallColor = 'lightgray' }) {
  return (
    <group>
      {/* Floor */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[width, 0.1, depth]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {/* Ceiling */}
      {/* <mesh position={[0, height, 0]}>
        <boxGeometry args={[width, 0.1, depth]} />
        <meshStandardMaterial color={wallColor} />
      </mesh> */}

      {/* Back Wall */}
      <mesh position={[0, height / 2, -depth / 2]}>
        <boxGeometry args={[width, height, 0.1]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {/* Front Wall */}
      <mesh position={[0, height / 2, depth / 2]}>
        <boxGeometry args={[width, height, 0.1]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-width / 2, height / 2, 0]}>
        <boxGeometry args={[0.1, height, depth]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {/* Right Wall */}
      <mesh position={[width / 2, height / 2, 0]}>
        <boxGeometry args={[0.1, height, depth]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>
    </group>
  );
}