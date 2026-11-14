# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev    # Start dev server (opens browser automatically, exposed on LAN)
npm run build  # Build to dist/
npm run lint   # ESLint, including the Rules of React (eslint-plugin-react-hooks recommended-latest)
```

No test runner is configured. Run `npm run lint` after changing code. It must pass with no problems.

## Deployment

Every push to `main` triggers `.github/workflows/node.js.yml`, which runs `npm run lint`, builds the app and deploys `dist/` to GitHub Pages. A lint error fails the run, so nothing gets deployed. That's why `vite.config.js` sets `base: "/3js-planner/"`. Any asset paths must work under that sub-path.

## Coding preferences

- Prefer an existing @react-three/drei component or hook over custom code(controls, gizmos, cameras, loaders, shadows, Html labels, etc.). Check the threejs-impl-drei skill for available helpers before writing your own. Only write custom code when no Drei helper fits, and leave a short comment saying why.
- Prefer R3F-specific APIs and Drei components/utilities over native Three.js solutions. Before writing interaction or helper code, check whether Drei already provides it.
- Follow the Rules of React (enforced by `npm run lint`): no reading `ref.current` or mutating state/memoized values during render; use `useEffectEvent` when an effect must read the latest props without re-running on them; use `useState(() => ...)`, not `useMemo`, for objects that must stay stable.
- Mutating Three.js objects (matrices, materials) is fine in event handlers and effects, reached through refs. Fast-changing values like drag positions stay in Three objects, not React state.
- Props that only seed internal state use React's `default*` naming (`defaultPosition`). Controlled components take a value and an `onChange` that receives the next value.

## Architecture

This is a React Three Fiber (R3F) room planner app. `src/main.jsx` renders a `.layout` (see `index.css`) holding a `<main class="scene">` that the `<Canvas>` fills and DOM panels that float over it. `src/ui/Catalog.jsx` is the furniture catalog, a panel at the top left styled after the Leva GUI (its theme tokens are CSS variables in `Catalog.css`; keep new DOM UI in that style). Drei's `<Html>` is only for labels anchored in the scene. `App.jsx` composes the scene and owns the `room` state: `{ min: [x,y,z], max: [x,y,z] }`, the room's **interior**. Lighting lives in `src/scene/Lights.jsx`.

**Furniture** (`src/furniture/`): `catalog.js` is a static list of `{ id, category, size: [w,h,d] in metres, color }`. It holds no text: names come from the translations as `furniture.<id>` and `category.<category>`. Placed furniture will reference entries by `id` only and be persisted in `localStorage`; there is no backend and none is planned.

**Translations** (`src/i18n/`): the UI is in English and Polish via i18next (`react-i18next`). `en.json` is the reference with every key; `pl.json` mirrors it (a missing key falls back to English and warns in dev). Never hard-code user-facing text: use `const { t } = useTranslation()` and add the key to both files. Composed sentences are one key with `{{placeholders}}`, not concatenated pieces, because word order differs between the languages. Dimensions always use a dot as the decimal separator in both languages (`formatMetres`). The language is detected from `localStorage` (`language`) then the browser, and switched with the PL/EN button in the catalog title bar; `index.js` also keeps `<html lang>` in sync.

**Camera controls are never passed as props.** `<OrbitControls makeDefault />` registers itself in R3F state, and Drei's `DragControls` pauses it automatically during drags. Its `target` is the initial room's center (`ORBIT_TARGET` in `App.jsx`) and doesn't follow resizes.

**Interaction** (`src/interaction/`): dragging is done with Drei's `DragControls`, not hand-written pointer handlers. Things to know about it:
- It positions its group through a `matrix` (`matrixAutoUpdate` is off), so a `position` prop on it is ignored. Pass the starting `Matrix4` once, then read or move the object through the group's `matrix` (via its forwarded `ref`).
- `axisLock` is the drag plane's *normal*: `axisLock="y"` drags on the XZ plane.
- `autoTransform={false}` makes it controlled: it only reports the intended matrix in `onDrag` (used by `CornerHandle`).
- `dragConfig={{ enabled }}` turns dragging on or off.
- It doesn't call `stopPropagation()`, so overlapping draggables behind each other can both start a drag.

Pieces:
- `Draggable.jsx` is uncontrolled (`defaultPosition`, `onDrag(position)`). It maps `plane` to `axisLock` and `hardBounds` to `dragLimits`, and delegates soft bounds to `useSoftBounds`.
- `useSoftBounds.js` fades the object (`setGroupOpacity`) while it straddles an edge of `bounds` (`isStraddling`: the position a drop would correct; an object fully outside isn't faded). On drop it snaps the object fully inside/outside any edge it straddles. When `bounds` change (via `useEffectEvent`), an object whose center *was* inside is pushed so it stays inside (`keepInside`), and an object that was outside isn't moved. "Was" is the last check before the change, so a fast resize can't flip an object outside. Every move is reported through `onSnap`.
- `bounds.js` holds the pure bound math. `snapToBounds` only snaps an axis if the object overlaps the bounds on the other axes, so objects beside the room aren't moved along it. `setGroupOpacity.js` multiplies each material's own opacity (remembered in `material.userData.original`) and mutates materials in place, so shared materials fade everywhere.
- `useHoverCursor.js` is hover state plus Drei's `useCursor`, shared by all draggables.
- `Selectable.jsx` is press feedback plus a rotation gizmo, nested *inside* a `Draggable` (translation outside, rotation inside): `<Draggable><Selectable>…</Selectable></Draggable>`. Controlled: `selected`, `onSelect(next)`, optional `onRotate(angleY)`. While pressed the item damps its `scale` to 0.9 in `useFrame` (a ref holds the target, not state) and grows back on release; release is caught on `window` because `DragControls` captures the pointer. A click is an R3F `onClick` with `event.delta <= 2`, so a drag doesn't toggle. When selected, Drei's `TransformControls` (`mode="rotate"`, only Y shown) is portaled to the scene root and attached to the item's group, so rotation is the group's `rotation.y`. `TransformControls` listens on the canvas outside R3F's events, so `Selectable` stops the pointer-down on the item while the ring is hovered (`controls.axis`), otherwise the press would also start a drag. A tap (no movement) on the ring where it overlaps the room or sky still counts as a click there and deselects. With Shift held the angle snaps to multiples of 45° (absolute, done in `onObjectChange`; the controls' own `rotationSnap` would snap relative to the drag start). Keyboard state comes from Drei's `KeyboardControls` mounted in `main.jsx` with the map in `keyboard.js`; read it with `useKeyboardControls`.
- Selection is owned by `App.jsx` as `selectedId` (one gizmo at a time). Clicks on the floor or walls deselect through `Room`'s `onClick` (a click, not a drag; `Room` still stops propagation), and clicks on nothing through `onPointerMissed` on the group wrapping the scene.
- `boundsContext.js` lets things nested in a `Draggable` re-run its checks: `Selectable` calls `updateFade()` while the ring rotates the item (its footprint changes) and `settle()` when the ring is released, so a rotation that pushes the item into a wall fades it and snaps it on release like a drop.
- `useSoftBounds` measures the object's half size on pointer down (`beginDrag`, from an inner group in `Draggable`, not from `onDragStart`, which `DragControls` only fires after the pointer moved) and snaps the drop with that size, so the press shrink doesn't let objects overlap a wall.

**Room system** (`src/room/`):
- `Room.jsx` builds the floor and walls *outside* `min`/`max`, so the interior is exactly the usable space and `room` can be passed straight to `Draggable` as `bounds`. Its `<group>` stops propagation of pointer events, so walls block objects behind them (orbiting from a wall still works). Objects snapped *outside* still overlap the wall's thickness. Every part gets world-space UVs (`worldUVs.js`, in metres), so the wall texture (`src/assets/textures/wall/`, tiled once per `WALL_TEXTURE_SIZE`) keeps its scale and stays put while the room is resized. Across a part's thickness the UVs are pinned to the part instead, so wall tops don't slide over the texture.
- `ResizableRoom.jsx` is controlled (`room`, `onChange(nextRoom)`). The `CORNERS` table says which bound (`min`/`max`) each corner moves on X and Z. `moveCorner` applies a drag with `MIN_SIZE = 0.5`.
- `CornerHandle.jsx` is a handle (visible only on hover): a controlled `DragControls` on the XZ plane.

## Project state

This is an early-stage project. The `README.md` backlog (written in Polish, as are some code comments) lists planned features: a 2D/3D view toggle (GSAP transition to an orthographic top-down camera), showing wall lengths while resizing in 2D, adding/moving furniture (furniture can pass through other furniture while dragging but can't be dropped on it), a furniture attribute popup UI, first-person mode, and day/night.
