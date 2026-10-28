import { useRef, useState } from 'react'
import { DragControls } from '@react-three/drei'
import * as THREE from 'three'
import useHoverCursor from './useHoverCursor'
import useSoftBounds from './useSoftBounds'

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

    const { updateFade, settle } = useSoftBounds(ref, {
        bounds,
        axes,
        fadedOpacity: outOfBoundsOpacity,
        onSnap: onDrag,
    })

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
            {children}
        </DragControls>
    )
}
