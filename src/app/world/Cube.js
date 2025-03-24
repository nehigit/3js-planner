import * as THREE from 'three'

import Core from '../Core.js'


export default class Cube extends THREE.Mesh {
    
    constructor() {
        super()

        this.core = Core.getInstance()
        this.scene = this.core.scene
        this.camera = this.core.camera

        this.setGeometry()
        this.setMaterial()
        this.setMesh()

        this.scene.add(this.mesh)

        // Keep track of all cubes in the scene
        if (!this.core.cubes) {
            this.core.cubes = []
        }
        this.core.cubes.push(this)

        window.addEventListener('mousedown', (event) => this.onMouseDown(event))
        window.addEventListener('mousemove', (event) => this.onMouseMove(event))
        window.addEventListener('mouseup', () => this.onMouseUp())
    }

    setGeometry() {
        this.geometry = new THREE.BoxGeometry(1, 1, 1)
        this.geometry.normalizeNormals()
    }

    setMaterial() {
        this.material = new THREE.MeshStandardMaterial({
            wireframe: false
        })
    }

    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.position.y = 0.5
    }

    onMouseDown(event) {
        const raycaster = new THREE.Raycaster()
        const mouse = new THREE.Vector2()

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

        raycaster.setFromCamera(mouse, this.camera.instance)
        
        const intersects = raycaster.intersectObject(this.mesh)

        if (intersects.length > 0) {
            this.isDragging = true
            this.offset = this.mesh.position.clone().sub(intersects[0].point)
        }
    }

    onMouseMove(event) {
        if (!this.isDragging) return
    
        const mouseX = (event.clientX / window.innerWidth) * 2 - 1
        const mouseY = -(event.clientY / window.innerHeight) * 2 + 1
    
        const raycaster = new THREE.Raycaster()
        const mouse = new THREE.Vector2(mouseX, mouseY)
        raycaster.setFromCamera(mouse, this.camera.instance)
    
        const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
        const intersection = new THREE.Vector3()
        if (!raycaster.ray.intersectPlane(plane, intersection)) return

        const newPosition = intersection.clone().add(this.offset)

        // Prevent movement if colliding with another cube
        if (!this.isColliding(newPosition)) {
            this.mesh.position.x = newPosition.x
            this.mesh.position.z = newPosition.z
        }
    }

    onMouseUp() {
        this.isDragging = false
    }

    isColliding(newPosition) {
        const newBox = new THREE.Box3().setFromObject(this.mesh)
        newBox.translate(newPosition.clone().sub(this.mesh.position))
        
        for (const cube of this.core.cubes) {
            if (cube !== this) {
                const otherBox = new THREE.Box3().setFromObject(cube.mesh)
                if (newBox.intersectsBox(otherBox)) {
                    return true // Collision detected
                }
            }
        }
        return false // No collision
    }
}
