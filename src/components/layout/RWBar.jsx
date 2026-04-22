// src/components/layout/RWBar.jsx
import { useRW } from '../../context/RWContext'

const RW_OPTIONS = [
  { key: 'all',   label: 'Semua', icon: '🏠' },
  { key: 'rw001', label: 'RW 001'  },
  { key: 'rw002', label: 'RW 002'  },
  { key: 'rw003', label: 'RW 003'  },
  { key: 'rw004', label: 'RW 004'  },
  { key: 'rw005', label: 'RW 005'  },
  { key: 'rw006', label: 'RW 006'  },
]

export default function RWBar() {
  const { activeRW, setActiveRW } = useRW()

  return (
    <div className="rw-bar" id="rwBar">
      <div className="rw-bar-inner">
        <div className="rw-label">Wilayah</div>
        {RW_OPTIONS.map(({ key, label, icon }) => (
          <button
            key={key}
            className={`rw-btn ${activeRW === key ? 'active' : ''}`}
            data-rw={key}
            onClick={() => setActiveRW(key)}
          >
            {icon && <span className="rw-icon">{icon}</span>} {label}
          </button>
        ))}
      </div>
    </div>
  )
}