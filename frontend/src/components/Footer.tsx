import { Sparkles } from 'lucide-react'
export default function Footer() {
  return (
    <footer className="border-t border-[#1e2240] bg-[#080a14] mt-16">
      <div className="mx-auto max-w-[1280px] px-6 py-10">
        <div className="grid md:grid-cols-4 gap-8 text-sm">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#7c3aed] flex items-center justify-center"><Sparkles className="h-4 w-4 text-white" /></div>
              <span className="font-bold display">FACE-CAM AI</span>
            </div>
            <p className="text-white/50 leading-relaxed">Studio professionnel d’IA vidéo. Transformation faciale, avatars et traduction en direct.</p>
          </div>
          <div>
            <div className="font-semibold mb-3">Produit</div>
            <ul className="space-y-2 text-white/60">
              <li>Swap Live</li><li>Restyle Studio</li><li>Live Translate</li><li>Virtual Camera</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-3">Ressources</div>
            <ul className="space-y-2 text-white/60">
              <li>Documentation</li><li>API</li><li>Confidentialité</li><li>Conditions</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-3">Contact</div>
            <p className="text-white/60">support@facecam.ai<br/>© {new Date().getFullYear()} FACE-CAM AI. Tous droits réservés.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
