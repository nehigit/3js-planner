import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import './i18n'
import './index.css'
import App from './App.jsx'
import Catalog from './ui/Catalog.jsx'

const CAMERA = {
    fov: 45,
    near: 0.1,
    far: 200,
    position: [10, 10, 10]
}


createRoot(document.getElementById('root')).render(
    <StrictMode>
        <div className="layout">
            {/* floats over the scene at the top left */}
            <Catalog />
            {/* the Canvas fills this element; it must have a size of its own */}
            <main className="scene">
                <Canvas camera={CAMERA}>
                    <App />
                </Canvas>
            </main>
        </div>
    </StrictMode>,
)
