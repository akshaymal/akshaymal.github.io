import { ImageResponse } from 'next/og'
import { Mark } from '@/components/mark'

export const alt = 'Akshay Malhotra — Senior software engineer building reliable distributed systems.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 64,
          padding: '0 96px',
          background: '#F9F6F0',
          color: '#1E1A15',
        }}
      >
        <Mark ink="#1E1A15" accent="#C4511C" weight={2.4} style={{ width: 220, height: 220, flexShrink: 0 }} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 64, fontWeight: 700 }}>Akshay Malhotra</div>
          <div style={{ fontSize: 30, opacity: 0.72, marginTop: 12 }}>
            Senior software engineer building reliable distributed systems.
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
