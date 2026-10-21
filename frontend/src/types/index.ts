export type SubscriptionTier = 'free' | 'pro' | 'premium'

export interface Profile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  subscription_tier: SubscriptionTier
  created_at: string
}

export interface Avatar {
  id: string
  user_id: string | null
  name: string
  category: 'realistic' | 'professional' | 'cinematic' | 'artistic' | 'futuristic' | 'virtual'
  thumbnail_url: string
  image_url: string
  is_public: boolean
  created_at: string
}

export interface Transformation {
  id: string
  user_id: string
  avatar_id?: string
  reference_image_url?: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  created_at: string
}

export interface TranslationSession {
  id: string
  user_id: string
  source_lang: string
  target_lang: string
  transcript: string
  translation: string
  created_at: string
}

export interface UsageRecord {
  minutes_used: number
  quota_minutes: number
  transformations_used: number
  quota_transformations: number
}

export const LANGUAGES = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'pt', label: 'Português' },
  { code: 'de', label: 'Deutsch' },
  { code: 'it', label: 'Italiano' },
] as const

export const AVATAR_CATEGORIES = [
  { id: 'realistic', label: 'Réaliste' },
  { id: 'professional', label: 'Professionnel' },
  { id: 'cinematic', label: 'Cinématographique' },
  { id: 'artistic', label: 'Artistique' },
  { id: 'futuristic', label: 'Futuriste' },
  { id: 'virtual', label: 'Personnages virtuels' },
] as const
