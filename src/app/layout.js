import { Nanum_Gothic_Coding } from 'next/font/google'
import './globals.css'

const nanum_gothic_coding = Nanum_Gothic_Coding({
  variable: '--font-nanum-gothic-coding',
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: 'next-rclone',
  description: 'Web UI for rclone by Next.js',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${nanum_gothic_coding.variable}`}>
      <body>{children}</body>
    </html>
  )
}
