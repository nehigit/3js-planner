import { useRef } from 'react'
import { useHelper } from '@react-three/drei'
import * as THREE from 'three'


export default function Lights() {
    const directionalLight = useRef(null)
    useHelper(directionalLight, THREE.DirectionalLightHelper, 1)

    return (
        <>
            <directionalLight ref={directionalLight} position={[1, 2, 3]} intensity={1.5} />
            <ambientLight intensity={0.5} />
        </>
    )
}
