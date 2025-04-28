import * as THREE from 'three'
import Furniture from './Furniture'

// TODO: fix moving
// TODO: make the moving part reusable on other objects
export default class Rectangle extends Furniture {
    mesh!: THREE.Mesh
    boundingBox!: THREE.Box3

    public constructor() {
        super()

        this.setGeometry(new THREE.BoxGeometry(1, 2, 2))
        this.setMaterial(new THREE.MeshStandardMaterial({wireframe: false}))
        this.setMesh(new THREE.Mesh(this.geometry, this.material))

        this.setupBoundingBox()
        this.updateBoundingBox()
    }

    setGeometry(geometry: THREE.BufferGeometry): void {
        this.geometry = geometry
        this.geometry.normalizeNormals()
    }

    setMaterial(material: THREE.Material): void {
        this.material = material
    }

    setMesh(mesh: THREE.Mesh): void {
        this.mesh = mesh
    }
}
