import * as THREE from 'three'

import Core from "../Core.js"


export default class Environment {
    constructor() {
        this.core = Core.getInstance()
        this.scene = this.core.scene
        this.debug = this.core.debug

        this.setAmbientLight()
        this.setDirectionalLight()
    }

    setAmbientLight() {
        this.ambientLight = new THREE.AmbientLight('#fff', 1)
        
        this.scene.add(this.ambientLight)
    }

    setDirectionalLight() {
        this.directionalLight = new THREE.DirectionalLight('#fff', 4)
        this.directionalLight.castShadow = true
        this.directionalLight.shadow.camera.far = 15
        this.directionalLight.position.set(3.5, 2, - 1.25)

        this.scene.add(this.directionalLight)

        const folder = this.debug.gui.addFolder('DirectionalLight')
        folder.add(this.directionalLight, 'intensity').min(0).max(10).step(0.001).name('lightIntensity')
        folder.add(this.directionalLight.position, 'x').min(- 5).max(5).step(0.001).name('lightX')
        folder.add(this.directionalLight.position, 'y').min(- 5).max(5).step(0.001).name('lightY')
        folder.add(this.directionalLight.position, 'z').min(- 5).max(5).step(0.001).name('lightZ')
    }
}