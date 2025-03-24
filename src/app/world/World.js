import * as THREE from 'three'

import Core from "../Core.js"
import Environment from './Environment.js'
import Floor from './Floor.js'
import Cube from './Cube.js'


export default class World {

    constructor() {
        this.core = Core.getInstance()
        this.scene = this.core.scene
        this.time = this.core.time
        this.debug = this.core.debug

        this.environment = new Environment()
        
        this.axesHelper = new THREE.AxesHelper(5)
        this.scene.add(this.axesHelper)
        
        this.floor = new Floor()

        this.debug.debugObject.addCube = () => {
            new Cube()
        }

        const worldFolder = this.debug.gui.addFolder('World')
        worldFolder.add(this.debug.debugObject, 'addCube')
    }
    
}
