"use client"

import { KeyboardControls, KeyboardControlsEntry } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { Physics } from "@react-three/rapier"
import { Suspense, useMemo } from "react"

export enum Controls {
    forward = 'forward',
    back = 'back',
    left = 'left',
    right = 'right',
    jump = 'jump',
    escape = 'escape',
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
    ], [])

    return (
        <KeyboardControls map={map}>
            <Canvas shadows>
                <Suspense>
                    <Physics debug>
                        {children}
                    </Physics>
                </Suspense>
            </Canvas>
        </KeyboardControls>
    )
}

export default ClientLayout