import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/_next/']
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/api/', '/_next/']
      }
    ],
    sitemap: 'https://www.meowchat.ajstudioz.co.in/sitemap.xml',
    host: 'https://www.meowchat.ajstudioz.co.in'
  }
}