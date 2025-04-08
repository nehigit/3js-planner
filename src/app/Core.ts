import * as THREE from 'three';

import Sizes from './utils/Sizes';
import Time from './utils/Time';
import Camera from './Camera';
import Renderer from './Renderer';
import World from './world/World';
import Debug from './utils/Debug';

export default class Core {

    private static _instance: Core
    readonly canvas: HTMLCanvasElement;
    public debug: Debug;
    public sizes: Sizes;
    readonly time: Time;
    public scene: THREE.Scene;
    public camera: Camera;
    public renderer: Renderer;
    public world: World;

    private constructor() {
        Core._instance = this
        // Order matters!
        this.canvas = document.querySelector('canvas.webgl')!;
        this.debug = new Debug();
        this.sizes = new Sizes();
        this.time = new Time();
        this.scene = new THREE.Scene();
        this.camera = new Camera();
        this.renderer = new Renderer();
        this.world = new World();

        // Listen to custom 'resize' event from Sizes
        this.sizes.addEventListener('windowResize', () => {
            this.resize();
        });

        // Time tick event
        this.time.addEventListener('tick', () => {
            this.update();
        });
    }

    private resize(): void {
        this.camera.resize();
        this.renderer.resize();
    }

    private update(): void {
        // Order matters
        this.camera.update();
        this.renderer.update();
    }

    public static get instance(): Core {
        if (!Core._instance) {
            Core._instance = new Core();
        }
        return Core._instance;
    }
}

// Global access from console
declare global {
    interface Window {
        core: Core;
    }
}

window.core = Core.instance;