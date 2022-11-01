import { HeaderContainer } from './styles'
import { Timer, Scroll } from 'phosphor-react'
import logoIgniteSVG from '../../assets/logo-ignite.svg'
import { NavLink } from 'react-router-dom'

export function Header() {
  return (
    <HeaderContainer>
      <img src={logoIgniteSVG} alt="" />
      <nav>
        {/* O NavLink coloca uma classe active automáticamente e um aria-current=page */}
        {/* A prop end indica que os descendant paths (ex: /history) não devem ser considerados como ativo */}
        <NavLink to="/" title="Timer" end>
          <Timer size={24} />
        </NavLink>
        <NavLink to="/history" title="Histórico" end>
          <Scroll size={24} />
        </NavLink>
      </nav>
    </HeaderContainer>
  )
}
