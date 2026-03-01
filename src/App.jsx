import {
    useRef,
    useState
} from 'react'
import {
    OrbitControls,
    useHelper
} from '@react-three/drei'
import * as THREE from 'three'
import ResizableRoom from './room/ResizableRoom'
import Draggable from './interaction/Draggable'


export default function App() {
    const directionalLight = useRef()
    const controls = useRef()

    useHelper(directionalLight, THREE.DirectionalLightHelper, 1)

    const [roomSize, setRoomSize] = useState(() => ({
        min: [0, 0, 0],
        max: [5, 3, 5],
    }))

    return <>
        <color args={['ivory']} attach="background" />
        <OrbitControls ref={controls} makeDefault />
        <axesHelper args={[10]} />

        <directionalLight ref={directionalLight} position={[1, 2, 3]} intensity={1.5} />
        <ambientLight intensity={.5} />

        <ResizableRoom controls={controls} room={roomSize} setRoom={setRoomSize}/>

        <Draggable controls={controls} bounds={roomSize} position={[0, 1, 0]} plane="xz">
            <mesh>
                <sphereGeometry />
                <meshStandardMaterial color="orange" />
            </mesh>
        </Draggable>
    </>
}
