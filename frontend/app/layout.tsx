import './globals.css'
import { Space_Mono, Bebas_Neue } from 'next/font/google'

const mono    = Space_Mono({ subsets: ['latin'], weight: ['400','700'], variable: '--font-mono' })
const display = Bebas_Neue({ subsets: ['latin'], weight: ['400'],       variable: '--font-display' })

export const metadata = {
  title:       'ChainSnark — The Blockchain That Judges You',
  description: 'Ask it anything. Show it your wallet. It will not be kind.',
  openGraph: {
    title:       'ChainSnark',
    description: 'The blockchain that judges you. Powered by GenLayer AI.',
  },
  twitter: { card: 'summary_large_image' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${mono.variable} ${display.variable}`}>
      <body style={{ fontFamily: 'var(--font-mono), monospace' }}>
        {children}
      </body>
    </html>
  )
}
