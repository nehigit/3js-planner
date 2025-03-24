import { EventDispatcher } from "three"

export default class Time extends EventDispatcher {

    constructor() {
        super()

        this.start = Date.now()
        this.current = this.start
        this.elapsed = 0
        this.delta = 16
        this.tick()
    }

    tick() {
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