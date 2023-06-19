import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Box } from '@react-three/drei'

const CustomBox = (props: any) => {
    const mesh = useRef<any>()
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)

    useFrame((state, delta) => {
        if (mesh.current) {
            mesh.current.rotation.x += delta
        }
    })

    return (
        <Box
            {...props}
            castShadow
            ref={mesh}
            scale={active ? 1.5 : 1}
            onClick={() => {
                props.onClick?.()
                setActive(!active)
            }}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
            material-color={props.color}
        >
            <meshPhysicalMaterial color={hovered ? 'hotpink' : props.color} />
        </Box>
    )
}

export default CustomBox;