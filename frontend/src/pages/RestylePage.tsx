import Sidebar from '../components/Sidebar'
import { useEffect, useState } from 'react'
import { Search, Upload, Trash2, Save, Image as ImageIcon } from 'lucide-react'

type Cat = 'realistic' | 'professional' | 'cinematic' | 'artistic' | 'futuristic' | 'virtual'
const CATS: { id: Cat; label: string }[] = [
  { id: 'realistic', label: 'Réaliste' },
  { id: 'professional', label: 'Professionnel' },
  { id: 'cinematic', label: 'Cinématographique' },
  { id: 'artistic', label: 'Artistique' },
  { id: 'futuristic', label: 'Futuriste' },
  { id: 'virtual', label: 'Personnages virtuels' },
]

const MOCK_AVATARS = [
  { id: '1', name: 'Elena — Studio', category: 'realistic' as Cat, img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=60' },
  { id: '2', name: 'Marcus — Pro', category: 'professional' as Cat, img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=60' },
  { id: '3', name: 'Ava — Ciné', category: 'cinematic' as Cat, img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=60' },
  { id: '4', name: 'Kenji — Art', category: 'artistic' as Cat, img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=60' },
  { id: '5', name: 'Nova — Futur', category: 'futuristic' as Cat, img: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&q=60' },
  { id: '6', name: 'Orion — Virtuel', category: 'virtual' as Cat, img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=60' },
  { id: '7', name: 'Sofia — Réel', category: 'realistic' as Cat, img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=60' },
  { id: '8', name: 'Liam — Pro', category: 'professional' as Cat, img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=60' },
]

export default function RestylePage() {
  const [cat, setCat] = useState<Cat | 'all'>('all')
  const [query, setQuery] = useState('')
  const [myAvatars, setMyAvatars] = useState<typeof MOCK_AVATARS>(() => {
    try { return JSON.parse(localStorage.getItem('facecam_my_avatars') || '[]') } catch { return [] }
  })
  const [selected, setSelected] = useState<typeof MOCK_AVATARS[0] | null>(MOCK_AVATARS[0])
  const [previewImg, setPreviewImg] = useState<string | null>(null)

  useEffect(() => { localStorage.setItem('facecam_my_avatars', JSON.stringify(myAvatars)) }, [myAvatars])

  const filtered = MOCK_AVATARS.filter(a => (cat === 'all' || a.category === cat) && a.name.toLowerCase().includes(query.toLowerCase()))

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) { alert('Format non supporté'); return }
    const url = URL.createObjectURL(file)
    const entry = { id: 'user-' + Date.now(), name: file.name.replace(/\.[^.]+$/, ''), category: 'realistic' as Cat, img: url }
    setMyAvatars(v => [entry, ...v])
    setPreviewImg(url)
  }

  const rename = (id: string) => {
    const name = prompt('Nouveau nom ?')
    if (!name) return
    setMyAvatars(v => v.map(a => a.id === id ? { ...a, name } : a))
  }

  return (
    <div className="min-h-screen bg-[#05070f] text-white flex">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <header className="h-[64px] border-b border-white/10 flex items-center justify-between px-6 bg-[#0b0e1a]/50">
          <h1 className="display font-semibold">Restyle Studio</h1>
          <label className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black text-sm font-semibold cursor-pointer">
            <Upload className="h-4 w-4" /> Importer une référence
            <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleUpload} />
          </label>
        </header>

        <div className="p-6 grid lg:grid-cols-[1fr_380px] gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-[#0f1224] border border-white/10 rounded-full p-1">
                <button onClick={() => setCat('all')} className={`px-4 py-1.5 rounded-full text-xs font-medium ${cat === 'all' ? 'bg-white text-black' : 'text-white/60'}`}>Tous</button>
                {CATS.map(c => <button key={c.id} onClick={() => setCat(c.id)} className={`px-3 py-1.5 rounded-full text-xs ${cat === c.id ? 'bg-white text-black' : 'text-white/60'}`}>{c.label}</button>)}
              </div>
              <div className="flex items-center gap-2 bg-[#0f1224] border border-white/10 rounded-full px-3 py-2">
                <Search className="h-4 w-4 text-white/40" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Rechercher..." className="bg-transparent outline-none text-sm w-40 placeholder:text-white/30" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {filtered.map(a => (
                <button key={a.id} onClick={() => { setSelected(a); setPreviewImg(a.img) }} className={`rounded-2xl overflow-hidden border text-left card-hover ${selected?.id === a.id ? 'border-[#6366f1] ring-1 ring-[#6366f1]/20' : 'border-white/10'}`}>
                  <img src={a.img} alt={a.name} className="h-44 w-full object-cover" />
                  <div className="p-3 bg-[#0f1224] flex items-center justify-between">
                    <div><div className="text-sm font-medium">{a.name}</div><div className="text-xs text-white/40">{CATS.find(c => c.id === a.category)?.label}</div></div>
                    <span className="h-7 w-7 rounded-full bg-white text-black grid place-items-center text-xs">↗</span>
                  </div>
                </button>
              ))}
            </div>

            {myAvatars.length > 0 && (
              <div className="mt-8">
                <h3 className="font-semibold text-sm">Mes créations</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
                  {myAvatars.map(a => (
                    <div key={a.id} className="rounded-2xl overflow-hidden border border-white/10 bg-[#0f1224]">
                      <img src={a.img} alt={a.name} className="h-36 w-full object-cover" />
                      <div className="p-3 flex items-center justify-between">
                        <span className="text-sm">{a.name}</span>
                        <div className="flex gap-1">
                          <button onClick={() => rename(a.id)} className="p-2 rounded-full bg-white/10"><Save className="h-3.5 w-3.5" /></button>
                          <button onClick={() => setMyAvatars(v => v.filter(x => x.id !== a.id))} className="p-2 rounded-full bg-red-500/15 text-red-300"><Trash2 className="h-3.5 w-3.5" /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl bg-[#0f1224] border border-white/10 p-4">
              <div className="text-sm font-semibold">Prévisualisation</div>
              <div className="mt-3 rounded-xl overflow-hidden bg-black border border-white/10 aspect-[4/3] flex items-center justify-center">
                {previewImg || selected ? <img src={previewImg || selected?.img} alt="preview" className="w-full h-full object-cover" /> : <div className="text-xs text-white/30 flex flex-col items-center gap-2"><ImageIcon className="h-8 w-8" /> Sélectionnez un avatar</div>}
              </div>
              <div className="mt-3 flex gap-2">
                <button className="flex-1 py-2.5 rounded-full gradient-btn text-sm font-semibold">Utiliser dans Swap Live</button>
                <button className="px-4 py-2.5 rounded-full bg-white/10 border border-white/10 text-sm">Enregistrer</button>
              </div>
              <div className="mt-3 text-xs text-white/40">Les paramètres avancés (teinte peau, intensité, lissage) s’activent lorsque le moteur GAN/3D est connecté. Architecture prête pour moteur externe — voir docs.</div>
            </div>

            <div className="rounded-2xl bg-[#0f1224] border border-white/10 p-4">
              <div className="text-sm font-semibold">Ajustements</div>
              <div className="mt-4 space-y-4 text-xs">
                {['Intensité', 'Lissage', 'Éclairage'].map(k => (
                  <div key={k}><div className="flex justify-between"><span className="text-white/60">{k}</span><span>50%</span></div><div className="mt-1 h-1.5 rounded-full bg-white/10"><div className="h-full w-1/2 bg-[#6366f1] rounded-full" /></div></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
