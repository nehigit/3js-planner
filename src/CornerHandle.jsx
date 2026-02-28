import { Box } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useMemo } from 'react'

export default function CornerHandle({ position, onDrag, controls }) {
  const { camera } = useThree()

  const plane = useMemo(
    () => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),
    []
  )

  const raycaster = useMemo(() => new THREE.Raycaster(), [])

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

    raycaster.setFromCamera(e.pointer, camera)

    const point = new THREE.Vector3()
    raycaster.ray.intersectPlane(plane, point)

    onDrag(point)
  }

  return (
    <Box
      args={[0.3, 0.3, 0.3]}
      position={position}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerMove={onPointerMove}
    >
      <meshStandardMaterial color="hotpink" />
    </Box>
  )
}