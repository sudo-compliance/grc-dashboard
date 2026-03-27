interface CardProps {
  children: React.ReactNode
  className?: string
  title?: string
  subtitle?: string
  action?: React.ReactNode
  hover?: boolean
  accentColor?: string
}

export default function Card({
  children,
  className = '',
  title,
  subtitle,
  action,
  hover = false,
  accentColor,
}: CardProps) {
  return (
    <div
      className={`
        rounded-card p-5
        ${hover ? 'card-hover' : ''}
        ${className}
      `}
      style={{
        background:  'var(--bg-surface)',
        boxShadow:   'var(--card-shadow)',
        borderLeft:  accentColor ? `3px solid ${accentColor}` : undefined,
        borderRadius: 16,
      }}
    >
      {(title || action) && (
        <div className="flex items-start justify-between mb-4 gap-3">
          <div>
            {title && (
              <h3 className="text-[15px] font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm font-normal mt-0.5" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>
            )}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </div>
  )
}
