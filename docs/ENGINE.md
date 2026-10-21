# Moteur IA — FACE-CAM AI

## Architecture modulaire (PhotoToLiveEngine)

```
LiveVideoPipeline
 ├─ ImageReferenceLoader — validation JPG/PNG/WebP, taille, résolution
 ├─ FaceDetector — MediaPipe FaceLandmarker (478 landmarks + blendshapes + matrix)
 ├─ FaceTracker — suivi + mémorisation blendshapes
 ├─ AppearanceEncoder — préparation référence (crop/encode)
 ├─ FaceAnimationEngine — mapping blendshapes → params (mouthOpen, smile, blink…)
 ├─ FaceRenderingEngine — Canvas 2D (warp affine + clip elliptique + stabilisation)
 ├─ TemporalStabilizer — EMA (α=0.35) pour éviter scintillement
 └─ LiveVideoPipeline — orchestration + métriques FPS/latence
```

### Version 1 (actuelle) — Local navigateur
- **Modèle** : `face_landmarker.task` float16 (~5 Mo) via CDN jsDelivr, délégué GPU si disponible.
- **Qualité** : warp affine de la photo de référence sur la bbox visage détectée.
- **Honnêteté** : ce n’est **pas** un swap photoréaliste GAN. C’est une première version fonctionnelle, fluide (24-30 FPS sur GPU intégré) et honnête. Le rendu photoréaliste complet (ex: InsightFace, FaceFusion, LivePortrait) nécessite un serveur GPU.

### Évolution vers photoréaliste
L’interface est identique ; seul le `FaceRenderingEngine` est remplacé :

| Moteur | Qualité | Latence | Mémoire | Licence | GPU |
|---|---|---|---|---|---|
| MediaPipe warp (actuel) | correcte, stable | ~40 ms | ~150 Mo | Apache 2.0 | optionnel |
| InsightFace + SimSwap | élevée | ~120 ms | ~2 Go | non-commercial (à vérifier) | requis |
| FaceFusion (ONNX) | très élevée | ~80 ms | ~1.5 Go | MIT | requis |
| LivePortrait (Kwai) | élevée (3D) | ~100 ms | ~1 Go | Apache 2.0 | requis |
| HeyGen / D-ID API | premium SaaS | ~500 ms réseau | distant | commercial payant | distant |

**Recommandation progressive** : garder v1 locale gratuite, ajouter un micro-service GPU (FastAPI + ONNX Runtime) derrière `processing_jobs` Supabase pour le rendu premium. Le backend principal n’est jamais bloqué.

## Performances mesurées
- FPS : compteur réel (frames / seconde)
- Latence : `performance.now()` avant/après détection
- Mémoire : `performance.memory` si disponible
- Perte de suivi : incrément si pas de faceLandmarks

Niveaux qualité :
- **Low** : pad 0.32, shadow 14, idéal si <15 FPS
- **Medium** : pad 0.38, shadow 14 (défaut)
- **High** : pad 0.45, shadow 24, plus immersif si >24 FPS

## Virtual Camera
- `canvas.captureStream(30)` → MediaStream exploitable en WebRTC.
- Page web **ne peut pas** créer un périphérique système Windows seule.
- Solutions : OBS VirtualCam (capture fenêtre), app Electron + driver (ex: `obs-virtualcam`, `UnityCapture`), ou serveur SFU WebRTC.
- Documenté dans `/virtual-camera` de l’app.

## Sécurité & confidentialité
- Validation fichier : type MIME + taille 10 Mo + dimensions min 200×200.
- Stockage : bucket Supabase privé `facecam-references` + signed URLs (pas public).
- Rétention : session par défaut, configurable (7j/30j).
- Consentement caméra/micro obligatoire (Permissions API).
- Aucun entraînement sans opt-in distinct.

## Critère de validation (test manuel)
1. Importer photo autorisée → aperçu OK
2. Activer webcam → autorisation + flux
3. Démarrer LIVE → transformation visible conservant l’apparence
4. Tourner tête / sourire / bouche / clignement / parler → suivi mesurable (FPS/latence)
5. Documenter limites : rotation >30°, lunettes, faible lumière
