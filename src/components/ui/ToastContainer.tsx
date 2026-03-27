import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react'
import { useUIStore } from '../../store/useUIStore'
import type { ToastType } from '../../types'

const ICON: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle size={13} style={{ color: 'var(--ok)' }} />,
  error:   <XCircle     size={13} style={{ color: 'var(--danger)' }} />,
  info:    <Info        size={13} style={{ color: 'var(--info)' }} />,
  warning: <AlertTriangle size={13} style={{ color: 'var(--warn)' }} />,
}

const BORDER_COLOR: Record<ToastType, string> = {
  success: 'rgba(34,197,94,0.25)',
  error:   'rgba(239,68,68,0.25)',
  info:    'rgba(96,165,250,0.25)',
  warning: 'rgba(245,158,11,0.25)',
}

export default function ToastContainer() {
  const { toasts, removeToast } = useUIStore()

  if (!toasts.length) return null

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 no-print">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="toast flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg min-w-[200px] max-w-xs"
          style={{
            background: 'var(--bg-surface)',
            border: `1px solid ${BORDER_COLOR[toast.type]}`,
          }}
        >
          {ICON[toast.type]}
          <span className="text-xs flex-1" style={{ color: 'var(--text-primary)' }}>{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            style={{ color: 'var(--text-muted)' }}
          >
            <X size={12} />
          </button>
        </div>
      ))}
    </div>
  )
}
