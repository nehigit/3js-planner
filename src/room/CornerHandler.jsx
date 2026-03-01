import { Box } from '@react-three/drei'
import * as THREE from 'three'
import { useMemo, useRef } from 'react'


export default function CornerHandler({ position, onDrag, controls }) {

    const box = useRef()
    const dragOffset = useRef(null)

    const plane = useMemo(
        () => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),
        []
    )

    const onPointerDown = (e) => {
        e.stopPropagation()
        e.target.setPointerCapture(e.pointerId)
        if (controls?.current) controls.current.enabled = false

        // fixes drag snapping directly to the current ray-plane hit point
        const point = e.ray.intersectPlane(plane, new THREE.Vector3())
        if (point) {
            dragOffset.current = {
                x: position[0] - point.x,
                z: position[2] - point.z,
            }
        }
    }

    const onPointerUp = (e) => {
        e.stopPropagation()
        e.target.releasePointerCapture(e.pointerId)
        if (controls?.current) controls.current.enabled = true
        
        // clear offset (snapping fix)
        dragOffset.current = null
    }

    const onPointerMove = (e) => {
        if (!e.target.hasPointerCapture(e.pointerId)) return

        e.stopPropagation()

        const point = e.ray.intersectPlane(plane, new THREE.Vector3())
        if (!point) return

        const offsetX = dragOffset.current?.x ?? 0
        const offsetZ = dragOffset.current?.z ?? 0

        onDrag(new THREE.Vector3(point.x + offsetX, point.y, point.z + offsetZ))
    }

    const onPointerEnter = (e) => {
        document.body.style.cursor = 'pointer'
        box.current.visible = true
    }

    const onPointerLeave = (e) => {
        document.body.style.cursor = 'default'
        box.current.visible = false
    }

    return (
        <Box
            ref={box}
            args={[0.3, 0.3, 0.3]}
            position={position}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerMove={onPointerMove}
            onPointerEnter={onPointerEnter}
            onPointerLeave={onPointerLeave}
            visible={false}
        >
            <meshStandardMaterial color="hotpink" />
        </Box>
    )
}
