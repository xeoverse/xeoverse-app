import { useKeyboardControls, Stats } from "@react-three/drei"
import { useCallback, useEffect, useState } from "react"
import { Controls } from "../clientLayout"

const Menu = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [isStatsOpen, setIsStatsOpen] = useState<boolean>(true)

    const escapePressed = useKeyboardControls<Controls>(state => state.escape)

    const captureVoice = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const audioContext = new AudioContext()
        const source = audioContext.createMediaStreamSource(stream)
        const processor = audioContext.createScriptProcessor(1024, 1, 1)

        source.connect(processor)
        processor.connect(audioContext.destination)

        processor.onaudioprocess = (e) => {
            const data = e.inputBuffer.getChannelData(0)
            // socket?.send(JSON.stringify({ type: "userVoice", userId: '123', data: data.toString() }))
        }

        return () => {
            processor.disconnect()
            source.disconnect()
        }
    }, [])

    useEffect(() => {
        if (escapePressed) {
            setIsOpen(prev => !prev)
        }
    }, [escapePressed])

    return (
        <>
            {
                isStatsOpen && <Stats showPanel={0} />
            }
            <div style={isOpen ? {
                position: 'absolute',
                top: 0,
                right: 0,
                left: 0,
                height: '100%',
                width: '100%',
                padding: '1rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-end',
                background: '#00000061',
                gap: '1rem',
                flexDirection: 'column'
            } : { display: 'none' }}>
                <button onClick={captureVoice}>voice</button>
                <button onClick={() => setIsStatsOpen(!isStatsOpen)}>stats</button>
            </div>
        </>

    )
}

export default Menu;