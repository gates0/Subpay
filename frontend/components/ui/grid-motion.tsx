// components/ui/grid-motion.tsx
"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

interface GridMotionProps {
  items?: string[]
  gradientColor?: string
}

const GridMotion = ({ items = [], gradientColor = "#6C36F5" }: GridMotionProps) => {
  const gridRef = useRef<HTMLDivElement>(null)
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])
  const mouseXRef = useRef<number>(
    typeof window !== "undefined" ? window.innerWidth / 2 : 400
  )

  const totalItems = 28
  const defaultItems = Array.from({ length: totalItems }, (_, i) => `/authclips/auth${i + 1}.jpg`)
  const combinedItems = items.length > 0 ? items.slice(0, totalItems) : defaultItems

  useEffect(() => {
    gsap.ticker.lagSmoothing(0)

    const handleMouseMove = (e: MouseEvent) => {
      mouseXRef.current = e.clientX
    }

    const updateMotion = () => {
      const maxMoveAmount = 300
      const baseDuration = 0.8
      const inertiaFactors = [0.6, 0.4, 0.3, 0.2]

      rowRefs.current.forEach((row, index) => {
        if (row) {
          const direction = index % 2 === 0 ? 1 : -1
          const moveAmount =
            ((mouseXRef.current / window.innerWidth) * maxMoveAmount - maxMoveAmount / 2) * direction
          gsap.to(row, {
            x: moveAmount,
            duration: baseDuration + inertiaFactors[index % inertiaFactors.length],
            ease: "power3.out",
            overwrite: "auto",
          })
        }
      })
    }

    const removeLoop = gsap.ticker.add(updateMotion)
    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      removeLoop()
    }
  }, [])

  return (
    <div ref={gridRef} className="h-full w-full overflow-hidden">
      <section
        className="w-full h-full overflow-hidden relative flex items-center justify-center"
        style={{
          background: `radial-gradient(circle at center, ${gradientColor}18 0%, transparent 70%)`,
        }}
      >
        {/* Edge vignette — fades grid into the violet bg */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, transparent 35%, #5B21B6 100%)",
          }}
        />

        {/* Grid */}
        <div
          className="gap-3 flex-none absolute w-[150vw] h-[150vh] grid grid-rows-4 grid-cols-1 origin-center z-[2]"
          style={{ transform: "rotate(-15deg)" }}
        >
          {[...Array(4)].map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="grid gap-3 grid-cols-7"
              style={{ willChange: "transform" }}
              ref={(el) => { rowRefs.current[rowIndex] = el }}
            >
              {[...Array(7)].map((_, itemIndex) => {
                const src = combinedItems[rowIndex * 7 + itemIndex]
                return (
                  <div key={itemIndex} className="relative aspect-[3/4]">
                    <div
                      className="w-full h-full overflow-hidden rounded-2xl bg-[#4C1D95] bg-cover bg-center"
                      style={{ backgroundImage: `url(${src})` }}
                    />
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default GridMotion