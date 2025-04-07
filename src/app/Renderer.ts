import * as THREE from 'three'

import Core from "./Core"


export default class Renderer {

    private core = Core.getInstance()
    private canvas = this.core.canvas
    private sizes = this.core.sizes
    private scene = this.core.scene
    private camera = this.core.camera
    private instance = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true
    })

    public constructor() {
        this.setupInstance()
    }

    private setupInstance(): void {
        this.instance.toneMapping = THREE.CineonToneMapping
        this.instance.toneMappingExposure = 1.75
        this.instance.shadowMap.enabled = true
        this.instance.shadowMap.type = THREE.PCFSoftShadowMap
        this.instance.setClearColor('#211d20')
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))
    }

    public resize(): void {
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))
    }

    public update(): void {
        this.instance.render(this.scene, this.camera.instance)
    }
}