// Drei has no helper for this. BoxGeometry stretches a texture 0–1 across each face, so it would
// stretch with every resize. This sets each vertex's UV to its world position in metres, on the
// two axes of its face, so the texture keeps its scale and stays put while the room is resized.
// `offset` is added to the geometry's (origin-centered) positions, normally the mesh's position.
export function setWorldUVs(geometry, [ox, oy, oz]) {
    const { position, normal, uv } = geometry.attributes

    for (let i = 0; i < position.count; i++) {
        const x = position.getX(i) + ox
        const y = position.getY(i) + oy
        const z = position.getZ(i) + oz
        const nx = normal.getX(i)
        const ny = normal.getY(i)
        const nz = normal.getZ(i)

        // signs follow BoxGeometry's own UV directions, so no face is mirrored (normal maps rely on it)
        if (nx !== 0) uv.setXY(i, -z * nx, y)
        else if (ny !== 0) uv.setXY(i, x, -z * ny)
        else uv.setXY(i, x * nz, y)
    }
    uv.needsUpdate = true
}
