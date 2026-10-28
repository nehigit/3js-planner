import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import './index.css'
import App from './App.jsx'

const CAMERA = {
    fov: 45,
    near: 0.1,
    far: 200,
    position: [-4, 3, 6],
}


createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Canvas camera={CAMERA}>
            <App />
        </Canvas>
    </StrictMode>,
)
