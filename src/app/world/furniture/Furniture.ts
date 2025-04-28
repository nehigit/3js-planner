import * as THREE from 'three'

// TODO: fix moving
// TODO: make the moving part reusable on other objects
export default abstract class Furniture extends THREE.Mesh {
    abstract mesh: THREE.Mesh
    abstract boundingBox: THREE.Box3

    abstract setGeometry(geometry: THREE.BufferGeometry): void

    abstract setMaterial(material: THREE.Material): void

    abstract setMesh(mesh: THREE.Mesh): void

    setupBoundingBox() {
        this.boundingBox = new THREE.Box3()
        this.mesh.geometry.computeBoundingBox()
    }

    updateBoundingBox() {
        if (this.mesh.geometry.boundingBox) {
            this.boundingBox.copy(this.mesh.geometry.boundingBox)
                .applyMatrix4(this.mesh.matrixWorld)
        } else {
            console.warn('Bounding box is not defined for the mesh geometry.')
        }
    }
}
