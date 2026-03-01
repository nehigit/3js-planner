import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

// TODO: to jest do napisania od nowa bo tragedia ile tu jest zbędnego kodu

const PLANE_NORMALS = {
    xy: new THREE.Vector3(0, 0, 1),
    xz: new THREE.Vector3(0, 1, 0),
    yz: new THREE.Vector3(1, 0, 0),
    zy: new THREE.Vector3(1, 0, 0),
}
const SOFT_BOUNDS_EPSILON = 1e-5

function toVector3(value, fallback = 0) {
    if (value instanceof THREE.Vector3) return value.clone()

    if (Array.isArray(value)) {
        return new THREE.Vector3(
            Number(value[0] ?? fallback),
            Number(value[1] ?? fallback),
            Number(value[2] ?? fallback)
        )
    }

    return new THREE.Vector3(fallback, fallback, fallback)
}

function normalizeBounds(bounds) {
    if (!bounds?.min || !bounds?.max) return null
    return {
        min: toVector3(bounds.min),
        max: toVector3(bounds.max),
    }
}

function clampAxis(value, min, max) {
    if (min > max) return (min + max) / 2
    return THREE.MathUtils.clamp(value, min, max)
}

function vectorSignature(value) {
    if (value instanceof THREE.Vector3) {
        return `${value.x}|${value.y}|${value.z}`
    }

    if (Array.isArray(value)) {
        return `${value[0] ?? 0}|${value[1] ?? 0}|${value[2] ?? 0}`
    }

    return '0|0|0'
}

export default function Draggable({
    children,
    plane = 'xz',
    position = [0, 0, 0],
    bounds = null,
    hardBounds = null,
    outOfBoundsOpacity = 0.35,
    controls = null,
    enabled = true,
    onDrag = null,
}) {
    const positionSig = useMemo(() => vectorSignature(position), [position])
    const resolvedPosition = useMemo(() => toVector3(position), [positionSig])

    const groupRef = useRef()
    const initialPositionRef = useRef(resolvedPosition.clone())
    const materialStateRef = useRef(new Map())
    const isOutOfBoundsRef = useRef(false)
    const boundsRef = useRef(normalizeBounds(bounds))
    const hardBoundsRef = useRef(normalizeBounds(hardBounds))

    const dragStateRef = useRef({
        active: false,
        pointerId: null,
        plane: new THREE.Plane(),
        pointerOffset: new THREE.Vector3(),
        minOffset: new THREE.Vector3(),
        maxOffset: new THREE.Vector3(),
    })

    const scratchRef = useRef({
        hit: new THREE.Vector3(),
        worldPosition: new THREE.Vector3(),
        localPosition: new THREE.Vector3(),
        box: new THREE.Box3(),
    })

    const normalizedPlane = useMemo(() => {
        const key = String(plane).toLowerCase()
        return PLANE_NORMALS[key] ? key : 'xz'
    }, [plane])

    const planeNormal = useMemo(
        () => PLANE_NORMALS[normalizedPlane].clone(),
        [normalizedPlane]
    )

    function cacheOriginalMaterials() {
        const group = groupRef.current
        if (!group) return

        group.traverse((object) => {
            if (!object.isMesh || !object.material) return
            const materials = Array.isArray(object.material)
                ? object.material
                : [object.material]

            for (const material of materials) {
                if (!materialStateRef.current.has(material)) {
                    materialStateRef.current.set(material, {
                        opacity: material.opacity,
                        transparent: material.transparent,
                    })
                }
            }
        })
    }

    function applyOutOfBoundsOpacity(isOut) {
        cacheOriginalMaterials()

        const group = groupRef.current
        if (!group) return

        group.traverse((object) => {
            if (!object.isMesh || !object.material) return
            const materials = Array.isArray(object.material)
                ? object.material
                : [object.material]

            for (const material of materials) {
                const original = materialStateRef.current.get(material)
                if (!original) continue

                material.opacity = isOut
                    ? Math.min(original.opacity, outOfBoundsOpacity)
                    : original.opacity
                material.transparent = isOut ? true : original.transparent
                material.needsUpdate = true
            }
        })
    }

    function restoreOriginalMaterials() {
        materialStateRef.current.forEach((original, material) => {
            material.opacity = original.opacity
            material.transparent = original.transparent
            material.needsUpdate = true
        })
        materialStateRef.current.clear()
    }

    function computeWorldOffsets() {
        const group = groupRef.current
        if (!group) {
            return {
                worldPosition: new THREE.Vector3(),
                minOffset: new THREE.Vector3(),
                maxOffset: new THREE.Vector3(),
            }
        }

        const scratch = scratchRef.current
        group.updateWorldMatrix(true, true)
        const worldPosition = group.getWorldPosition(scratch.worldPosition)
        const worldBox = scratch.box.setFromObject(group)

        if (worldBox.isEmpty()) {
            dragStateRef.current.minOffset.set(0, 0, 0)
            dragStateRef.current.maxOffset.set(0, 0, 0)
        } else {
            dragStateRef.current.minOffset.copy(worldBox.min).sub(worldPosition)
            dragStateRef.current.maxOffset.copy(worldBox.max).sub(worldPosition)
        }

        return {
            worldPosition,
            minOffset: dragStateRef.current.minOffset,
            maxOffset: dragStateRef.current.maxOffset,
        }
    }

    function clampToHardBounds(targetWorldPosition, minOffset, maxOffset) {
        const limits = hardBoundsRef.current
        if (!limits) return targetWorldPosition

        targetWorldPosition.x = clampAxis(
            targetWorldPosition.x,
            limits.min.x - minOffset.x,
            limits.max.x - maxOffset.x
        )
        targetWorldPosition.y = clampAxis(
            targetWorldPosition.y,
            limits.min.y - minOffset.y,
            limits.max.y - maxOffset.y
        )
        targetWorldPosition.z = clampAxis(
            targetWorldPosition.z,
            limits.min.z - minOffset.z,
            limits.max.z - maxOffset.z
        )

        return targetWorldPosition
    }

    function isOutsideSoftBounds(worldPosition, minOffset, maxOffset) {
        const limits = boundsRef.current
        if (!limits) return false

        const minX = worldPosition.x + minOffset.x
        const minY = worldPosition.y + minOffset.y
        const minZ = worldPosition.z + minOffset.z

        const maxX = worldPosition.x + maxOffset.x
        const maxY = worldPosition.y + maxOffset.y
        const maxZ = worldPosition.z + maxOffset.z

        return (
            minX < limits.min.x - SOFT_BOUNDS_EPSILON ||
            minY < limits.min.y - SOFT_BOUNDS_EPSILON ||
            minZ < limits.min.z - SOFT_BOUNDS_EPSILON ||
            maxX > limits.max.x + SOFT_BOUNDS_EPSILON ||
            maxY > limits.max.y + SOFT_BOUNDS_EPSILON ||
            maxZ > limits.max.z + SOFT_BOUNDS_EPSILON
        )
    }

    function setOutOfBoundsState(nextValue) {
        if (isOutOfBoundsRef.current === nextValue) return
        isOutOfBoundsRef.current = nextValue
        applyOutOfBoundsOpacity(nextValue)
    }

    function updateOutOfBoundsForCurrentPosition() {
        const group = groupRef.current
        if (!group) return

        const { worldPosition, minOffset, maxOffset } = computeWorldOffsets()
        setOutOfBoundsState(
            isOutsideSoftBounds(worldPosition, minOffset, maxOffset)
        )
    }

    const onPointerDown = (e) => {
        if (!enabled) return

        const group = groupRef.current
        if (!group) return

        e.stopPropagation()
        e.target.setPointerCapture(e.pointerId)
        if (controls?.current) controls.current.enabled = false

        document.body.style.cursor = 'grabbing'

        const drag = dragStateRef.current
        const { worldPosition, minOffset, maxOffset } = computeWorldOffsets()

        drag.plane.setFromNormalAndCoplanarPoint(planeNormal, worldPosition)
        const hit = e.ray.intersectPlane(drag.plane, scratchRef.current.hit)
        if (!hit) {
            if (controls?.current) controls.current.enabled = true
            e.target.releasePointerCapture(e.pointerId)
            document.body.style.cursor = 'default'
            return
        }

        drag.active = true
        drag.pointerId = e.pointerId
        drag.pointerOffset.copy(worldPosition).sub(hit)
        drag.minOffset.copy(minOffset)
        drag.maxOffset.copy(maxOffset)
    }

    const onPointerMove = (e) => {
        const group = groupRef.current
        const drag = dragStateRef.current
        if (!enabled || !group || !drag.active) return
        if (!e.target.hasPointerCapture(e.pointerId)) return

        e.stopPropagation()

        const hit = e.ray.intersectPlane(drag.plane, scratchRef.current.hit)
        if (!hit) return

        const nextWorldPosition = scratchRef.current.worldPosition
            .copy(hit)
            .add(drag.pointerOffset)

        clampToHardBounds(nextWorldPosition, drag.minOffset, drag.maxOffset)

        const nextLocalPosition = scratchRef.current.localPosition.copy(
            nextWorldPosition
        )
        const parent = group.parent
        if (parent) {
            parent.updateWorldMatrix(true, false)
            parent.worldToLocal(nextLocalPosition)
        }

        group.position.copy(nextLocalPosition)

        setOutOfBoundsState(
            isOutsideSoftBounds(nextWorldPosition, drag.minOffset, drag.maxOffset)
        )

        onDrag?.(nextWorldPosition.clone())
    }

    const onPointerUp = (e) => {
        const drag = dragStateRef.current
        if (!drag.active) return
        if (drag.pointerId !== e.pointerId) return

        e.stopPropagation()
        if (e.target.hasPointerCapture(e.pointerId)) {
            e.target.releasePointerCapture(e.pointerId)
        }

        drag.active = false
        drag.pointerId = null

        if (controls?.current) controls.current.enabled = true
        document.body.style.cursor = 'default'

        updateOutOfBoundsForCurrentPosition()
    }

    const onPointerEnter = () => {
        if (!enabled) return
        document.body.style.cursor = dragStateRef.current.active ? 'grabbing' : 'grab'
    }

    const onPointerLeave = () => {
        if (!dragStateRef.current.active) {
            document.body.style.cursor = 'default'
        }
    }

    useEffect(() => {
        boundsRef.current = normalizeBounds(bounds)
        updateOutOfBoundsForCurrentPosition()
    }, [bounds])

    useEffect(() => {
        hardBoundsRef.current = normalizeBounds(hardBounds)
    }, [hardBounds])

    useEffect(() => {
        initialPositionRef.current.copy(resolvedPosition)
        if (groupRef.current && !dragStateRef.current.active) {
            groupRef.current.position.copy(resolvedPosition)
            updateOutOfBoundsForCurrentPosition()
        }
    }, [resolvedPosition])

    useEffect(() => {
        cacheOriginalMaterials()
        applyOutOfBoundsOpacity(isOutOfBoundsRef.current)
    }, [children, outOfBoundsOpacity])

    useEffect(() => {
        return () => {
            restoreOriginalMaterials()
            document.body.style.cursor = 'default'
        }
    }, [])

    return (
        <group
            ref={groupRef}
            position={initialPositionRef.current}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onPointerEnter={onPointerEnter}
            onPointerLeave={onPointerLeave}
        >
            {children}
        </group>
    )
}
