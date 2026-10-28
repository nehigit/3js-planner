import { Box, DragControls } from '@react-three/drei'
import * as THREE from 'three'
import useHoverCursor from '../interaction/useHoverCursor'

const SIZE = 0.3


/*
    Pink handle (visible on hover) that drags on the horizontal plane.
    Controlled: it sits wherever `position` says, DragControls only reports the intended position through `onDrag`.
*/
export default function CornerHandle({ position, onDrag }) {
    const [hovered, setHovered] = useHoverCursor()
    const matrix = new THREE.Matrix4().makeTranslation(...position)

    return (
        <DragControls
            matrix={matrix}
            autoTransform={false}
            axisLock="y"
            onHover={setHovered}
            onDrag={(intended) => onDrag(new THREE.Vector3().setFromMatrixPosition(intended))}
        >
            <Box args={[SIZE, SIZE, SIZE]} visible={hovered}>
                <meshStandardMaterial color="hotpink" />
            </Box>
        </DragControls>
    )
}
