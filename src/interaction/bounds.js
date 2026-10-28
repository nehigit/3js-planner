import * as THREE from 'three'

// object is described by its "center" and "halfSize" (Vector3s).

const AXES = ['x', 'y', 'z']

export function isOutside(position, bounds, axes) {
    return axes.some((i) => {
        const value = position[AXES[i]]
        return value < bounds.min[i] || value > bounds.max[i]
    })
}

// check if the object overlaps the bounds on axis "i" (just touching doesn't count)
function overlapsOnAxis(center, halfSize, bounds, i) {
    const ax = AXES[i]
    return center[ax] - halfSize[ax] < bounds.max[i] && center[ax] + halfSize[ax] > bounds.min[i]
}

// moves "center" so an object of "halfSize" sits fully inside or fully outside each edge
// if the object is wider than the bounds, the `hi` edge wins.
function snapAxis(center, halfSize, lo, hi) {
    let c = center

    if (c > lo) { if (c - halfSize < lo) c = lo + halfSize }
    else        { if (c + halfSize > lo) c = lo - halfSize }

    if (c < hi) { if (c + halfSize > hi) c = hi - halfSize }
    else        { if (c - halfSize < hi) c = hi + halfSize }

    return c
}

// an edge only counts if the object overlaps the bounds on the other axes,
// so an object beside the bounds isn't moved along them
export function snapToBounds(center, halfSize, bounds, axes) {
    const snapped = center.clone()
    axes.forEach((i) => {
        const reachesEdge = axes.every((j) => j === i || overlapsOnAxis(snapped, halfSize, bounds, j))
        if (!reachesEdge) return

        const ax = AXES[i]
        snapped[ax] = snapAxis(snapped[ax], halfSize[ax], bounds.min[i], bounds.max[i])
    })
    return snapped
}

// returns a copy of "center", moved so the object is fully inside the bounds
// if the object is wider than the bounds, the "min" edge wins
export function keepInside(center, halfSize, bounds, axes) {
    const kept = center.clone()
    axes.forEach((i) => {
        const ax = AXES[i]
        kept[ax] = THREE.MathUtils.clamp(kept[ax], bounds.min[i] + halfSize[ax], bounds.max[i] - halfSize[ax])
    })
    return kept
}
