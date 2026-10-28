import { useState } from 'react'
import { useCursor } from '@react-three/drei'


// hover state that also shows the pointer cursor while hovered (and "enabled")
export default function useHoverCursor(enabled = true) {
    const [hovered, setHovered] = useState(false)
    useCursor(hovered && enabled)

    return [hovered, setHovered]
}
