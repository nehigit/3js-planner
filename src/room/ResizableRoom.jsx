import CornerHandler from './CornerHandler'
import Room from './Room'


export default function ResizableRoom({ room, setRoom, controls }) {
    const { min, max } = room
    const MIN_SIZE = 0.5

    const updateCorner = (corner, point) => {
        setRoom((prev) => {
            let newMin = [...prev.min]
            let newMax = [...prev.max]

            if (corner === 'bl') {
                newMin[0] = Math.min(point.x, prev.max[0] - MIN_SIZE)
                newMin[2] = Math.min(point.z, prev.max[2] - MIN_SIZE)
            }

            if (corner === 'br') {
                newMax[0] = Math.max(point.x, prev.min[0] + MIN_SIZE)
                newMin[2] = Math.min(point.z, prev.max[2] - MIN_SIZE)
            }

            if (corner === 'tl') {
                newMin[0] = Math.min(point.x, prev.max[0] - MIN_SIZE)
                newMax[2] = Math.max(point.z, prev.min[2] + MIN_SIZE)
            }

            if (corner === 'tr') {
                newMax[0] = Math.max(point.x, prev.min[0] + MIN_SIZE)
                newMax[2] = Math.max(point.z, prev.min[2] + MIN_SIZE)
            }

            return { min: newMin, max: newMax }
        })
    }

    return (
    <>
        <Room min={min} max={max} />

        <CornerHandler
            position={[min[0], 0.2, min[2]]}
            onDrag={(p) => updateCorner('bl', p)}
            controls={controls}
        />
        <CornerHandler
            position={[max[0], 0.2, min[2]]}
            onDrag={(p) => updateCorner('br', p)}
            controls={controls}
        />
        <CornerHandler
            position={[min[0], 0.2, max[2]]}
            onDrag={(p) => updateCorner('tl', p)}
            controls={controls}
        />
        <CornerHandler
            position={[max[0], 0.2, max[2]]}
            onDrag={(p) => updateCorner('tr', p)}
            controls={controls}
        />
    </>
    )
}
