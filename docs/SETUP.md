# Installation — FACE-CAM AI (Windows)

## Prérequis
- Node.js 20+
- npm 10+
- Compte Supabase (gratuit)

## 1. Cloner
```bat
git clone https://github.com/gnavakobenantoussaintjoane-gif/FACE-CAM-AI.git
cd FACE-CAM-AI
```

## 2. Backend
```bat
cd backend
copy .env.example .env
REM Renseigner SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY
npm install
npm run dev
REM API sur http://localhost:4000 — health: http://localhost:4000/api/health
```

## 3. Frontend
```bat
cd ..\frontend
copy .env.example .env
REM Renseigner VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_API_URL=http://localhost:4000/api
npm install
npm run dev
REM App sur http://localhost:5173
```

## 4. Supabase
- Créer un projet sur https://supabase.com
- SQL Editor → exécuter `supabase/migrations/001_initial.sql`
- Storage → créer bucket `facecam-references` (private)
- Auth → activer Email provider

Sans Supabase, l’app fonctionne en **mode démo** (auth et stockage locaux).

## Build production
```bat
cd frontend & npm run build & npm run preview
cd ..\backend & npm run build & npm start
```

## Tests rapides
- `npm run typecheck` dans chaque dossier
- `npm run build` doit réussir sans erreur TS
