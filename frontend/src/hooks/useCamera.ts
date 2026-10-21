import { useEffect, useRef, useState, useCallback } from 'react'

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  const [selectedDevice, setSelectedDevice] = useState<string>('')
  const [active, setActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [permission, setPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt')

  const enumerate = useCallback(async () => {
    try {
      const list = await navigator.mediaDevices.enumerateDevices()
      setDevices(list.filter(d => d.kind === 'videoinput'))
    } catch {}
  }, [])

  useEffect(() => { enumerate(); navigator.mediaDevices.addEventListener('devicechange', enumerate); return () => navigator.mediaDevices.removeEventListener('devicechange', enumerate) }, [enumerate])

  const start = useCallback(async (deviceId?: string) => {
    setError(null)
    try {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop())
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: deviceId ? { exact: deviceId } : undefined, width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: false
      })
      streamRef.current = stream
      if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play() }
      setActive(true); setPermission('granted'); enumerate()
      // set selectedDevice to active track label match
      const track = stream.getVideoTracks()[0]
      const settings = track.getSettings()
      if (settings.deviceId) setSelectedDevice(settings.deviceId)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Accès caméra refusé'
      setError(msg); setPermission('denied')
    }
  }, [enumerate])

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
    setActive(false)
  }, [])

  useEffect(() => () => { streamRef.current?.getTracks().forEach(t => t.stop()) }, [])

  return { videoRef, streamRef, devices, selectedDevice, setSelectedDevice, active, error, permission, start, stop }
}
