import CornerHandle from './CornerHandle'
import Room from './Room'

const MIN_SIZE = 0.5
const HANDLE_HEIGHT = 0.2

// Which bound each corner moves on the X and Z axes
const CORNERS = [
    { x: 'min', z: 'min' },
    { x: 'max', z: 'min' },
    { x: 'min', z: 'max' },
    { x: 'max', z: 'max' },
]

// Returns `room` with `corner` moved to `point`, keeping the room at least MIN_SIZE wide and deep
function moveCorner(room, corner, point) {
    const next = { min: [...room.min], max: [...room.max] }

    const setEdge = (i, side, value) => {
        next[side][i] = side === 'min'
            ? Math.min(value, room.max[i] - MIN_SIZE)
            : Math.max(value, room.min[i] + MIN_SIZE)
    }
    setEdge(0, corner.x, point.x)
    setEdge(2, corner.z, point.z)

    return next
}


// Controlled: `room` is the interior `{ min, max }`, `onChange` receives the resized room
export default function ResizableRoom({ room, onChange }) {
    return (
        <>
            <Room min={room.min} max={room.max} />

            {CORNERS.map((corner) => (
                <CornerHandle
                    key={`${corner.x}-${corner.z}`}
                    position={[room[corner.x][0], HANDLE_HEIGHT, room[corner.z][2]]}
                    onDrag={(point) => onChange(moveCorner(room, corner, point))}
                />
            ))}
        </>
    )
}
