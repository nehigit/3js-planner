# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev    # Start dev server (opens browser automatically)
npm run build  # Build to dist/
```

No test runner is configured.

## Coding preferences

Prefer R3F-specific APIs and Drei components/utilities over native Three.js solutions whenever they offer better readability or maintainability. Fall back to raw Three.js only when R3F/Drei don't cover the use case.

## Architecture

This is a React Three Fiber (R3F) room planner app. The entry point (`src/main.jsx`) wraps everything in a `<Canvas>` with a perspective camera. `App.jsx` is the Three.js scene root — it holds scene-level state (`roomSize`) and renders into the canvas directly (no DOM elements).

**Room system** (`src/room/`):
- `Room.jsx` — renders 5 `Box` meshes (floor + 4 walls) from `{ min, max }` bounding coords. Wall event handlers disable `OrbitControls` on pointer capture to prevent camera drift during interaction.
- `CornerHandler.jsx` — invisible hotpink box that becomes visible on hover; draggable handle at each room corner using ray-plane intersection on the XZ plane. Fires `onDrag(Vector3)`.
- `ResizableRoom.jsx` — composes `Room` + 4 `CornerHandler`s, maps corner drags to `setRoom` state updates with a `MIN_SIZE = 0.5` constraint.

**Draggable** (`src/interaction/Draggable.jsx`):
- General-purpose wrapper that makes any R3F children draggable on a specified plane (`xz`, `xy`, or `yz`).
- Props: `plane`, `position`, `bounds` (soft — shows opacity feedback), `hardBounds` (hard clamp), `outOfBoundsOpacity`, `controls`, `enabled`, `onDrag`.
- Uses pointer capture for reliable drag tracking; disables `OrbitControls` during drag.
- `bounds` = soft limit (object turns semi-transparent when outside), `hardBounds` = hard clamp that prevents movement beyond limits.

**Key pattern**: All interactive 3D objects call `e.stopPropagation()` and use `e.target.setPointerCapture` / `releasePointerCapture` to own the drag event, and toggle `controls.current.enabled` to suppress camera movement during interaction.

## Project state

This is early-stage. See `README.md` backlog for planned features (2D/3D view toggle, furniture system, first-person mode, day/night). The `3js-planner/` subdirectory is a leftover scaffold — the real project lives at the repo root.
