import { useEffect, useRef } from 'react'
import { createPortal, useFrame, useThree } from '@react-three/fiber'
import { TransformControls, useKeyboardControls } from '@react-three/drei'
import * as THREE from 'three'
import { useBoundsCheck } from './boundsContext'

// pixels the pointer may move between press and release for it to still count as a click
// (the same threshold R3F uses for pointer-missed events)
const CLICK_SLOP = 2
const DAMPING = 20
const SETTLED = 1e-3
// rotation step while the `snap` key (Shift) is held
const ROTATION_SNAP = Math.PI / 4

/*
    Press feedback and a rotation gizmo for a placed item. Controlled: `selected` shows the gizmo,
    `onSelect(next)` is called when the item is clicked (pressed and released without moving).
    - While pressed the item shrinks to `pressedScale` and grows back on release, drag or click alike.
    - When selected, Drei's TransformControls shows a single ring that rotates the item around Y.
      The rotation is the group's `rotation.y` (translation lives in the Draggable above it);
      `onRotate(angleY)` reports it. The controls are portaled to the scene root because their
      gizmo is drawn at the item's world position and would be offset again inside the Draggable.
    - TransformControls listens on the canvas, outside R3F's event system, so a press on the ring
      also reaches the item below it. It's stopped there (no shrink, no drag) while the ring is hovered.
    - With Shift held the angle snaps to multiples of 45°. That's done here rather than with the
      controls' `rotationSnap`, which snaps the change relative to where the drag started, not the angle.
*/
export default function Selectable({ selected = false, onSelect, onRotate, pressedScale = 0.9, children }) {
    const scene = useThree((state) => state.scene)
    // read on demand (not subscribed): only matters while the ring is being dragged
    const [, getKeys] = useKeyboardControls()
    // rotating changes the footprint: the Draggable above re-checks its bounds (fade, snap on release)
    const boundsCheck = useBoundsCheck()
    const group = useRef(null)
    const controls = useRef(null)
    // scale target, not state: it changes on every press and is only read by the frame loop
    const targetScale = useRef(1)
    const release = useRef(null)

    const handlePointerDown = (event) => {
        // `axis` is the ring under the pointer (set by the preceding pointer move)
        if (controls.current?.axis) {
            event.stopPropagation()
            return
        }
        targetScale.current = pressedScale
        // released on the window: DragControls captures the pointer during a drag, so the
        // pointer-up may land off the object (or off the canvas)
        release.current?.()
        const onRelease = () => {
            targetScale.current = 1
            window.removeEventListener('pointerup', onRelease)
            window.removeEventListener('pointercancel', onRelease)
            release.current = null
        }
        release.current = onRelease
        window.addEventListener('pointerup', onRelease)
        window.addEventListener('pointercancel', onRelease)
    }
    useEffect(() => () => release.current?.(), [])

    const handleClick = (event) => {
        // a click after a drag also fires; `delta` tells them apart
        if (event.delta > CLICK_SLOP) return
        // so stacked items don't both toggle
        event.stopPropagation()
        onSelect?.(!selected)
    }

    // the controls recompute the rotation from the drag start on every move, so overriding
    // the result here doesn't accumulate
    const handleRotate = () => {
        const { rotation } = group.current
        if (getKeys().snap) rotation.y = Math.round(rotation.y / ROTATION_SNAP) * ROTATION_SNAP
        boundsCheck?.updateFade()
        onRotate?.(rotation.y)
    }

    useFrame((_, delta) => {
        const target = targetScale.current
        const current = group.current.scale.x
        if (current === target) return

        // the delta is capped so a tab that was in the background doesn't jump
        const next = THREE.MathUtils.damp(current, target, DAMPING, Math.min(delta, 0.1))
        group.current.scale.setScalar(Math.abs(next - target) < SETTLED ? target : next)
    })

    return (
        <>
            <group ref={group} onPointerDown={handlePointerDown} onClick={handleClick}>
                {children}
            </group>
            {selected && createPortal(
                <TransformControls
                    ref={controls}
                    object={group}
                    mode="rotate"
                    showX={false}
                    showZ={false}
                    size={0.8}
                    onObjectChange={handleRotate}
                    onMouseUp={() => boundsCheck?.settle()}
                />,
                scene,
            )}
        </>
    )
}
