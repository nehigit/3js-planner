import { useRef } from 'react'
import {
    OrbitControls,
    useHelper
} from '@react-three/drei'
import * as THREE from 'three'
import ResizableRoom from './room/ResizableRoom'

export default function App() {
    const directionalLight = useRef()
    const controls = useRef()
    useHelper(directionalLight, THREE.DirectionalLightHelper, 1)

    return <>
        <color args={['ivory']} attach="background" />
        <OrbitControls ref={controls} makeDefault />
        <axesHelper args={[10]}/>

        <directionalLight position={[1, 2, 3]} intensity={1.5} />
        <ambientLight intensity={.5} />

        <ResizableRoom controls={controls} />

        <mesh>
            <sphereGeometry />
            <meshStandardMaterial />
        </mesh>
    </>
  
}
