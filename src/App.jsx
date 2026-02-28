import { useState, useRef } from 'react'
import {
    OrbitControls,
    useHelper
} from '@react-three/drei'
import * as THREE from 'three'
import Room from './Room'
import ResizableRoom from './ResizableRoom'

export default function App() {
    const directionalLight = useRef()
    useHelper(directionalLight, THREE.DirectionalLightHelper, 1)

    const [room, setRoom] = useState({
        min: [0, 0, 0],
        max: [5, 3, 5],
    })

    return <>
        <color args={['ivory']} attach="background" />
        <OrbitControls makeDefault />
        <axesHelper args={[10]}/>

        <directionalLight position={[1, 2, 3]} intensity={1.5} />
        <ambientLight intensity={.5} />

        <ResizableRoom room={room} setRoom={setRoom} />

        <mesh>
            <sphereGeometry />
            <meshStandardMaterial />
        </mesh>
    </>
  
}
