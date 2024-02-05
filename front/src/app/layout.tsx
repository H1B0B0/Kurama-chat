import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Real time Chat',
  description: 'Real time chat application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className='bg-[url("/images/bg.jpg")] min-h-screen bg-cover bg-no-repeat bg-[#050505AB] bg-blend-overlay'>{children}</body>
    </html>
  )
}