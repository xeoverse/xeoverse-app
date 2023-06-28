import { useKeyboardControls, Hud as DreiHud, PerspectiveCamera } from "@react-three/drei"
import { useEffect, useRef, useState } from "react"
import { Controls } from "../../clientLayout"
import ActionBar from "./ActionBar"

const Hud = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const camera = useRef(null)

    const tildePressed = useKeyboardControls<Controls>(state => state.tilde)

    useEffect(() => {
        if (tildePressed) {
            return setIsOpen(prev => !prev)
        }
    }, [tildePressed])

    return (
        <DreiHud>
            {
                isOpen && (
                    <>
                        <ambientLight intensity={0.5} />
                        <spotLight position={[0, 5, 10]} penumbra={1} castShadow />
                        <PerspectiveCamera makeDefault position={[0, 0, 10]} ref={camera} />
                        <ActionBar />
                    </>
                )
            }
        </DreiHud >
    )

}

export default Hud;