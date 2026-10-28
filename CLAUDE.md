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

- Prefer R3F-specific APIs and Drei components/utilities over native Three.js solutions whenever they offer better readability or maintainability. Fall back to raw Three.js only when R3F/Drei don't cover the use case. Before writing interaction or helper code, check whether Drei already provides it.
- Follow the Rules of React (enforced by `npm run lint`): no reading `ref.current` or mutating state/memoized values during render; use `useEffectEvent` when an effect must read the latest props without re-running on them; use `useState(() => ...)`, not `useMemo`, for objects that must stay stable.
- Mutating Three.js objects (matrices, materials) is fine in event handlers and effects, reached through refs. Fast-changing values like drag positions stay in Three objects, not React state.
- Props that only seed internal state use React's `default*` naming (`defaultPosition`). Controlled components take a value and an `onChange` that receives the next value.

## Architecture

This is a React Three Fiber (R3F) room planner app. `src/main.jsx` mounts a `<Canvas>` inside `<StrictMode>` as the React root, so there is no DOM UI layer yet. Any HTML overlay would need Drei's `<Html>` or a restructure of `main.jsx`. `App.jsx` composes the scene and owns the `room` state: `{ min: [x,y,z], max: [x,y,z] }`, the room's **interior**. Lighting lives in `src/scene/Lights.jsx`.

**Camera controls are never passed as props.** `<OrbitControls makeDefault />` registers itself in R3F state, and Drei's `DragControls` pauses it automatically during drags.

**Interaction** (`src/interaction/`): dragging is done with Drei's `DragControls`, not hand-written pointer handlers. Things to know about it:
- It positions its group through a `matrix` (`matrixAutoUpdate` is off), so a `position` prop on it is ignored. Pass the starting `Matrix4` once, then read or move the object through the group's `matrix` (via its forwarded `ref`).
- `axisLock` is the drag plane's *normal*: `axisLock="y"` drags on the XZ plane.
- `autoTransform={false}` makes it controlled: it only reports the intended matrix in `onDrag` (used by `CornerHandle`).
- `dragConfig={{ enabled }}` turns dragging on or off.
- It doesn't call `stopPropagation()`, so overlapping draggables behind each other can both start a drag.

Pieces:
- `Draggable.jsx` is uncontrolled (`defaultPosition`, `onDrag(position)`). It maps `plane` to `axisLock` and `hardBounds` to `dragLimits`, and delegates soft bounds to `useSoftBounds`.
- `useSoftBounds.js` fades the object (`setGroupOpacity`) while its center is outside `bounds`. On drop it snaps the object fully inside/outside any edge it straddles. When `bounds` change (via `useEffectEvent`), an object whose center *was* inside is pushed so it stays inside (`keepInside`), and an object that was outside isn't moved. "Was" is the last check before the change, so a fast resize can't flip an object outside. Every move is reported through `onSnap`.
- `bounds.js` holds the pure bound math. `snapToBounds` only snaps an axis if the object overlaps the bounds on the other axes, so objects beside the room aren't moved along it. `setGroupOpacity.js` multiplies each material's own opacity (remembered in `material.userData.original`) and mutates materials in place, so shared materials fade everywhere.
- `useHoverCursor.js` is hover state plus Drei's `useCursor`, shared by all draggables.

**Room system** (`src/room/`):
- `Room.jsx` builds the floor and walls *outside* `min`/`max`, so the interior is exactly the usable space and `room` can be passed straight to `Draggable` as `bounds`. Its `<group>` stops propagation of pointer events, so walls block objects behind them (orbiting from a wall still works). Objects snapped *outside* still overlap the wall's thickness.
- `ResizableRoom.jsx` is controlled (`room`, `onChange(nextRoom)`). The `CORNERS` table says which bound (`min`/`max`) each corner moves on X and Z. `moveCorner` applies a drag with `MIN_SIZE = 0.5`.
- `CornerHandle.jsx` is a handle (visible only on hover): a controlled `DragControls` on the XZ plane.

## Project state

This is an early-stage project. The `README.md` backlog (written in Polish, as are some code comments) lists planned features: a 2D/3D view toggle (GSAP transition to an orthographic top-down camera), showing wall lengths while resizing in 2D, adding/moving furniture (furniture can pass through other furniture while dragging but can't be dropped on it), a furniture attribute popup UI, first-person mode, and day/night. The `3js-planner/` subdirectory is a leftover Vite scaffold. The real project lives at the repo root.
