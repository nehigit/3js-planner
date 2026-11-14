import { useRef } from 'react'
import { Environment, useHelper } from '@react-three/drei'
import * as THREE from 'three'
// `?url` because Vite doesn't treat .hdr as an asset by default
import hdri from '../assets/hdri/citrus_orchard_road_puresky_2k.hdr?url'


export default function Lights() {
    const directionalLight = useRef(null)
    useHelper(directionalLight, THREE.DirectionalLightHelper, 1)

    return (
        <>
            {/* image-based lighting; replaces the ambient light. Without `background` the scene's own background stays */}
            <Environment files={hdri} environmentIntensity={0.8} background />
            <directionalLight ref={directionalLight} position={[1, 2, 3]} intensity={1.5} />
        </>
    )
}
