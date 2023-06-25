import { useEffect, useState } from "react";
import { Vector3 } from "three";
import { useThree } from "@react-three/fiber";
import { socket } from "../../socket/SocketContext";
import Bullet, { BulletProps } from "./Bullet";
import { MessageType } from "../../socket/SocketProvider";
import { arraytoVector3 } from "../../helpers";

const BulletsManager = () => {
    const [bullets, setBullets] = useState<BulletProps[]>([])
    const { camera } = useThree()

    useEffect(() => {
        if (socket?.OPEN) {
            socket.addEventListener('message', (data) => {
                if (!data?.data) return;

                const parsed = data?.data?.split(" ");
                const type = Number(parsed?.[0]) ?? null;
                const userId = Number(parsed?.[1]) ?? null;
                const data1 = parsed?.[2];

                if (type === null) return console.log("Invalid message received from server")

                if (type === MessageType.UserShoot && userId !== null && data1) {
                    const data2 = parsed?.[3];
                    const initialPosition = data1.split(",").map((v: string) => parseFloat(v))
                    const cameraDirection = data2.split(",").map((v: string) => parseFloat(v))
                    return setBullets(prev => [...prev, ...[{
                        initialPosition: arraytoVector3(initialPosition),
                        direction: arraytoVector3(cameraDirection),
                        userId: Number(userId)
                    }]])
                }
            })
        }
    }, [])

    useEffect(() => {
        const mouseClick = (e: MouseEvent) => {
            if (e.button === 0) {
                const cameraDirection = camera.getWorldDirection(new Vector3()).toArray();
                const frontOfMe = camera.position.clone().add(arraytoVector3(cameraDirection).multiplyScalar(2))
                setBullets(prev => [...prev, ...[{ initialPosition: frontOfMe, direction: arraytoVector3(cameraDirection), userId: 0 }]])
                socket.send(`${MessageType.UserShoot} ${frontOfMe.toArray()} ${cameraDirection}`)
            }
        }
        window.addEventListener('mousedown', mouseClick)
        return () => {
            window.removeEventListener('mousedown', mouseClick)
        }
    }, [camera])

    useEffect(() => {
        const timeout = setTimeout(() => {
            setBullets([])
        }, 1000 * 20)
        return () => {
            clearTimeout(timeout)
        }
    }, [bullets])

    return (
        <>
            {
                bullets.map(({ initialPosition, direction, userId }, i) => {
                    return (
                        <Bullet key={i} initialPosition={initialPosition} direction={direction} userId={userId} />
                    )
                })
            }
        </>
    )
}

export default BulletsManager;
