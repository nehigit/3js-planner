import { useRef, useState } from 'react'
import { DragControls } from '@react-three/drei'
import * as THREE from 'three'
import useHoverCursor from './useHoverCursor'
import useSoftBounds from './useSoftBounds'
import { BoundsContext } from './boundsContext'

const PLANES = {
    xz: { axisLock: 'y', axes: [0, 2] },
    xy: { axisLock: 'z', axes: [0, 1] },
    yz: { axisLock: 'x', axes: [1, 2] },
}

const toDragLimits = (bounds, axes) =>
    [0, 1, 2].map((i) => axes.includes(i) ? [bounds.min[i], bounds.max[i]] : undefined)


export default function Draggable({
    plane = 'xz',
    defaultPosition = [0, 0, 0],
    bounds, // soft limit, the object fades while outside and snaps fully in or out on drop
    hardBounds, // hard clamp of the object's center
    outOfBoundsOpacity = 0.4,
    enabled = true,
    onDrag,
    children,
}) {

    const ref = useRef(null)
    const [initialMatrix] = useState(() => new THREE.Matrix4().makeTranslation(...defaultPosition))
    const [, setHovered] = useHoverCursor(enabled)
    const { axisLock, axes } = PLANES[plane]

    const { beginDrag, updateFade, settle } = useSoftBounds(ref, {
        bounds,
        axes,
        fadedOpacity: outOfBoundsOpacity,
        onSnap: onDrag,
    })
    // for nested components that change the object's footprint (rotation)
    const boundsCheck = { updateFade, settle }

    const handleDrag = (localMatrix) => {
        updateFade()
        onDrag?.(new THREE.Vector3().setFromMatrixPosition(localMatrix))
    }

    return (
        <DragControls
            ref={ref}
            matrix={initialMatrix}
            axisLock={axisLock}
            dragLimits={hardBounds && toDragLimits(hardBounds, axes)}
            dragConfig={{ enabled }}
            onHover={setHovered}
            onDrag={handleDrag}
            onDragEnd={settle}
        >
            {/* measured on pointer down rather than in onDragStart, which DragControls only fires once the
                pointer has moved; by then press feedback (Selectable) may have shrunk the object */}
            <group onPointerDown={beginDrag}>
                <BoundsContext value={boundsCheck}>
                    {children}
                </BoundsContext>
            </group>
        </DragControls>
    )
}
