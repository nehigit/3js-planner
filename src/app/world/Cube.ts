import * as THREE from 'three'

import Core from '../Core'

// TODO: fix
export default class Cube extends THREE.Mesh {
    
    private core = Core.getInstance()
    private scene = this.core.scene
    private camera = this.core.camera
    private mesh!: THREE.Mesh
    private cubes = new Array<Cube>
    private isDragging = false
    private offset!: THREE.Vector3Like

    constructor() {
        super()

        this.setGeometry()
        this.setMaterial()
        this.setMesh()

        this.scene.add(this.mesh)

        // Keep track of all cubes in the scene
        this.cubes.push(this)

        window.addEventListener('mousedown', (e) => this.onMouseDown(e))
        window.addEventListener('mousemove', (e) => this.onMouseMove(e))
        window.addEventListener('mouseup', () => this.onMouseUp())
    }

    setGeometry(): void {
        this.geometry = new THREE.BoxGeometry(1, 1, 1)
        this.geometry.normalizeNormals()
    }

    setMaterial(): void {
        this.material = new THREE.MeshStandardMaterial({
            wireframe: false
        })
    }

    setMesh(): void {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.position.y = 0.5
    }

    onMouseDown(e: MouseEvent) {
        const raycaster = new THREE.Raycaster()
        const mouse = new THREE.Vector2()

        mouse.x = (e.clientX / window.innerWidth) * 2 - 1
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1

        raycaster.setFromCamera(mouse, this.camera.instance)
        
        const intersects = raycaster.intersectObject(this.mesh)

        if (intersects.length > 0) {
            this.isDragging = true
            this.offset = this.mesh.position.clone().sub(intersects[0].point)
        }
    }

    onMouseMove(e: MouseEvent) {
        if (!this.isDragging) return
    
        const mouseX = (e.clientX / window.innerWidth) * 2 - 1
        const mouseY = -(e.clientY / window.innerHeight) * 2 + 1
    
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

    isColliding(newPosition: THREE.Vector3) {
        const newBox = new THREE.Box3().setFromObject(this.mesh)
        newBox.translate(newPosition.clone().sub(this.mesh.position))
        
        for (const cube of this.cubes) {
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
