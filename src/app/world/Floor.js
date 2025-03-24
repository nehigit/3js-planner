import * as THREE from 'three'

import Core from "../Core.js"


export default class Floor {

    constructor() {
        this.core = Core.getInstance()
        this.scene = this.core.scene

        this.setGeometry()
        this.setMaterial()
        this.setMesh()

        this.scene.add(this.mesh)
    }

    setGeometry() {
        this.geometry = new THREE.PlaneGeometry(
            10,
            10,
            1,
            1,
        )
    }

    setMaterial() {
        this.material = new THREE.MeshStandardMaterial({
            color: '#333'
        })
    }

    setMesh() {
        this.mesh = new THREE.Mesh(
            this.geometry,
            this.material
        )

        this.mesh.rotation.x = -Math.PI / 2
    }

}