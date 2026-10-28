import { useState } from 'react'
import { OrbitControls } from '@react-three/drei'
import Lights from './scene/Lights'
import ResizableRoom from './room/ResizableRoom'
import Draggable from './interaction/Draggable'

// interior of the room; walls are built outside it
const INITIAL_ROOM = {
    min: [0, 0, 0],
    max: [5, 3, 5],
}


export default function App() {
    const [room, setRoom] = useState(INITIAL_ROOM)

    return <>
        <color args={['ivory']} attach="background" />
        {/* makeDefault registers it in R3F state, so DragControls can pause it while dragging */}
        <OrbitControls makeDefault />
        <axesHelper args={[10]} />
        <Lights />

        <ResizableRoom room={room} onChange={setRoom} />

        <Draggable bounds={room} defaultPosition={[2.5, 1, 2.5]}>
            <mesh>
                <sphereGeometry />
                <meshStandardMaterial color="orange" />
            </mesh>
        </Draggable>
    </>
}
