import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
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
              marginBottom: 30,
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
                marginRight: 0,
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
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
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
              marginBottom: 40,
            }}
          >
            Free AI Chat with GPT-4, Claude, Gemini, Grok & More
          </div>

          {/* Features */}
          <div
            style={{
              display: 'flex',
              gap: 40,
              color: 'white',
              fontSize: 20,
            }}
          >
            <div>🆓 Completely Free</div>
            <div>🤖 7+ AI Models</div>
            <div>🔒 No Registration</div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e) {
    console.log(e)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}