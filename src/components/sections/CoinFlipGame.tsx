"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/store/CartContext"

type CoinSide = "heads" | "tails" | null
type GameState = "idle" | "flipping" | "result"

export function CoinFlipGame() {
    const [gameState, setGameState] = useState<GameState>("idle")
    const [result, setCoinResult] = useState<CoinSide>(null)
    const [choice, setChoice] = useState<CoinSide>(null)
    const [won, setWon] = useState<boolean | null>(null)
    const [flips, setFlips] = useState(0)
    const [isAnimating, setIsAnimating] = useState(false)
    const router = useRouter()
    const { setCartOpen } = useCart()

    const handleChoice = (picked: CoinSide) => {
        setChoice(picked)
        setGameState("flipping")
        setIsAnimating(true)

        // Animate coin for 2s then reveal
        setTimeout(() => {
            const outcome: CoinSide = Math.random() > 0.5 ? "heads" : "tails"
            setCoinResult(outcome)
            setWon(picked === outcome)
            setGameState("result")
            setIsAnimating(false)
            setFlips(f => f + 1)
        }, 2200)
    }

    const reset = () => {
        setGameState("idle")
        setCoinResult(null)
        setChoice(null)
        setWon(null)
    }

    return (
        <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-800 text-white overflow-hidden">
            <div className="container mx-auto px-4 md:px-6 max-w-2xl text-center">
                <div className="mb-8">
                    <span className="inline-block text-xs font-black uppercase tracking-widest bg-yellow-400 text-slate-900 px-4 py-1.5 rounded-full mb-4">
                        🎮 Mini-Jeu
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">
                        Pile ou Face — Tu Achètes ?
                    </h2>
                    <p className="text-slate-300 text-sm">
                        Indécis ? Laisse le destin décider. Choisis ton côté, puis lance la pièce !
                        {flips > 0 && <span className="ml-2 text-yellow-400 font-bold">({flips} lancé{flips > 1 ? "s" : ""})</span>}
                    </p>
                </div>

                {/* Coin */}
                <div className="flex justify-center mb-8">
                    <div className={`relative w-36 h-36 ${isAnimating ? "animate-spin" : ""}`}
                        style={{ animationDuration: "0.3s", animationIterationCount: isAnimating ? "7" : "0" }}>
                        {/* Coin face */}
                        <div className={`w-36 h-36 rounded-full border-4 flex items-center justify-center text-6xl shadow-2xl transition-all duration-500 ${
                            gameState === "result"
                                ? result === "heads"
                                    ? "bg-gradient-to-br from-yellow-300 to-yellow-500 border-yellow-600"
                                    : "bg-gradient-to-br from-slate-300 to-slate-500 border-slate-600"
                                : "bg-gradient-to-br from-yellow-300 to-yellow-500 border-yellow-600"
                        }`}>
                            {gameState === "flipping" ? "🌀" : gameState === "result" ? (result === "heads" ? "👑" : "🌊") : "🪙"}
                        </div>
                    </div>
                </div>

                {/* Game states */}
                {gameState === "idle" && (
                    <div className="space-y-4">
                        <p className="font-bold text-lg">Quel côté choisis-tu ?</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => handleChoice("heads")}
                                className="flex flex-col items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-black px-8 py-4 rounded-2xl transition-all hover:scale-105 shadow-lg"
                            >
                                <span className="text-3xl">👑</span>
                                <span className="text-sm uppercase tracking-wide">Pile</span>
                                <span className="text-xs font-normal opacity-70">= J&apos;achète !</span>
                            </button>
                            <button
                                onClick={() => handleChoice("tails")}
                                className="flex flex-col items-center gap-2 bg-slate-500 hover:bg-slate-400 text-white font-black px-8 py-4 rounded-2xl transition-all hover:scale-105 shadow-lg"
                            >
                                <span className="text-3xl">🌊</span>
                                <span className="text-sm uppercase tracking-wide">Face</span>
                                <span className="text-xs font-normal opacity-70">= Je réfléchis encore</span>
                            </button>
                        </div>
                    </div>
                )}

                {gameState === "flipping" && (
                    <div>
                        <p className="text-xl font-black animate-pulse text-yellow-400">La pièce est en l&apos;air... 🎲</p>
                        <p className="text-slate-400 mt-2 text-sm">Tu as choisi : <strong className="text-white">{choice === "heads" ? "👑 Pile (j'achète !)" : "🌊 Face (je réfléchis)"}</strong></p>
                    </div>
                )}

                {gameState === "result" && (
                    <div className="space-y-4">
                        <div className={`text-5xl mb-2 ${won ? "animate-bounce" : ""}`}>
                            {won ? "🎉" : "😅"}
                        </div>
                        <p className="text-2xl font-black">
                            {result === "heads" ? "👑 Pile !" : "🌊 Face !"}
                        </p>
                        {won ? (
                            choice === "heads" ? (
                                <>
                                    <p className="text-xl font-black text-yellow-400">Le destin a parlé — tu achètes ! 🚀</p>
                                    <p className="text-slate-300 text-sm">Tu vas adorer. 50 000+ clients ne peuvent pas se tromper.</p>
                                    <button
                                        onClick={() => setCartOpen(true)}
                                        className="mt-4 inline-block bg-primary hover:bg-primary/90 text-white font-black px-8 py-3 rounded-2xl shadow-[0_4px_15px_rgba(255,102,0,0.4)] transition-all hover:scale-105"
                                    >
                                        🛒 Commander maintenant →
                                    </button>
                                </>
                            ) : (
                                <>
                                    <p className="text-xl font-black text-slate-300">Face ! Tu continues à réfléchir... 🤔</p>
                                    <p className="text-slate-400 text-sm">Mais sache que tes pieds t&apos;en remercieront si tu craques !</p>
                                </>
                            )
                        ) : (
                            choice === "heads" ? (
                                <>
                                    <p className="text-xl font-black text-slate-300">Face ! Mais peut-être que le destin tente de te faire économiser... 😄</p>
                                    <p className="text-slate-400 text-sm">Ou pas. Lance à nouveau pour être sûr !</p>
                                </>
                            ) : (
                                <>
                                    <p className="text-xl font-black text-yellow-400">Pile ! Même quand tu ne veux pas, le destin dit d&apos;acheter ! 😂</p>
                                    <button
                                        onClick={() => setCartOpen(true)}
                                        className="mt-4 inline-block bg-primary hover:bg-primary/90 text-white font-black px-8 py-3 rounded-2xl shadow-[0_4px_15px_rgba(255,102,0,0.4)] transition-all hover:scale-105"
                                    >
                                        🛒 J&apos;obéis au destin →
                                    </button>
                                </>
                            )
                        )}
                        <div className="flex justify-center gap-3 mt-4">
                            <button
                                onClick={reset}
                                className="text-sm text-slate-400 hover:text-white underline transition-colors"
                            >
                                Rejouer 🔄
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}
