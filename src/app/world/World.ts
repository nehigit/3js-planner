import * as THREE from 'three'

import Core from "../Core"
import Environment from './Environment'
import Floor from './Floor'
import Cube from './Cube'


export default class World {

    private core = Core.getInstance()
    private scene = this.core.scene
    // TODO: maybe use a getter?
    private readonly time = this.core.time
    private debug = this.core.debug
    private environment = new Environment()
    private axesHelper = new THREE.AxesHelper(10)
    private floor = new Floor()

    constructor() {
        this.scene.add(this.axesHelper)
        
        this.debug.debugObject.addCube = () => {
            new Cube()
        }

        const worldFolder = this.debug.gui.addFolder('World')
        worldFolder.add(this.debug.debugObject, 'addCube')
    }
    
}
