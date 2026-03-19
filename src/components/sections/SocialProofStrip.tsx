"use client"

import { useState, useEffect } from "react"
import { Star, ThumbsUp, MessageCircle, ShoppingCart } from "lucide-react"

const TESTIMONIALS = [
  {
    name: "Sarah M.", role: "Infirmière, Lyon", avatar: "👩‍⚕️", tag: "Douleur chronique",
    quote: "3 ans d'aponévrosite plantaire. En 1 semaine, je peux enfin finir mes gardes sans souffrir. Ces semelles ont littéralement changé ma vie.",
    rating: 5, likes: 247, time: "il y a 2 jours", verified: true, tagColor: "bg-red-100 text-red-700"
  },
  {
    name: "Thomas B.", role: "Ouvrier du bâtiment, Bordeaux", avatar: "👷", tag: "Travail debout",
    quote: "10h par jour sur du béton. Avant, je rentrais chez moi en boitant. Maintenant je cours avec mes enfants le soir. Incroyable.",
    rating: 5, likes: 189, time: "il y a 3 jours", verified: true, tagColor: "bg-orange-100 text-orange-700"
  },
  {
    name: "Marie-Claire D.", role: "Golfeuse, Biarritz", avatar: "⛳", tag: "Sport & Performance",
    quote: "Mon podologue m'a coûté 800€ en 2 ans. Ces semelles à 25€ font le même travail. Je les ai commandées pour toute ma famille.",
    rating: 5, likes: 312, time: "il y a 1 jour", verified: true, tagColor: "bg-green-100 text-green-700"
  },
  {
    name: "Jean-Pierre L.", role: "Facteur, Paris", avatar: "📬", tag: "Marche intensive",
    quote: "Je marche 25km par jour. Ces semelles ont éliminé mes douleurs au talon dès le 2ème jour. Je les recommande à tous mes collègues.",
    rating: 5, likes: 156, time: "il y a 4 jours", verified: true, tagColor: "bg-blue-100 text-blue-700"
  },
  {
    name: "Isabelle R.", role: "Professeure, Toulouse", avatar: "👩‍🏫", tag: "Debout toute la journée",
    quote: "Debout 8h par jour en classe. Mes genoux et mon dos me faisaient souffrir. Depuis ces semelles, je termine mes journées sans douleur.",
    rating: 5, likes: 203, time: "il y a 5 jours", verified: true, tagColor: "bg-purple-100 text-purple-700"
  },
]

const RECENT_PURCHASES = [
  { city: "Paris", name: "Marie T.", time: "il y a 3 min" },
  { city: "Lyon", name: "Jean-Paul R.", time: "il y a 7 min" },
  { city: "Bordeaux", name: "Sophie L.", time: "il y a 12 min" },
  { city: "Marseille", name: "Antoine D.", time: "il y a 18 min" },
  { city: "Nantes", name: "Claire M.", time: "il y a 24 min" },
  { city: "Toulouse", name: "Pierre B.", time: "il y a 31 min" },
]

export function SocialProofStrip() {
  const [likes, setLikes] = useState<Record<number, boolean>>({})
  const [notification, setNotification] = useState<typeof RECENT_PURCHASES[0] | null>(null)
  const [notifIdx, setNotifIdx] = useState(0)

  // Rotate purchase notifications
  useEffect(() => {
    const show = () => {
      setNotification(RECENT_PURCHASES[notifIdx % RECENT_PURCHASES.length])
      setNotifIdx(i => i + 1)
      setTimeout(() => setNotification(null), 4000)
    }
    show()
    const interval = setInterval(show, 8000)
    return () => clearInterval(interval)
  }, [])

  const toggleLike = (idx: number) => {
    setLikes(prev => ({ ...prev, [idx]: !prev[idx] }))
  }

  return (
    <section id="reviews" className="py-24 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
      {/* Purchase notification popup */}
      {notification && (
        <div className="fixed bottom-6 left-6 z-50 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-border p-4 flex items-center gap-3 animate-in slide-in-from-left-4 duration-500 max-w-xs">
          <div className="bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full p-2 shrink-0">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-black text-foreground">{notification.name} à {notification.city}</p>
            <p className="text-xs text-muted-foreground">vient de commander ses semelles {notification.time}</p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center rounded-full border border-yellow-400/30 px-4 py-1.5 text-xs font-black uppercase text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 shadow-sm">
            ⭐ Avis Clients Vérifiés
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Ils ont retrouvé une vie <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">sans douleur</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Plus de 50 000 clients satisfaits. Voici leurs histoires.
          </p>
          {/* Rating summary */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <div className="flex items-center gap-2">
              <span className="text-5xl font-black text-foreground">4.9</span>
              <div className="flex flex-col items-start">
                <div className="flex text-yellow-400 gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                </div>
                <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">50 000+ avis</span>
              </div>
            </div>
            <div className="h-12 w-px bg-border" />
            <div className="flex flex-col items-start gap-1">
              {[5,4,3].map(stars => (
                <div key={stars} className="flex items-center gap-2">
                  <span className="text-xs font-bold w-4">{stars}★</span>
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 rounded-full" style={{ width: stars === 5 ? "92%" : stars === 4 ? "6%" : "2%" }} />
                  </div>
                  <span className="text-xs text-muted-foreground">{stars === 5 ? "92%" : stars === 4 ? "6%" : "2%"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonial cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div key={idx} className="bg-card border border-border rounded-3xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-2xl border-2 border-primary/20 shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-black text-sm text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0 ${t.tagColor}`}>
                  {t.tag}
                </span>
              </div>

              {/* Stars */}
              <div className="flex text-yellow-400 gap-0.5">
                {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>

              {/* Quote */}
              <p className="text-sm text-muted-foreground leading-relaxed flex-1 italic">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleLike(idx)}
                    className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${likes[idx] ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
                  >
                    <ThumbsUp className={`w-4 h-4 ${likes[idx] ? "fill-current" : ""}`} />
                    {t.likes + (likes[idx] ? 1 : 0)}
                  </button>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MessageCircle className="w-4 h-4" />
                    {Math.floor(t.likes * 0.15)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {t.verified && (
                    <span className="text-[10px] text-green-600 font-black flex items-center gap-1">
                      ✔ Acheteur Vérifié
                    </span>
                  )}
                  <span className="text-[10px] text-muted-foreground">{t.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
