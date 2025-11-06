import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <title>Mi Inventario</title>
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
