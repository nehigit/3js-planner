import { useEffect, useEffectEvent, useRef } from 'react'
import * as THREE from 'three'
import { isOutside, keepInside, snapToBounds } from './bounds'
import setGroupOpacity from './setGroupOpacity'

const positionOf = (object) => new THREE.Vector3().setFromMatrixPosition(object.matrix)

const halfSizeOf = (object) => {
    object.updateWorldMatrix(true, true)
    return new THREE.Box3().setFromObject(object).getSize(new THREE.Vector3()).multiplyScalar(0.5)
}


export default function useSoftBounds(objectRef, { bounds, axes, fadedOpacity, onSnap }) {
    // whether the object's center was outside `bounds` at the last check (null before the first one)
    const wasOutside = useRef(null)

    const updateFade = () => {
        const object = objectRef.current
        const outside = !!bounds && isOutside(positionOf(object), bounds, axes)
        if (outside === wasOutside.current) return

        wasOutside.current = outside
        setGroupOpacity(object, outside ? fadedOpacity : 1)
    }

    // moves the object to `place(position, halfSize)`, reporting it if that's a change
    const reposition = (place) => {
        const object = objectRef.current
        const position = positionOf(object)
        const next = place(position, halfSizeOf(object))
        if (next.equals(position)) return

        object.matrix.setPosition(next)
        onSnap?.(next)
    }

    const settle = () => {
        if (bounds) reposition((position, halfSize) => snapToBounds(position, halfSize, bounds, axes))
        updateFade()
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

    return { updateFade, settle }
}
