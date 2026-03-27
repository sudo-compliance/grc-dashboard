import { useEffect, useState } from 'react'

interface ProgressRingProps {
  percentage: number
  size?: number
  strokeWidth?: number
  color?: string
  label?: string
}

export default function ProgressRing({
  percentage,
  size = 80,
  strokeWidth = 7,
  color = 'var(--accent)',
  label,
}: ProgressRingProps) {
  const [animated, setAnimated] = useState(0)
  const radius       = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset       = circumference - (animated / 100) * circumference

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(percentage), 50)
    return () => clearTimeout(timer)
  }, [percentage])

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none"
                stroke="var(--border-subtle)" strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none"
                stroke={color} strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="mono text-sm font-semibold leading-none" style={{ color: 'var(--text-primary)' }}>
          {Math.round(percentage)}%
        </span>
        {label && (
          <span className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{label}</span>
        )}
      </div>
    </div>
  )
}
