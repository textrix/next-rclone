import './globals.css'

export const metadata = {
  title: 'next-rclone',
  description: 'Web UI for rclone by Next.js',
}

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
