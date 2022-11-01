import { Outlet } from 'react-router-dom'
import { Header } from '../../components/Header'
import { LayoutContainer } from './styles'

export function DefaultLayout() {
  return (
    <LayoutContainer>
      <Header />

      {/* Insere o conteúdo da página no layout */}
      <Outlet />
    </LayoutContainer>
  )
}
