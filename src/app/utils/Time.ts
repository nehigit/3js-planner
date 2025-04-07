import { EventDispatcher } from "three"
import ICustomEvents from "./ICustomEvents"

export default class Time extends EventDispatcher<ICustomEvents> {

    private readonly start = Date.now()
    private current = this.start
    private elapsed = 0
    private delta = 16

    constructor() {
        super()
 
        this.tick()
    }

    tick(): void {
        const currentTime = Date.now()
        this.delta = currentTime - this.current
        this.current = currentTime
        this.elapsed = this.current - this.start

        this.dispatchEvent({type: 'tick'})

        window.requestAnimationFrame(() => {
            this.tick()
        })
    }
    
}