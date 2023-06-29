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
    const mediaStream = useRef<MediaStream>()

    useEffect(() => {
        const startRecording = async () => {
            console.log('Recording audio...')

            mediaStream.current = await navigator.mediaDevices.getUserMedia({ audio: true })
            const audioContext = new AudioContext({ sampleRate: 96000 })
            const source = audioContext.createMediaStreamSource(mediaStream.current)
            const processor = audioContext.createScriptProcessor(4096 * 2, 1, 1)
            source.connect(processor)
            processor.connect(audioContext.destination)
            processor.onaudioprocess = e => {
                const buffer = e.inputBuffer.getChannelData(0)
                const data = new Float32Array(buffer.length)
                for (let i = 0; i < buffer.length; i++) {
                    data[i] = buffer[i]
                }
                socket?.send(data)
            }
        }

        startRecording()

        socket?.addEventListener('message', (event) => {
            if (event.data instanceof Blob) {
                const blob = new Blob([event.data], { type: 'audio/ogg; codecs=opus' })
                blob.arrayBuffer().then((buffer) => {
                    const data = new Float32Array(buffer)
                    const audioContext = new AudioContext()
                    const source = audioContext.createBufferSource()
                    const audioBuffer = audioContext.createBuffer(1, data.length, 96000)
                    audioBuffer.copyToChannel(data, 0)
                    source.buffer = audioBuffer
                    source.connect(audioContext.destination)
                    source.start()
                })
            }
        })

        return () => {
            mediaStream.current?.getTracks().forEach(track => track.stop())
        }
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