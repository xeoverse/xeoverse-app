import { useKeyboardControls, Hud as DreiHud, PerspectiveCamera, Box, Sphere, Text, Circle } from "@react-three/drei"
import { useEffect, useRef, useState } from "react"
import { Controls } from "../clientLayout"

const Hud = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [activeHotbar, setActiveHotbar] = useState<number>(0)

    const camera = useRef(null)

    const tildePressed = useKeyboardControls<Controls>(state => state.tilde)
    const onePressed = useKeyboardControls<Controls>(state => state.one)
    const twoPressed = useKeyboardControls<Controls>(state => state.two)
    const threePressed = useKeyboardControls<Controls>(state => state.three)

    useEffect(() => {
        if (tildePressed) {
            return setIsOpen(prev => !prev)
        }
    }, [tildePressed])

    useEffect(() => {
        if (onePressed) {
            return setActiveHotbar(1)
        } else if (twoPressed) {
            return setActiveHotbar(2)
        } else if (threePressed) {
            return setActiveHotbar(3)
        }
    }, [onePressed, threePressed, twoPressed])

    return (
        <DreiHud>
            {
                isOpen && (
                    <>
                        <ambientLight intensity={0.5} />
                        <spotLight position={[0, 5, 10]} penumbra={1} castShadow />
                        <PerspectiveCamera makeDefault position={[0, 0, 10]} ref={camera} />

                        <group>
                            <group position={[-2, -2, 4]}>
                                {
                                    activeHotbar === 1 && (
                                        <Box receiveShadow castShadow>
                                            <meshBasicMaterial attach="material" color="purple" wireframe />
                                        </Box>
                                    )
                                }
                                <Sphere args={[0.5, 10, 10]} castShadow receiveShadow>
                                    <meshPhysicalMaterial attach="material" color="silver" />
                                </Sphere>
                                <group position={[-0.5, 0.5, 0.5]}>
                                    <Circle args={[0.1, 10]} castShadow receiveShadow>
                                        <meshPhysicalMaterial attach="material" color="black" />
                                    </Circle>
                                    <Text fontSize={0.1} color="white" anchorX="center" anchorY="middle">
                                        1
                                    </Text>
                                </group>
                            </group>
                            <group position={[-0.5, -2, 4]}>
                                {
                                    activeHotbar === 2 && (
                                        <Box receiveShadow castShadow>
                                            <meshBasicMaterial attach="material" color="purple" wireframe />
                                        </Box>
                                    )
                                }
                                <Sphere args={[0.5, 10, 10]} castShadow receiveShadow>
                                    <meshPhysicalMaterial attach="material" color="silver" />
                                </Sphere>
                                <group position={[-0.5, 0.5, 0.5]}>
                                    <Circle args={[0.1, 10]} castShadow receiveShadow>
                                        <meshPhysicalMaterial attach="material" color="black" />
                                    </Circle>
                                    <Text fontSize={0.1} color="white" anchorX="center" anchorY="middle">
                                        2
                                    </Text>
                                </group>
                            </group>
                            <group position={[1, -2, 4]}>
                                {
                                    activeHotbar === 3 && (
                                        <Box receiveShadow castShadow>
                                            <meshBasicMaterial attach="material" color="purple" wireframe />
                                        </Box>
                                    )
                                }
                                <Sphere args={[0.5, 10, 10]} castShadow receiveShadow>
                                    <meshPhysicalMaterial attach="material" color="silver" />
                                </Sphere>
                                <group position={[-0.5, 0.5, 0.5]}>
                                    <Circle args={[0.1, 10]} castShadow receiveShadow>
                                        <meshPhysicalMaterial attach="material" color="black" />
                                    </Circle>
                                    <Text fontSize={0.1} color="white" anchorX="center" anchorY="middle">
                                        3
                                    </Text>
                                </group>
                            </group>
                        </group>

                    </>
                )
            }
        </DreiHud >
    )

}

export default Hud;