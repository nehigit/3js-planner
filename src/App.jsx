import { useState, useRef } from 'react'
import {
    OrbitControls,
    useHelper
} from '@react-three/drei'
import * as THREE from 'three'
import Room from './Room'

export default function App() {
    const directionalLight = useRef()
    useHelper(directionalLight, THREE.DirectionalLightHelper, 1)

    return <>
        <color args={['ivory']} attach="background" />
        <OrbitControls makeDefault />
        <axesHelper args={[10]}/>


        <directionalLight position={[1, 2, 3]} intensity={1.5} />
        <ambientLight intensity={.5} />

        <Room />

        <mesh>
            <sphereGeometry />
            <meshStandardMaterial />
        </mesh>
    </>
  
}
