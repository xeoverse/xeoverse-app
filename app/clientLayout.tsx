"use client"

import { KeyboardControls, KeyboardControlsEntry } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { Physics } from "@react-three/rapier"
import { Suspense, useMemo } from "react"
import Menu from "./components/Menu"
import SocketProvider from "./socket/SocketProvider"

export enum Controls {
    forward = 'forward',
    back = 'back',
    left = 'left',
    right = 'right',
    jump = 'jump',
    escape = 'escape',
    e = 'e',
    q = 'q'
}

const Cursor = () => {
    return (
        <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 8,
            height: 8,
            backgroundColor: 'red',
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            zIndex: 999999999
        }} />
    )
}

const ClientLayout = ({
    children,
}: {
    children: React.ReactNode
}) => {
    const map = useMemo<KeyboardControlsEntry<Controls>[]>(() => [
        { name: Controls.forward, keys: ['ArrowUp', 'KeyW'] },
        { name: Controls.back, keys: ['ArrowDown', 'KeyS'] },
        { name: Controls.left, keys: ['ArrowLeft', 'KeyA'] },
        { name: Controls.right, keys: ['ArrowRight', 'KeyD'] },
        { name: Controls.jump, keys: ['Space'] },
        { name: Controls.escape, keys: ['Escape'] },
        { name: Controls.e, keys: ['KeyE'] },
        { name: Controls.q, keys: ['KeyQ'] }
    ], [])

    return (
        <SocketProvider>
            <KeyboardControls map={map}>
                <Canvas shadows>
                    <Suspense>
                        <Physics>
                            {children}
                        </Physics>
                    </Suspense>
                </Canvas>
                <Menu />
                <Cursor />
            </KeyboardControls>
        </SocketProvider>
    )
}

export default ClientLayout