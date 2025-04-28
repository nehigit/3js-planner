import * as THREE from 'three'

import Core from "../../Core"


export default class Environment {

    private core = Core.instance
    private scene = this.core.scene
    private debug = this.core.debug
    private directionalLight!: THREE.DirectionalLight // FIXME: optimize type imports??
    private ambientLight!: THREE.AmbientLight

    public constructor() {
        this.setupAmbientLight()
        this.scene.add(this.ambientLight)

        this.setupDirectionalLight()
        this.scene.add(this.directionalLight)
    }

    private setupAmbientLight(): void {
        this.ambientLight = new THREE.AmbientLight('#fff', 5)
    }

    private setupDirectionalLight(): void {
        this.directionalLight = new THREE.DirectionalLight('#fff', 4)
        this.directionalLight.castShadow = true
        this.directionalLight.shadow.camera.far = 15
        this.directionalLight.position.set(3.5, 2, - 1.25)

        // TODO: maybe make this a function
        const folder = this.debug.gui.addFolder('DirectionalLight')
        folder.add(this.directionalLight, 'intensity').min(0).max(10).step(0.001).name('lightIntensity')
        folder.add(this.directionalLight.position, 'x').min(- 5).max(5).step(0.001).name('lightX')
        folder.add(this.directionalLight.position, 'y').min(- 5).max(5).step(0.001).name('lightY')
        folder.add(this.directionalLight.position, 'z').min(- 5).max(5).step(0.001).name('lightZ')
    }
}