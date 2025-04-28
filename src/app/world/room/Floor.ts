import * as THREE from 'three'

export default class Floor extends THREE.Mesh {
    public constructor() {
        const geometry = new THREE.PlaneGeometry(10, 10, 1, 1);
        const material = new THREE.MeshStandardMaterial({ color: '#333' });
        material.side = THREE.DoubleSide
        super(geometry, material);

        this.rotation.x = -Math.PI / 2;
        
    }
}