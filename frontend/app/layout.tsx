import './globals.css'
import { JetBrains_Mono, Share_Tech_Mono } from 'next/font/google'

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['300','400','500','700'],
  variable: '--font-mono',
})

export const metadata = {
  title: 'ChainSnark — The Blockchain That Judges You',
  description: 'Ask it anything. Show it your wallet. It will not be kind.',
  openGraph: {
    title: 'ChainSnark',
    description: 'The blockchain that judges you. Powered by GenLayer AI.',
  },
  twitter: { card: 'summary_large_image' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jetbrains.variable}>
      <body>
        {children}
      </body>
    </html>
  )
}
