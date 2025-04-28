import * as THREE from 'three'

export default class Wall extends THREE.Mesh {
    public constructor() {
        const geometry = new THREE.PlaneGeometry(10, 5, 1, 1);
        const material = new THREE.MeshStandardMaterial({ color: '#222' });
        super(geometry, material);
    }
}