import { EventDispatcher } from "three"
import ICustomEvents from "./ICustomEvents"

export default class Sizes extends EventDispatcher<ICustomEvents> {
    
    public width = window.innerWidth
    public height = window.innerHeight
    public pixelRatio = Math.min(window.devicePixelRatio, 2)

    constructor() {
        super()
        
        // Update sizes on window resize
        window.addEventListener('resize', () => {
            // Using addEventListener on a global window object only once and using
            // my own events is better for having more control
            this.width = window.innerWidth
            this.height = window.innerHeight
            
            // "Yell" this event to all instances of this class
            this.dispatchEvent({ type: "windowResize" })
        })
    }

}