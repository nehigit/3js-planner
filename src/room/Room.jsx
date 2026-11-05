import { useLayoutEffect, useRef } from 'react'
import { Box, useTexture } from '@react-three/drei'
import { RepeatWrapping } from 'three'
import { setWorldUVs } from './worldUVs'
import wallColor from '../assets/textures/wall/red_brick_diff_2k.jpg'
import wallNormal from '../assets/textures/wall/red_brick_nor_gl_2k.jpg'
import wallRoughness from '../assets/textures/wall/red_brick_rough_2k.jpg'

const WALL_THICKNESS = 0.1

// metres of wall covered by one copy of the wall texture
const WALL_TEXTURE_SIZE = 1.2

const WALL_MAPS = { map: wallColor, normalMap: wallNormal, roughnessMap: wallRoughness }

// UVs are in metres (see setWorldUVs), so one repeat value fits walls of any size
function tileWallTextures(textures) {
    for (const texture of textures) {
        texture.wrapS = texture.wrapT = RepeatWrapping
        texture.repeat.setScalar(1 / WALL_TEXTURE_SIZE)
        texture.anisotropy = 16 // three.js clamps it to what the GPU supports
    }
}

const stopPropagation = (e) => e.stopPropagation()

// walls are solid to the pointer: events don't reach objects behind them
const blockPointer = {
    onClick: stopPropagation,
    onPointerOver: stopPropagation,
    onPointerMove: stopPropagation,
    onPointerDown: stopPropagation,
    onPointerUp: stopPropagation,
}


// A box with world-space UVs
function Part({ size, position, children }) {
    const ref = useRef()

    // a layout effect runs after R3F rebuilt the geometry for new `args`, before the frame is drawn
    useLayoutEffect(() => {
        // across its thickness the texture is pinned to the part, not the world, so a wall's top
        // and end strips don't slide over the texture when a resize moves the wall sideways
        const thinAxis = size.indexOf(Math.min(...size))
        const offset = position.map((value, i) => (i === thinAxis ? 0 : value))
        setWorldUVs(ref.current.geometry, offset)
    }, [size, position])

    return (
        <Box ref={ref} args={size} position={position}>
            {children}
        </Box>
    )
}


// `min`/`max` are the interior; the floor and walls are built outside it
export default function Room({ min, max, floorColor = '#d9d9d9' }) {
    const wallMaps = useTexture(WALL_MAPS, tileWallTextures)

    const t = WALL_THICKNESS
    const width = max[0] - min[0]
    const height = max[1] - min[1]
    const depth = max[2] - min[2]

    const centerX = (min[0] + max[0]) / 2
    const centerY = (min[1] + max[1]) / 2
    const centerZ = (min[2] + max[2]) / 2

    // the floor and the back/front walls span the corners, so the side walls fit between them
    const floor = { size: [width + 2 * t, t, depth + 2 * t], position: [centerX, min[1] - t / 2, centerZ] }
    const walls = [
        { name: 'back', size: [width + 2 * t, height, t], position: [centerX, centerY, min[2] - t / 2] },
        { name: 'front', size: [width + 2 * t, height, t], position: [centerX, centerY, max[2] + t / 2] },
        { name: 'left', size: [t, height, depth], position: [min[0] - t / 2, centerY, centerZ] },
        { name: 'right', size: [t, height, depth], position: [max[0] + t / 2, centerY, centerZ] },
    ]

    return (
        <group {...blockPointer}>
            <Part size={floor.size} position={floor.position}>
                <meshStandardMaterial color={floorColor} />
            </Part>

            {walls.map(({ name, size, position }) => (
                <Part key={name} size={size} position={position}>
                    <meshStandardMaterial {...wallMaps} />
                </Part>
            ))}
        </group>
    )
}
