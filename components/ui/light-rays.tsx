'use client'

import { useEffect, useState, type CSSProperties, type Ref } from 'react'
import { motion } from 'motion/react'

import { cn } from '@/lib/utils'

interface LightRaysProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>
  count?: number
  color?: string
  blur?: number
  speed?: number
  length?: string
}

type LightRay = {
  id: string
  left: number
  rotate: number
  width: number
  swing: number
  delay: number
  duration: number
  intensity: number
}

const createRays = (count: number, cycle: number): LightRay[] => {
  if (count <= 0) return []

  return Array.from({ length: count }, (_, index) => {
    const left = 5 + Math.random() * 90
    const rotate = -25 + Math.random() * 50
    const width = 180 + Math.random() * 180
    const swing = 1.0 + Math.random() * 2.0
    const delay = Math.random() * 2
    const duration = Math.max(cycle * (0.8 + Math.random() * 0.4), 4)
    const intensity = 0.7 + Math.random() * 0.3

    return {
      id: `${index}-${Math.round(left * 10)}`,
      left,
      rotate,
      width,
      swing,
      delay,
      duration,
      intensity,
    }
  })
}

const Ray = ({ left, rotate, width, swing, delay, duration, intensity }: LightRay) => {
  return (
    <motion.div
      className="pointer-events-none absolute -top-[15%] origin-top -translate-x-1/2 rounded-full blur-[var(--light-rays-blur,36px)]"
      style={{
        left: `${left}%`,
        width: `${width}px`,
        height: 'var(--light-rays-length, 75vh)',
        background:
          'linear-gradient(to bottom, var(--light-rays-color, rgba(236, 72, 153, 0.12)) 0%, transparent 100%)',
      }}
      initial={{ rotate: rotate, opacity: intensity * 0.35 }}
      animate={{
        opacity: [intensity * 0.25, intensity, intensity * 0.25],
        rotate: [rotate - swing, rotate + swing, rotate - swing],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: delay,
      }}
    />
  )
}

export function LightRays({
  className,
  style,
  count = 8,
  color,
  blur = 36,
  speed = 12,
  length = '75vh',
  ref,
  ...props
}: LightRaysProps) {
  const [rays, setRays] = useState<LightRay[]>([])

  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    setRays(createRays(count, speed))
  }, [count, speed])

  const customStyle: CSSProperties = {
    '--light-rays-blur': `${blur}px`,
    '--light-rays-length': length,
    ...(color ? { '--light-rays-color': color } : {}),
    ...style,
  } as CSSProperties

  return (
    <div
      ref={ref}
      className={cn('pointer-events-none absolute inset-0 isolate overflow-hidden', className)}
      style={customStyle}
      {...props}
    >
      <div className="absolute inset-0 overflow-hidden">
        {/* Top ambient glow patches */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 25% 10%, var(--light-rays-ambient-1, rgba(236, 72, 153, 0.07)) 0%, transparent 65%)',
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 75% 8%, var(--light-rays-ambient-2, rgba(99, 102, 241, 0.05)) 0%, transparent 70%)',
          }}
        />
        {rays.map((ray) => (
          <Ray key={ray.id} {...ray} />
        ))}
      </div>
    </div>
  )
}
export default LightRays
