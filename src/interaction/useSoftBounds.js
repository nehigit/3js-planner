import { useEffect, useEffectEvent, useRef } from 'react'
import * as THREE from 'three'
import { isOutside, isStraddling, keepInside, snapToBounds } from './bounds'
import setGroupOpacity from './setGroupOpacity'

const positionOf = (object) => new THREE.Vector3().setFromMatrixPosition(object.matrix)

// world-aligned half size. `precise` measures the transformed vertices, not each geometry's own
// bounding box: a rotated geometry box is up to √2 too wide (a turned sphere would stop short of the wall)
const halfSizeOf = (object) => {
    object.updateWorldMatrix(true, true)
    return new THREE.Box3().setFromObject(object, true).getSize(new THREE.Vector3()).multiplyScalar(0.5)
}


export default function useSoftBounds(objectRef, { bounds, axes, fadedOpacity, onSnap }) {
    // whether the object's center was outside `bounds` at the last check (null before the first one);
    // decides what a resize does with the object, not how it looks
    const wasOutside = useRef(null)
    const faded = useRef(false)
    // half size measured when the object is pressed, so checks during the drag and the drop use the
    // object's real size even while it's visually shrunk by press feedback (see Selectable); null otherwise
    const dragHalfSize = useRef(null)
    const currentHalfSize = () => dragHalfSize.current ?? halfSizeOf(objectRef.current)

    // the object fades while it straddles an edge, i.e. while a drop would move it
    const updateFade = () => {
        const object = objectRef.current
        const position = positionOf(object)
        wasOutside.current = !!bounds && isOutside(position, bounds, axes)

        const invalid = !!bounds && isStraddling(position, currentHalfSize(), bounds, axes)
        if (invalid === faded.current) return
        faded.current = invalid
        setGroupOpacity(object, invalid ? fadedOpacity : 1)
    }

    // moves the object to `place(position, halfSize)`, reporting it if that's a change
    const reposition = (place) => {
        const object = objectRef.current
        const position = positionOf(object)
        const next = place(position, currentHalfSize())
        if (next.equals(position)) return

        object.matrix.setPosition(next)
        onSnap?.(next)
    }

    const beginDrag = () => {
        dragHalfSize.current = halfSizeOf(objectRef.current)
    }

    const settle = () => {
        if (bounds) reposition((position, halfSize) => snapToBounds(position, halfSize, bounds, axes))
        updateFade()
        dragHalfSize.current = null
    }

    // an Effect Event reads the latest props without making them re-trigger the effect
    const onBoundsChange = useEffectEvent(() => {
        // first check: there's no "before" yet, so place the object as if it was just dropped
        if (wasOutside.current === null) {
            settle()
            return
        }
        if (bounds && !wasOutside.current) {
            reposition((position, halfSize) => keepInside(position, halfSize, bounds, axes))
        }
        updateFade()
    })
    useEffect(() => {
        onBoundsChange()
    }, [bounds])

    return { beginDrag, updateFade, settle }
}
