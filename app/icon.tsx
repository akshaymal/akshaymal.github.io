import { ImageResponse } from 'next/og'
import { Mark } from '@/components/mark'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F9F6F0',
        }}
      >
        <Mark ink="#1E1A15" accent="#C4511C" weight={3.4} style={{ width: 27, height: 27 }} />
      </div>
    ),
    { ...size }
  )
}
