import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

/**
 * Debug
 */
const gui = new GUI()

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Textures
const loadingManager = new THREE.LoadingManager(
    () => console.log('Textures loaded succesfully.'),
    () => console.log('Loading...'),
    () => console.log('Error!'),
)

const textureLoader = new THREE.TextureLoader(loadingManager)

const doorColorTexture = textureLoader.load('./textures/door/color.jpg')
doorColorTexture.colorSpace = THREE.SRGBColorSpace

const doorAlphaTexture = textureLoader.load('./textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('./textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('./textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('./textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('./textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('./textures/door/roughness.jpg')

const matcapTexture = textureLoader.load('./textures/matcaps/8.png')
matcapTexture.colorSpace = THREE.SRGBColorSpace

const gradientTexture = textureLoader.load('./textures/gradients/5.jpg')
gradientTexture.generateMipmaps = false
gradientTexture.magFilter = THREE.NearestFilter
gradientTexture.minFilter = THREE.NearestFilter

/**
 * Objects
 */

// MeshBasicMaterial
// const material = new THREE.MeshBasicMaterial()
// material.map = doorColorTexture
// material.color = new THREE.Color('red')
// material.wireframe = true
// material.transparent = true
// material.opacity = 0.5
// material.alphaMap = doorAlphaTexture
// material.side = THREE.BackSide

// MeshNormalMaterial
// const material = new THREE.MeshNormalMaterial()
// material.flatShading = true

// MeshMatcapMaterial
// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matcapTexture

// MeshDepthMaterial
// const material = new THREE.MeshDepthMaterial()

// MeshLambertMaterial
// const material = new THREE.MeshLambertMaterial()
// material.side = THREE.DoubleSide

// MeshPhongMaterial
// const material = new THREE.MeshPhongMaterial()
// material.shininess = 100
// material.specular = new THREE.Color('white')

// MeshToonMaterial
// const material = new THREE.MeshToonMaterial()
// material.gradientMap = gradientTexture

// // MeshStandardMaterial
// const material = new THREE.MeshStandardMaterial()
// material.side = THREE.DoubleSide

// material.map = doorColorTexture
// material.metalnessMap = doorMetalnessTexture
// material.roughnessMap = doorRoughnessTexture

// gui
//     .add(material, 'wireframe')

// material.metalness = 1
// gui
//     .add(material, 'metalness')
//     .min(0)
//     .max(1)
//     .step(0.01)

// material.roughness = 1
// gui
//     .add(material, 'roughness')
//     .min(0)
//     .max(1)
//     .step(0.01)

// material.aoMap = doorAmbientOcclusionTexture
// gui
//     .add(material, 'aoMapIntensity')
//     .min(0)
//     .max(1)
//     .step(0.01)
    
// material.displacementMap = doorHeightTexture
// material.displacementScale = 0.02
// gui
//     .add(material, 'displacementScale')
//     .min(0)
//     .max(1)
//     .step(0.01)

// material.normalMap = doorNormalTexture
// material.normalScale.set(0.5, 0.5)
// gui
//     .add(material.normalScale, 'x')
//     .min(0)
//     .max(5)
//     .step(0.01)

// gui
//     .add(material.normalScale, 'y')
//     .min(0)
//     .max(5)
//     .step(0.01)

// material.transparent = true
// material.alphaMap = doorAlphaTexture
// gui
//     .add(material, 'transparent')

// MeshPhysicalMaterial
const material = new THREE.MeshPhysicalMaterial()
material.side = THREE.DoubleSide

material.map = doorColorTexture
material.metalnessMap = doorMetalnessTexture
material.roughnessMap = doorRoughnessTexture

gui
    .add(material, 'wireframe')

material.metalness = 1
gui
    .add(material, 'metalness')
    .min(0)
    .max(1)
    .step(0.01)

material.roughness = 1
gui
    .add(material, 'roughness')
    .min(0)
    .max(1)
    .step(0.01)

material.aoMap = doorAmbientOcclusionTexture
gui
    .add(material, 'aoMapIntensity')
    .min(0)
    .max(1)
    .step(0.01)
    
material.displacementMap = doorHeightTexture
material.displacementScale = 0.02
gui
    .add(material, 'displacementScale')
    .min(0)
    .max(1)
    .step(0.01)

material.normalMap = doorNormalTexture
material.normalScale.set(0.5, 0.5)
gui
    .add(material.normalScale, 'x')
    .min(0)
    .max(5)
    .step(0.01)

gui
    .add(material.normalScale, 'y')
    .min(0)
    .max(5)
    .step(0.01)

material.transparent = true
material.alphaMap = doorAlphaTexture
gui
    .add(material, 'transparent')

gui
    .add(material, 'clearcoat')
    .min(0)
    .max(1)
    .step(0.0001)
    
gui
    .add(material, 'clearcoatRoughness')
    .min(0)
    .max(1)
    .step(0.0001)

gui
    .add(material, 'sheen')
    .min(0)
    .max(1)
    .step(0.0001)
    
gui
    .add(material, 'sheenRoughness')
    .min(0)
    .max(1)
    .step(0.0001)

gui
    .addColor(material, 'sheenColor')
    
gui
    .add(material, 'iridescence')
    .min(0)
    .max(1)
    .step(0.0001)

gui
    .add(material, 'iridescenceIOR')
    .min(1)
    .max(2.333)
    .step(0.0001)

material.iridescenceThicknessRange = [100, 800]

gui
    .add(material.iridescenceThicknessRange, '0')
    .min(1)
    .max(2.333)
    .step(0.0001)

gui
    .add(material.iridescenceThicknessRange, '1')
    .min(1)
    .max(2.333)
    .step(0.0001)

material.transmission = 1
material.ior = 1.5
material.thickness = 0.5

gui
    .add(material, 'transmission')
    .min(0)
    .max(1)
    .step(0.0001)

gui
    .add(material, 'ior')
    .min(1)
    .max(10)
    .step(0.0001)

gui
    .add(material, 'thickness')
    .min(0)
    .max(1)
    .step(0.0001)

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 64, 64),
    material
)
sphere.position.x = -1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 100, 100),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 64, 128),
    material
)
torus.position.x = 1.5

scene.add(sphere, plane, torus)

/**
 * Lights
 */
// const ambientLight = new THREE.AmbientLight(0xffffff, 1)
// scene.add(ambientLight)

// const pointLight = new THREE.PointLight(0xffffff, 30)
// scene.add(pointLight)
// pointLight.position.x = 2
// pointLight.position.y = 3
// pointLight.position.z = 4

/**
 * Env map
 */
const rgbeLoader = new RGBELoader(loadingManager)
rgbeLoader.load('./textures/environmentMap/2k.hdr', envMap => {
    envMap.mapping = THREE.EquirectangularReflectionMapping
    scene.background = envMap
    scene.environment = envMap
})


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Rotate meshes
    sphere.rotation.x = -0.15 * elapsedTime
    sphere.rotation.y = 0.1 * elapsedTime

    plane.rotation.x = -0.15 * elapsedTime
    plane.rotation.y = 0.1 * elapsedTime

    torus.rotation.x = -0.15 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()