import * as THREE from 'three'

import Core from "../../Core"
import Floor from './Floor'
import Wall from './Wall'

export default class Room extends THREE.Group {

    private core = Core.instance
    private scene = this.core.scene
    floor!: Floor
    walls: Wall[] = []

    public constructor() {
        super()
        
        this.setupRoom()
        this.scene.add(this);
    }

    private setupRoom(): void {
        // Create and add the floor
        this.floor = new Floor();
        this.add(this.floor);

        // Create and add the walls
        const wallLeft = new Wall();
        wallLeft.name = 'wallLeft';
        wallLeft.position.set(-5, 2.5, 0); // Adjust position as needed
        wallLeft.rotation.y = Math.PI / 2
        this.add(wallLeft);
        
        const wallRight = new Wall();
        wallRight.name = 'wallRight';
        wallRight.position.set(5, 2.5, 0); // Adjust position as needed
        wallRight.rotation.y = -Math.PI / 2
        this.add(wallRight);

        const wallBehind = new Wall();
        wallBehind.name = 'wallBehind';
        wallBehind.position.set(0, 2.5, -5); // Adjust position as needed
        this.add(wallBehind);

        const wallFront = new Wall();
        wallFront.name = 'wallFront';
        wallFront.position.set(0, 2.5, 5); // Adjust position as needed
        wallFront.rotation.y = Math.PI
        this.add(wallFront);

        this.walls = [wallLeft, wallRight, wallBehind, wallFront]
    }

}