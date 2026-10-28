import { Box } from "@react-three/drei"

const WALL_THICKNESS = 0.1

const stopPropagation = (e) => e.stopPropagation()

// walls are solid to the pointer: events don't reach objects behind them
const blockPointer = {
    onClick: stopPropagation,
    onPointerOver: stopPropagation,
    onPointerMove: stopPropagation,
    onPointerDown: stopPropagation,
    onPointerUp: stopPropagation,
}


// `min`/`max` are the interior; the floor and walls are built outside it
export default function Room({ min, max, color = '#d9d9d9' }) {
    const t = WALL_THICKNESS
    const width = max[0] - min[0]
    const height = max[1] - min[1]
    const depth = max[2] - min[2]

    const centerX = (min[0] + max[0]) / 2
    const centerY = (min[1] + max[1]) / 2
    const centerZ = (min[2] + max[2]) / 2

    // the floor and the back/front walls span the corners, so the side walls fit between them
    const parts = [
        { name: 'floor', size: [width + 2 * t, t, depth + 2 * t], position: [centerX, min[1] - t / 2, centerZ] },
        { name: 'back', size: [width + 2 * t, height, t], position: [centerX, centerY, min[2] - t / 2] },
        { name: 'front', size: [width + 2 * t, height, t], position: [centerX, centerY, max[2] + t / 2] },
        { name: 'left', size: [t, height, depth], position: [min[0] - t / 2, centerY, centerZ] },
        { name: 'right', size: [t, height, depth], position: [max[0] + t / 2, centerY, centerZ] },
    ]

    return (
        <group {...blockPointer}>
            {parts.map(({ name, size, position }) => (
                <Box key={name} args={size} position={position}>
                    <meshStandardMaterial color={color} />
                </Box>
            ))}
        </group>
    )
}
