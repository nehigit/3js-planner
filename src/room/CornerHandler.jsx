import { Box } from '@react-three/drei'
import * as THREE from 'three'
import { useMemo, useRef } from 'react'


export default function CornerHandler({ position, onDrag, controls }) {

    const box = useRef()

    const plane = useMemo(
        () => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),
        []
    )

    const onPointerDown = (e) => {
        e.stopPropagation()
        e.target.setPointerCapture(e.pointerId)
        if (controls?.current) controls.current.enabled = false
    }

    const onPointerUp = (e) => {
        e.stopPropagation()
        e.target.releasePointerCapture(e.pointerId)
        if (controls?.current) controls.current.enabled = true
    }

    const onPointerMove = (e) => {
        if (!e.target.hasPointerCapture(e.pointerId)) return

        e.stopPropagation()

        const point = e.ray.intersectPlane(plane, new THREE.Vector3())
        if (point) onDrag(point)
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
