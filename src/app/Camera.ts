import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import Core from "./Core"


export default class Camera {

    private core = Core.getInstance()
    private sizes = this.core.sizes
    private scene = this.core.scene
    private readonly canvas = this.core.canvas
    readonly instance = new THREE.PerspectiveCamera(
        45,
        this.sizes.width / this.sizes.height,
        0.1,
        100
    )
    private orbitControls?: OrbitControls
    private isOrbitControlsEnabled = false

    constructor() {
        this.setupInstance()
        if(this.isOrbitControlsEnabled) {
            this.setupOrbitControls()
        }
    }

    private setupInstance() {
        this.instance.position.set(6, 10, 10)
        this.instance.lookAt(0, 0, 0)
        this.scene.add(this.instance)
    }

    private setupOrbitControls() {
        this.orbitControls = new OrbitControls(
            this.instance,
            this.canvas
        )
        this.orbitControls.enableDamping = true
    }

    public resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    public update() {
        if(this.orbitControls) {
            this.orbitControls.update()
        }
    }

}