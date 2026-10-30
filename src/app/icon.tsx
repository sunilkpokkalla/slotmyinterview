import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#000000',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.15)'
        }}
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 32 32" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16 3L27 9.33333L16 15.6667L5 9.33333L16 3Z" stroke="#FFFFFF" strokeWidth="2" strokeLinejoin="round" />
          <path d="M5 9.33333V22.6667L16 29V15.6667L5 9.33333Z" stroke="#818CF8" strokeWidth="2" strokeLinejoin="round" />
          <path d="M27 9.33333V22.6667L16 29" stroke="#A855F7" strokeWidth="2" strokeLinejoin="round" />
          <path d="M11 14L16 18.5L24 10.5" stroke="#38BDF8" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    ),
    { ...size }
  )
}




