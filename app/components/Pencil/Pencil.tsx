import { useEffect, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Color, DoubleSide, Mesh, MeshStandardMaterial, SphereGeometry, Vector3 } from 'three'
import { Plane } from '@react-three/drei'

const Pencil = () => {
    const planeRef = useRef<Mesh>(null)
    const [isDrawing, setIsDrawing] = useState(false)

    useEffect(() => {
        const mouseDown = (e: MouseEvent) => {
            if (e.button === 0) {
                setIsDrawing(true)
            }
        }
        const mouseUp = (e: MouseEvent) => {
            if (e.button === 0) {
                setIsDrawing(false)
            }
        }
        window.addEventListener('mousedown', mouseDown)
        window.addEventListener('mouseup', mouseUp)
        return () => {
            window.removeEventListener('mousedown', mouseDown)
            window.removeEventListener('mouseup', mouseUp)
        }
    }, [])

    const { camera, scene } = useThree()

    useFrame(({ raycaster }) => {
        if (isDrawing) {
            const frontOfMe = camera.position.clone().add(raycaster.ray.direction.clone().multiplyScalar(2))
            planeRef.current?.position.copy(frontOfMe)
            planeRef.current?.lookAt(camera.position)
            planeRef.current?.rotateX(Math.PI / 2)

            raycaster.intersectObject(planeRef.current as Mesh).forEach((intersection) => {
                const { point, face, object, faceIndex } = intersection
                if (!object || !face || faceIndex !== 1) return
                const vertexIndex = face.a
                const geometry = object.geometry as THREE.BufferGeometry
                const positionAttribute = geometry.getAttribute('position') as THREE.BufferAttribute
                const positions = positionAttribute.array as Float32Array
                const position = new Vector3().fromArray(positions, vertexIndex * 3)
                position.applyMatrix4(object.matrixWorld)
                const normal = face.normal.clone().applyMatrix4(object.matrixWorld)
                const color = new Color(0xff0000)
                const material = new MeshStandardMaterial({ color })
                const mesh = new Mesh(new SphereGeometry(0.05), material)
                mesh.position.copy(position)
                mesh.lookAt(position.clone().add(normal))
                scene.add(mesh)
            })
        }
    })

    return (
        <Plane args={[0.01, 1]} ref={planeRef}>
            <meshBasicMaterial side={DoubleSide} transparent opacity={0} />
        </Plane>
    )
}

export default Pencil