/**
 * PhotoToLiveEngine — Architecture modulaire FACE-CAM AI
 * -------------------------------------------------------
 * 8 modules logiques : ImageReferenceLoader, FaceDetector, FaceTracker,
 * AppearanceEncoder, FaceAnimationEngine, FaceRenderingEngine, TemporalStabilizer, LiveVideoPipeline
 *
 * Version 1 : exécution locale navigateur avec MediaPipe Tasks Vision.
 * - Détection + landmarks 478 points + blendshapes
 * - Rendu Canvas 2D avec warp affine stabilisé
 * - Fallback GPU : si échec, message explicite + mode dégradé
 *
 * Ne prétend PAS être un swap photoréaliste GAN. L'architecture permet
 * de substituer le moteur par un serveur GPU (ex: InsightFace/FaceFusion) via la même interface.
 */

export type EngineStatus = 'idle' | 'loading' | 'ready' | 'running' | 'error' | 'no-face'
export type Quality = 'low' | 'medium' | 'high'

export interface EngineMetrics {
  fps: number
  latencyMs: number
  faceDetected: boolean
  trackingLost: number
}

export interface ReferenceImage {
  element: HTMLImageElement
  width: number
  height: number
  faceBox?: { x: number; y: number; w: number; h: number }
}

// 1. ImageReferenceLoader
export class ImageReferenceLoader {
  async load(file: File): Promise<ReferenceImage> {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
    if (!allowed.includes(file.type)) throw new Error(`Format non supporté: ${file.type}. Utilisez JPG, PNG ou WebP.`)
    if (file.size > 10 * 1024 * 1024) throw new Error('Image trop volumineuse (max 10 Mo).')
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.src = url
    await new Promise<void>((res, rej) => { img.onload = () => res(); img.onerror = () => rej(new Error('Image invalide.')); })
    if (img.width < 200 || img.height < 200) throw new Error('Image trop petite. Utilisez une photo d’au moins 200x200 px.')
    return { element: img, width: img.width, height: img.height }
  }
}

// 2. FaceDetector — wrapper MediaPipe FaceLandmarker
export class FaceDetector {
  private landmarker: unknown = null
  private vision: unknown = null
  private ready = false

  async init(): Promise<void> {
    if (this.ready) return
    const { FaceLandmarker, FilesetResolver } = await import('@mediapipe/tasks-vision')
    const fileset = await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm')
    this.landmarker = await FaceLandmarker.createFromOptions(fileset, {
      baseOptions: { modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task', delegate: 'GPU' },
      runningMode: 'VIDEO',
      numFaces: 1,
      outputFaceBlendshapes: true,
      outputFacialTransformationMatrixes: true,
    })
    this.ready = true
  }

  get instance(): unknown { return this.landmarker }
  isReady() { return this.ready }

  detectForVideo(video: HTMLVideoElement, timestamp: number): unknown {
    if (!this.landmarker) return null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (this.landmarker as any).detectForVideo(video, timestamp)
  }
}

// 3. FaceTracker — suivi landmarks + lissage
export class FaceTracker {
  lastLandmarks: { x: number; y: number; z: number }[] | null = null
  blendshapes: Record<string, number> = {}

  update(result: unknown): boolean {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const r = result as any
    if (!r?.faceLandmarks?.[0]) return false
    this.lastLandmarks = r.faceLandmarks[0]
    if (r.faceBlendshapes?.[0]?.categories) {
      this.blendshapes = Object.fromEntries(r.faceBlendshapes[0].categories.map((c: { categoryName: string; score: number }) => [c.categoryName, c.score]))
    }
    return true
  }
}

// 4. AppearanceEncoder — prépare référence (crop visage si possible)
export class AppearanceEncoder {
  encoded: ReferenceImage | null = null
  encode(ref: ReferenceImage): ReferenceImage {
    this.encoded = ref
    return ref
  }
}

// 5. FaceAnimationEngine — mapping blendshapes → animation params
export class FaceAnimationEngine {
  getExpression(blendshapes: Record<string, number>) {
    return {
      mouthOpen: blendshapes['jawOpen'] || 0,
      smile: (blendshapes['mouthSmileLeft'] || 0 + (blendshapes['mouthSmileRight'] || 0)) / 2,
      eyeBlinkLeft: blendshapes['eyeBlinkLeft'] || 0,
      eyeBlinkRight: blendshapes['eyeBlinkRight'] || 0,
      browUp: blendshapes['browInnerUp'] || 0,
      jaw: blendshapes['jawOpen'] || 0,
    }
  }
}

// 6. FaceRenderingEngine — rendu Canvas 2D
export class FaceRenderingEngine {
  draw(
    ctx: CanvasRenderingContext2D,
    video: HTMLVideoElement,
    reference: ReferenceImage | null,
    landmarks: { x: number; y: number }[] | null,
    expression: ReturnType<FaceAnimationEngine['getExpression']>,
    quality: Quality,
    stabilizer: TemporalStabilizer
  ) {
    const W = ctx.canvas.width, H = ctx.canvas.height
    ctx.clearRect(0, 0, W, H)

    // Fond video légèrement flouté si pas de ref, sinon mode transformation
    if (!reference || !landmarks) {
      // Pass-through video
      ctx.drawImage(video, 0, 0, W, H)
      return
    }

    // Calcul bounding box visage
    let minX = 1, minY = 1, maxX = 0, maxY = 0
    for (const p of landmarks) { minX = Math.min(minX, p.x); minY = Math.min(minY, p.y); maxX = Math.max(maxX, p.x); maxY = Math.max(maxY, p.y) }
    const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2
    const bw = (maxX - minX), bh = (maxY - minY)
    const pad = quality === 'high' ? 0.45 : quality === 'medium' ? 0.38 : 0.32
    const stabilized = stabilizer.smooth({ cx, cy, bw, bh })

    // Fond : vidéo assombrie
    ctx.save()
    ctx.globalAlpha = 0.35
    ctx.drawImage(video, 0, 0, W, H)
    ctx.restore()

    // Découpe visage transformé
    const faceW = stabilized.bw * W * (1 + pad * 2)
    const faceH = stabilized.bh * H * (1 + pad * 2)
    const faceX = stabilized.cx * W - faceW / 2
    const faceY = stabilized.cy * H - faceH / 2

    // Effet qualité
    ctx.save()
    // Ombre douce
    ctx.shadowColor = 'rgba(99,102,241,0.35)'
    ctx.shadowBlur = quality === 'high' ? 24 : 14

    // Clip ellipse visage
    ctx.beginPath()
    ctx.ellipse(faceX + faceW / 2, faceY + faceH / 2, faceW / 2.05, faceH / 1.85, 0, 0, Math.PI * 2)
    ctx.clip()

    // Dessine référence avec léger warp lié à l'expression (mouthOpen = scale Y, smile = shift)
    const warpY = 1 + expression.mouthOpen * 0.06
    const warpX = 1 + expression.smile * 0.04
    const blinkDarken = (expression.eyeBlinkLeft + expression.eyeBlinkRight) / 2

    // Fond de référence
    const img = reference.element
    // cover
    const scale = Math.max(faceW / img.width, faceH / img.height) * (1 + expression.jaw * 0.03)
    const iw = img.width * scale * warpX
    const ih = img.height * scale * warpY
    const ix = faceX + faceW / 2 - iw / 2 + expression.smile * 8
    const iy = faceY + faceH / 2 - ih / 2 + expression.mouthOpen * 10 + expression.browUp * -6

    ctx.drawImage(img, ix, iy, iw, ih)

    // Overlay clignement : assombrir légèrement
    if (blinkDarken > 0.3) {
      ctx.fillStyle = `rgba(0,0,0,${Math.min(0.35, blinkDarken * 0.5)})`
      ctx.fillRect(faceX, faceY, faceW, faceH)
    }

    ctx.restore()

    // Contour néon
    ctx.save()
    ctx.strokeStyle = landmarks ? 'rgba(99,102,241,0.9)' : 'rgba(255,255,255,0.2)'
    ctx.lineWidth = quality === 'high' ? 2.5 : 1.5
    ctx.shadowColor = 'rgba(124,58,237,0.6)'; ctx.shadowBlur = 10
    ctx.beginPath()
    ctx.ellipse(faceX + faceW / 2, faceY + faceH / 2, faceW / 2.05, faceH / 1.85, 0, 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()

    // Indicateur overlay texte qualité
    ctx.fillStyle = 'rgba(255,255,255,0.55)'
    ctx.font = '10px Inter'
    ctx.fillText(`FACE-CAM AI • ${quality.toUpperCase()} • warp:${warpY.toFixed(2)}`, 10, H - 10)
  }
}

// 7. TemporalStabilizer — EMA
export class TemporalStabilizer {
  private prev: { cx: number; cy: number; bw: number; bh: number } | null = null
  smooth(cur: { cx: number; cy: number; bw: number; bh: number }) {
    if (!this.prev) { this.prev = cur; return cur }
    const a = 0.35 // smoothing factor
    this.prev = {
      cx: this.prev.cx * (1 - a) + cur.cx * a,
      cy: this.prev.cy * (1 - a) + cur.cy * a,
      bw: this.prev.bw * (1 - a) + cur.bw * a,
      bh: this.prev.bh * (1 - a) + cur.bh * a,
    }
    return this.prev
  }
  reset() { this.prev = null }
}

// 8. LiveVideoPipeline — orchestre tout
export class LiveVideoPipeline {
  status: EngineStatus = 'idle'
  quality: Quality = 'medium'
  metrics: EngineMetrics = { fps: 0, latencyMs: 0, faceDetected: false, trackingLost: 0 }
  reference: ReferenceImage | null = null

  loader = new ImageReferenceLoader()
  detector = new FaceDetector()
  tracker = new FaceTracker()
  encoder = new AppearanceEncoder()
  animator = new FaceAnimationEngine()
  renderer = new FaceRenderingEngine()
  stabilizer = new TemporalStabilizer()

  private raf = 0
  private lastFpsTime = performance.now()
  private frames = 0
  private onMetrics?: (m: EngineMetrics) => void
  private onStatus?: (s: EngineStatus) => void

  setCallbacks(onMetrics?: (m: EngineMetrics) => void, onStatus?: (s: EngineStatus) => void) {
    this.onMetrics = onMetrics; this.onStatus = onStatus
  }

  private setStatus(s: EngineStatus) { this.status = s; this.onStatus?.(s) }

  async loadReference(file: File): Promise<ReferenceImage> {
    const ref = await this.loader.load(file)
    this.reference = this.encoder.encode(ref)
    return ref
  }

  async init() {
    if (this.status === 'ready' || this.status === 'running') return
    this.setStatus('loading')
    try {
      await this.detector.init()
      this.setStatus('ready')
    } catch (e) {
      this.setStatus('error')
      throw e
    }
  }

  start(video: HTMLVideoElement, canvas: HTMLCanvasElement) {
    if (this.status === 'running') return
    this.setStatus('running')
    const ctx = canvas.getContext('2d')!
    const tick = () => {
      this.raf = requestAnimationFrame(tick)
      const t0 = performance.now()
      let detected = false
      try {
        const result = this.detector.detectForVideo(video, t0)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const r = result as any
        if (r?.faceLandmarks?.length) {
          detected = this.tracker.update(result)
          this.metrics.faceDetected = detected
          if (!detected) this.metrics.trackingLost++
          else this.metrics.trackingLost = Math.max(0, this.metrics.trackingLost - 1)
        } else {
          this.metrics.faceDetected = false
          this.metrics.trackingLost++
        }
      } catch {
        this.metrics.faceDetected = false
      }

      const expr = this.animator.getExpression(this.tracker.blendshapes)

      // adapt canvas to container
      const rect = canvas.getBoundingClientRect()
      if (canvas.width !== rect.width || canvas.height !== rect.height) {
        canvas.width = rect.width; canvas.height = rect.height
      }

      this.renderer.draw(ctx, video, this.reference, this.tracker.lastLandmarks as { x: number; y: number }[] | null, expr, this.quality, this.stabilizer)

      this.frames++
      const now = performance.now()
      if (now - this.lastFpsTime > 800) {
        this.metrics.fps = Math.round((this.frames * 1000) / (now - this.lastFpsTime))
        this.metrics.latencyMs = Math.round(now - t0)
        this.onMetrics?.({ ...this.metrics })
        this.frames = 0; this.lastFpsTime = now
      }

      if (this.metrics.trackingLost > 30) this.setStatus('no-face')
      else if (this.status === 'no-face' && detected) this.setStatus('running')
    }
    tick()
  }

  stop() {
    cancelAnimationFrame(this.raf)
    this.stabilizer.reset()
    this.metrics = { fps: 0, latencyMs: 0, faceDetected: false, trackingLost: 0 }
    if (this.status === 'running' || this.status === 'no-face') this.setStatus('ready')
  }

  destroy() { cancelAnimationFrame(this.raf) }
}
