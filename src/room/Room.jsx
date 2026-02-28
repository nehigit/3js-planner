import { Box } from "@react-three/drei"


export default function Room({ min, max, thickness = 0.1, color = '#d9d9d9', controls }) {
    const width = max[0] - min[0]
    const height = max[1] - min[1]
    const depth = max[2] - min[2]

    const centerX = (min[0] + max[0]) / 2
    const centerY = (min[1] + max[1]) / 2
    const centerZ = (min[2] + max[2]) / 2

    const stopPropagation = (e) => {
        e.stopPropagation()
    }

    const onWallPointerDown = (e) => {
        e.stopPropagation()
        e.target.setPointerCapture(e.pointerId)
        if (controls?.current) controls.current.enabled = false
    }

    const onWallPointerUp = (e) => {
        e.stopPropagation()
        e.target.releasePointerCapture(e.pointerId)
        if (controls?.current) controls.current.enabled = true
    }
    
    const wallEventHandlers = {
        onClick: stopPropagation,
        onPointerOver: stopPropagation,
        onPointerMove: stopPropagation,
        onPointerDown: onWallPointerDown,
        onPointerUp: onWallPointerUp,
    }

    return (
        <group>
            <Box
                args={[width, thickness, depth]}
                position={[centerX, min[1], centerZ]}
                {...wallEventHandlers}
            >
                <meshStandardMaterial color={color} />
            </Box>

            <Box
                args={[width, height, thickness]}
                position={[centerX, centerY, min[2]]}
                {...wallEventHandlers}
            >
                <meshStandardMaterial color={color} />
            </Box>

            <Box
                args={[width, height, thickness]}
                position={[centerX, centerY, max[2]]}
                {...wallEventHandlers}
            >
                <meshStandardMaterial color={color} />
            </Box>

            <Box
                args={[thickness, height, depth]}
                position={[min[0], centerY, centerZ]}
                {...wallEventHandlers}
            >
                <meshStandardMaterial color={color} />
            </Box>

            <Box
                args={[thickness, height, depth]}
                position={[max[0], centerY, centerZ]}
                {...wallEventHandlers}
            >
                <meshStandardMaterial color={color} />
            </Box>
        </group>
    )
}
