import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PLANES = {
  xz: { normal: [0, 1, 0], fixedAxis: 'y', moveIndices: [0, 2] },
  xy: { normal: [0, 0, 1], fixedAxis: 'z', moveIndices: [0, 1] },
  yz: { normal: [1, 0, 0], fixedAxis: 'x', moveIndices: [1, 2] },
}

const AXES = ['x', 'y', 'z']

export default function Draggable({
  plane = 'xz',
  position = [0, 0, 0],
  bounds,
  hardBounds,
  outOfBoundsOpacity = 0.4,
  controls,
  enabled = true,
  onDrag,
  children,
}) {
  const groupRef = useRef()
  const posRef = useRef(new THREE.Vector3(...position))
  const dragPlane = useRef(new THREE.Plane())
  const dragOffset = useRef(new THREE.Vector3())
  const isOutOfBounds = useRef(false)
  const opacityDirty = useRef(false)
  const isDragging = useRef(false)

  useFrame(() => {
    if (!opacityDirty.current || !groupRef.current) return
    opacityDirty.current = false
    const opacity = isOutOfBounds.current ? outOfBoundsOpacity : 1
    groupRef.current.traverse(obj => {
      if (obj.isMesh && obj.material) {
        const wantsTransparent = opacity < 1
        if (obj.material.transparent !== wantsTransparent) {
          obj.material.transparent = wantsTransparent
          obj.material.needsUpdate = true
        }
        obj.material.opacity = opacity
      }
    })
  })

  const onPointerDown = (e) => {
    if (!enabled) return
    e.stopPropagation()
    e.target.setPointerCapture(e.pointerId)
    if (controls?.current) controls.current.enabled = false
    isDragging.current = true

    const cfg = PLANES[plane]
    dragPlane.current.set(
      new THREE.Vector3(...cfg.normal),
      -posRef.current[cfg.fixedAxis]
    )

    const hit = new THREE.Vector3()
    e.ray.intersectPlane(dragPlane.current, hit)
    cfg.moveIndices.forEach(i => {
      const ax = AXES[i]
      dragOffset.current[ax] = posRef.current[ax] - hit[ax]
    })
  }

  const onPointerMove = (e) => {
    if (!isDragging.current || !e.target.hasPointerCapture(e.pointerId)) return
    e.stopPropagation()

    const cfg = PLANES[plane]
    const hit = new THREE.Vector3()
    if (!e.ray.intersectPlane(dragPlane.current, hit)) return

    cfg.moveIndices.forEach(i => {
      const ax = AXES[i]
      hit[ax] += dragOffset.current[ax]
      if (hardBounds) {
        hit[ax] = THREE.MathUtils.clamp(hit[ax], hardBounds.min[i], hardBounds.max[i])
      }
    })

    posRef.current.copy(hit)
    groupRef.current.position.copy(hit)

    const oob = bounds
      ? cfg.moveIndices.some(i => {
          const ax = AXES[i]
          return hit[ax] < bounds.min[i] || hit[ax] > bounds.max[i]
        })
      : false

    if (oob !== isOutOfBounds.current) {
      isOutOfBounds.current = oob
      opacityDirty.current = true
    }

    onDrag?.(posRef.current.clone())
  }

  const onPointerUp = (e) => {
    if (!isDragging.current) return
    e.stopPropagation()
    e.target.releasePointerCapture(e.pointerId)
    if (controls?.current) controls.current.enabled = true
    isDragging.current = false

    // Snapowanie po upuszczeniu
    if (bounds && groupRef.current) {
      const cfg = PLANES[plane]
      groupRef.current.updateWorldMatrix(true, true)
      const box = new THREE.Box3().setFromObject(groupRef.current)
      const halfSize = box.getSize(new THREE.Vector3()).multiplyScalar(0.5)

      let snapped = false
      cfg.moveIndices.forEach(i => {
        const ax = AXES[i]
        let c = posRef.current[ax]
        const half = halfSize[ax]
        const lo = bounds.min[i]
        const hi = bounds.max[i]

        if (c > lo) { if (c - half < lo) { c = lo + half; snapped = true } }
        else        { if (c + half > lo) { c = lo - half; snapped = true } }

        if (c < hi) { if (c + half > hi) { c = hi - half; snapped = true } }
        else        { if (c - half < hi) { c = hi + half; snapped = true } }

        posRef.current[ax] = c
      })

      if (snapped) {
        groupRef.current.position.copy(posRef.current)
        
        /*
            Ponowne sprawdzenie transparentności po upuszczeniu. Nie powinno być potrzebne.
            Jeśli będą bugi z tym związane to trzeba odkomentować.
        */
        // const oob = cfg.moveIndices.some(i => {
        //   const ax = AXES[i]
        //   return posRef.current[ax] < bounds.min[i] || posRef.current[ax] > bounds.max[i]
        // })
        // if (oob !== isOutOfBounds.current) {
        //   isOutOfBounds.current = oob
        //   opacityDirty.current = true
        // }
      }
    }
  }

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {children}
    </group>
  )
}
