import * as THREE from 'three'

import Core from "../Core"


export default class Floor {

    private core = Core.getInstance()
    private scene = this.core.scene
    private geometry!: THREE.BufferGeometry
    private material!: THREE.Material
    private mesh!: THREE.Mesh

    public constructor() {
        // TODO: maybe make the setup functions return objects and assign them above 
        // instead of invoking functions inside constructor??
        this.setupGeometry()
        this.setupMaterial()
        this.setupMesh()
        this.scene.add(this.mesh)
    }

    private setupGeometry(): void {
        this.geometry = new THREE.PlaneGeometry(
            10,
            10,
            1,
            1,
        )
    }

    private setupMaterial(): void {
        this.material = new THREE.MeshStandardMaterial({
            color: '#333'
        })
    }

    private setupMesh(): void {
        this.mesh = new THREE.Mesh(
            this.geometry,
            this.material
        )

        this.mesh.rotation.x = -Math.PI / 2
    }

}