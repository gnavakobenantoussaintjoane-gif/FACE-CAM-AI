# FACE-CAM AI — Changez d'apparence. Traduisez en direct.

Plateforme SaaS de **transformation faciale Photo-to-Live**, d’**avatars réalistes** et de **traduction vocale temps réel**.

![Stack](https://img.shields.io/badge/React-19%20%7C%20Vite-646CFF) ![Backend](https://img.shields.io/badge/Express-TS-000) ![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E) ![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Fonctionnalités
- **Swap Live** — import photo (JPG/PNG/WebP) → visage animé synchronisé (tête, sourire, bouche, clignements), moteur modulaire MediaPipe local + archi prête pour serveur GPU photoréaliste.
- **Restyle Studio** — 6 catégories, import référence, enregistrement/suppression, ajustements.
- **Live Translate** — 6 langues (FR/EN/ES/PT/DE/IT), transcription Web Speech + traduction (MyMemory/backend), sous-titres, historique, latence mesurée.
- **Virtual Camera** — distinction flux original/transformé/système, WebRTC + docs OBS/Electron, pas de fausse promesse “caméra système” en page web seule.
- **SaaS** — quotas, 3 tiers (FREE/PRO/PREMIUM), RLS, validation Zod, rate-limit.

## 🏗 Architecture

```
FACE-CAM-AI/
  frontend/  React 18 + TS strict + Vite + Tailwind + React Router + Supabase Auth + MediaPipe
  backend/   Node + Express + TS + Supabase (RLS) + Zod + Helmet + RateLimit
  supabase/migrations/  SQL (profiles, avatars, transformations, translation_sessions, etc.)
  docs/  ENGINE.md, SETUP.md
```

Interface sombre bleutée, accents violet/bleu, responsive, animations discrètes.

## 🚀 Démarrage rapide (Windows)

```bat
REM Backend
cd backend & copy .env.example .env & npm install & npm run dev
REM Frontend (autre terminal)
cd frontend & copy .env.example .env & npm install & npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:4000/api/health

Sans config Supabase, l’app tourne en **mode démo** (localStorage).

Voir [docs/SETUP.md](docs/SETUP.md) et [docs/ENGINE.md](docs/ENGINE.md).

## 🔒 Confidentialité
- Photo de référence : session seule par défaut, suppression instantanée, bucket privé + signed URLs.
- Aucune publication auto, aucun entraînement sans consentement distinct.
- Consentement caméra/micro obligatoire.

## 📊 Moteur IA
- **Actuel** : MediaPipe FaceLandmarker local (≈24-30 FPS, ~40 ms latence).
- **Évolution** : interface `PhotoToLiveEngine` interchangeable → serveur GPU (InsightFace/FaceFusion/LivePortrait) sans reconstruire le frontend.
- Pas de filtre 2D présenté comme photoréalisme.

## 📄 Licence
MIT
