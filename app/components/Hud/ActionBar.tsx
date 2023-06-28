import { useKeyboardControls, Box, Sphere, Text, Circle } from "@react-three/drei"
import { useEffect, useState } from "react"
import { Controls } from "../../clientLayout"
import { Vector3 } from "@react-three/fiber"

interface ActionBarItemProps {
    children: React.ReactNode,
    active: boolean,
    position: Vector3,
    index: number
}

const ActionBarItem = ({ children, active, position, index }: ActionBarItemProps) => {
    return (
        <group position={position}>
            {
                active && (
                    <Box receiveShadow castShadow>
                        <meshBasicMaterial attach="material" color="purple" wireframe />
                    </Box>
                )
            }
            {children}
            <group position={[-0.5, 0.5, 0.5]}>
                <Circle args={[0.1, 10]} castShadow receiveShadow>
                    <meshPhysicalMaterial attach="material" color="black" />
                </Circle>
                <Text fontSize={0.1} color="white" anchorX="center" anchorY="middle">
                    {index}
                </Text>
            </group>
        </group>
    )
}

const ActionBar = () => {
    const [activeHotbar, setActiveHotbar] = useState<number>(0)

    const onePressed = useKeyboardControls<Controls>(state => state.one)
    const twoPressed = useKeyboardControls<Controls>(state => state.two)
    const threePressed = useKeyboardControls<Controls>(state => state.three)

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
        <group>
            <ActionBarItem active={activeHotbar === 1} position={[-2, -2, 4]} index={1}>
                <Sphere args={[0.5, 10, 10]} castShadow receiveShadow>
                    <meshPhysicalMaterial attach="material" color="silver" />
                </Sphere>
            </ActionBarItem>
            <ActionBarItem active={activeHotbar === 2} position={[0, -2, 4]} index={2}>
                <Sphere args={[0.5, 10, 10]} castShadow receiveShadow>
                    <meshPhysicalMaterial attach="material" color="silver" />
                </Sphere>
            </ActionBarItem>
        </group>
    )
}

export default ActionBar;