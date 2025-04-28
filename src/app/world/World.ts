import * as THREE from 'three'

import Core from "../Core"
import Environment from './env/Environment'
import Room from './room/Room'
import Cube from './furniture/Cube'
import Furniture from './furniture/Furniture'
import Rectangle from './furniture/Rectangle'


export default class World {

    private core = Core.instance
    private scene = this.core.scene
    // TODO: maybe use a getter?
    private readonly time = this.core.time
    private debug = this.core.debug
    private environment = new Environment()
    private furnitures = new Array<Furniture>


    public constructor() {
        this.scene.add(new THREE.AxesHelper(10))
        this.scene.add(new Room())
        
        this.setupDebug()
    }
    
    private setupDebug(): void {
        const worldFolder = this.debug.gui.addFolder('World')
        
        this.debug.debugObject.addCube = () => {
            const cube = new Cube()
            this.furnitures.push(cube)
            this.scene.add(cube)
            cube.position.y = .5
        }
        worldFolder.add(this.debug.debugObject, 'addCube').name("Add Cube")

        this.debug.debugObject.addRectangle = () => {
            const rectangle = new Rectangle()
            this.furnitures.push(rectangle)
            this.scene.add(rectangle)
            rectangle.position.y = .5
        }
        worldFolder.add(this.debug.debugObject, 'addRectangle').name("Add Rectangle")

    }

    public checkCollisions() {
        
    }
}
