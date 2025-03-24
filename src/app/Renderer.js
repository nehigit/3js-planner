import * as THREE from 'three'

import Core from "./Core.js"


export default class Renderer {
    constructor() {
        this.core = Core.getInstance()
        this.world = this.core.world
        this.canvas = this.core.canvas
        this.sizes = this.core.sizes
        this.scene = this.core.scene
        this.camera = this.core.camera

        this.setInstance()
    }

    setInstance() {
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
        })
        this.instance.toneMapping = THREE.CineonToneMapping
        this.instance.toneMappingExposure = 1.75
        this.instance.shadowMap.enabled = true
        this.instance.shadowMap.type = THREE.PCFSoftShadowMap
        this.instance.setClearColor('#211d20')
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))
    }

    resize() {
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))
    }

    update() {
        this.instance.render(this.scene, this.camera.instance)
    }
}