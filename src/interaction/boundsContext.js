import { createContext, useContext } from 'react'

// Lets things nested in a Draggable (e.g. Selectable's rotation) re-run its bounds checks:
// `updateFade()` after the object's footprint changed, `settle()` when a change is finished.
export const BoundsContext = createContext(null)

// null outside a Draggable
export const useBoundsCheck = () => useContext(BoundsContext)
