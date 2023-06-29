import { useKeyboardControls, Hud as DreiHud, PerspectiveCamera } from "@react-three/drei"
import { useContext, useEffect, useRef, useState } from "react"
import { Controls } from "../../clientLayout"
import ActionBar from "./ActionBar"
import { SocketContext } from "../../socket/SocketContext"

const Hud = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const tildePressed = useKeyboardControls<Controls>(state => state.tilde)
    const camera = useRef(null)
    const socket = useContext(SocketContext)

    useEffect(() => {
        const audioContext = new AudioContext();

        socket?.addEventListener('message', (event) => {
            if (event.data instanceof Blob) {
                const blob = new Blob([event.data], { type: 'audio/ogg; codecs=opus' })
                blob.arrayBuffer().then((buffer) => {
                    const data = new Float32Array(buffer)
                    const source = audioContext.createBufferSource()
                    const audioBuffer = audioContext.createBuffer(1, data.length, 48000)
                    audioBuffer.copyToChannel(data, 0)
                    source.buffer = audioBuffer
                    source.connect(audioContext.destination)
                    source.start()
                })
            }
        })
    }, [socket])

    useEffect(() => {
        const startRecording = async () => {
            console.log('Recording audio...')

            const audioContext = new AudioContext();
            const microphone = await navigator.mediaDevices.getUserMedia({ audio: true })
            const source = audioContext.createMediaStreamSource(microphone)

            await audioContext.audioWorklet.addModule('recorder.worklet.js')

            const recorder = new AudioWorkletNode(audioContext, 'recorder.worklet')

            source.connect(recorder).connect(audioContext.destination)

            recorder.port.onmessage = (event) => {
                socket?.send(event.data)
            }
        }
        startRecording()
    }, [socket])


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