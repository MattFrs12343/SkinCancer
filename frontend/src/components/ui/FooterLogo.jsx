import { useTheme } from '../../hooks/useTheme'

const FooterLogo = ({ className = "h-12 w-auto", alt = "OncoDerma" }) => {
  const { isDark } = useTheme()

  // Solo en el footer usamos el logo oscuro en modo dark
  const logoSrc = isDark ? "/img/DarckLogoOscuro.png" : "/img/OncoDerma-Logo.png"

  return (
    <div className={`relative ${className}`}>
      <img
        src={logoSrc}
        alt={alt}
        className={`transition-all duration-300 ${className}`}
        onError={(e) => {
          console.log(`Error cargando logo del footer ${logoSrc}:`, e)
          // Fallback al logo original si el oscuro falla
          e.target.src = '/img/OncoDerma-Logo.png'
        }}
        onLoad={() => {
          console.log(`Logo del footer cargado: ${logoSrc}`)
        }}
      />
    </div>
  )
}

export default FooterLogo