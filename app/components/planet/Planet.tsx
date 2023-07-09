import { OrbitCamera, Planet as HelloPlanet, usePlanet } from "@hello-worlds/react"
import { useFrame, useThree } from "@react-three/fiber"
import * as React from "react"
import { Vector3 } from "three"
import ChunkDebugger from "./ChunkDebugger"

const worker = () => new Worker(new URL("./Planet.worker", import.meta.url))

const ToggleLodOriginHelper: React.FC = () => {
    const lodPosition = React.useRef(new Vector3())
    const [coupleCamera, setCoupleCamera] = React.useState(true)
    const camera = useThree(s => s.camera)
    const planet = usePlanet()

    React.useEffect(() => {
        const listener = (e: KeyboardEvent) => {
            if (e.key === "c") {
                setCoupleCamera(!coupleCamera)
            }
        }
        window.addEventListener("keydown", listener)
        return () => {
            window.removeEventListener("keydown", listener)
        }
    }, [coupleCamera])

    useFrame(() => {
        if (coupleCamera) {
            lodPosition.current.copy(camera.position)
        }
        planet.update(lodPosition.current)
    })

    return null
}

const Planet = () => {
    const camera = useThree(s => s.camera)

    return (
        <HelloPlanet
            key="planet"
            position={new Vector3()}
            radius={50}
            minCellSize={32 * 8}
            minCellResolution={32}
            lodOrigin={camera.position}
            lodDistanceComparisonValue={3}
            worker={worker}
            data={{
                seed: "Flat Worlds Example",
            }}
            autoUpdate={false}
        >
            <ChunkDebugger />
            <ToggleLodOriginHelper />
            <meshStandardMaterial vertexColors side={2} />
        </HelloPlanet>
    )
}

export default Planet;