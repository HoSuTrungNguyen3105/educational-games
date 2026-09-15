import { useState, useEffect, useMemo } from 'react'
import { navigate } from '../../lib/router.js'
import { renderAvatarFull } from '../../lib/avatarRenderer.js'
import { API_BASE } from '../../services/api.js'
import DreamDaleApp from '../../components/dreamdale/DreamDale.jsx'
import { ArrowLeft } from 'lucide-react'

export default function DreamDalePage({ userAuth }) {
  const [loadout, setLoadout] = useState({})
  const [avatarItems, setAvatarItems] = useState([])

  useEffect(() => {
    if (!userAuth?.user) return
    Promise.all([
      fetch(`${API_BASE}/avatar/items`).then(r => r.json()),
      fetch(`${API_BASE}/avatar/loadout`, { headers: { Authorization: `Bearer ${userAuth.token}` } }).then(r => r.json()),
    ]).then(([itemsRes, loadoutRes]) => {
      if (itemsRes.status) setAvatarItems(itemsRes.data.items || [])
      if (loadoutRes.status) {
        const raw = loadoutRes.data.loadout || {}
        const VALID_LAYERS = ['body', 'skin', 'face', 'hair', 'shirt', 'pants', 'shoes', 'hat', 'glasses', 'accessory']
        const codes = {}
        for (const k of VALID_LAYERS) {
          const v = raw[k]
          if (v && typeof v === 'object' && v.code) codes[k] = v.code
          else if (typeof v === 'string') codes[k] = v
          else codes[k] = null
        }
        setLoadout(codes)
      }
    }).catch(() => {})
  }, [userAuth?.user])

  const avatarSvg = useMemo(() => {
    if (!avatarItems.length || !Object.keys(loadout).length) return null
    const state = {}
    let bodyHtml = null
    for (const [cat, itemId] of Object.entries(loadout)) {
      if (!itemId) continue
      const item = avatarItems.find(i => i.code === itemId)
      if (!item) continue
      if (cat === 'body') bodyHtml = item.html || null
      else if (cat === 'skin') state.skin = item.params?.hex || '#FFDFC4'
      else if (cat === 'face') state.face = item.params?.style || 'gentle'
      else if (cat === 'hair') state.hair = { style: item.params?.style || 'spiky', color: item.params?.color || '#6B4226' }
      else if (cat === 'shirt') state.shirt = { style: item.params?.style || 'tee', color: item.params?.color || '#F5F5F5' }
      else if (cat === 'pants') state.pants = { style: item.params?.style || 'shorts', color: item.params?.color || '#241F1C' }
      else if (cat === 'shoes') state.shoes = { style: item.params?.style || 'sneaker', color: item.params?.color || '#3B5EA6' }
      else if (cat === 'hat') state.hat = { style: item.params?.style || 'none', color: item.params?.color || '#000' }
      else if (cat === 'glasses') state.glasses = { style: item.params?.style || 'none', color: item.params?.color || '#000' }
      else if (cat === 'accessory') state.accessory = { style: item.params?.style || 'none', color: item.params?.color || '#000' }
    }
    return renderAvatarFull(state, bodyHtml)
  }, [loadout, avatarItems])

  return (
    <div style={{
      height: '100dvh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      background: '#000',
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '6px 12px',
        background: 'linear-gradient(90deg, #1a0533, #2d1b69)',
        color: '#fff',
        zIndex: 10,
        flexShrink: 0,
        minHeight: 40,
      }}>
        <button onClick={() => navigate("/")} style={{
          background: 'rgba(255,255,255,0.15)',
          border: 'none',
          color: '#fff',
          width: 30,
          height: 30,
          borderRadius: '50%',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <ArrowLeft size={16} />
        </button>
        <span style={{
          fontWeight: 800,
          fontSize: 13,
          whiteSpace: 'nowrap',
        }}>DreamDale</span>
      </div>
      <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
        <DreamDaleApp userAuth={userAuth} avatarSvg={avatarSvg} />
      </div>
    </div>
  )
}
