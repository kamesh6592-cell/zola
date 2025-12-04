import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'MEOW CHAT by AJ STUDIOZ - Free AI Chat Interface'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1a1a1a',
          backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        {/* Logo Area */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 120,
              height: 120,
              backgroundColor: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 30,
            }}
          >
            <span style={{ fontSize: 60, color: '#667eea' }}>🐱</span>
          </div>
        </div>

        {/* Main Title */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
            marginBottom: 20,
          }}
        >
          MEOW CHAT
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 32,
            color: 'rgba(255,255,255,0.9)',
            textAlign: 'center',
            marginBottom: 30,
          }}
        >
          by AJ STUDIOZ
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 28,
            color: 'rgba(255,255,255,0.8)',
            textAlign: 'center',
            maxWidth: 900,
            lineHeight: 1.4,
          }}
        >
          Free AI Chat with GPT-4, Claude, Gemini, Grok & More
        </div>

        {/* Features */}
        <div
          style={{
            display: 'flex',
            marginTop: 40,
            gap: 40,
          }}
        >
          <div style={{ color: 'white', fontSize: 20 }}>🆓 Completely Free</div>
          <div style={{ color: 'white', fontSize: 20 }}>🤖 7+ AI Models</div>
          <div style={{ color: 'white', fontSize: 20 }}>🔒 No Registration</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}