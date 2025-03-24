import { EventDispatcher } from "three"

export default class Sizes extends EventDispatcher {

    constructor() {
        super()

        this.width = window.innerWidth
        this.height = window.innerHeight
        this.pixelRatio = Math.min(window.devicePixelRatio, 2)
        
        // Update sizes on window resize
        window.addEventListener('resize', () => {
            // Using addEventListener on a global window object only once and using
            // my own events is better for having more control
            this.width = window.innerWidth
            this.height = window.innerHeight
            
            // "Yell" this event to all instances of this class
            this.dispatchEvent({type: 'myCustomResizeEvent'})            
        })
    }

}