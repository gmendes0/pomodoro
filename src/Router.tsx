import { Routes, Route } from 'react-router-dom'
import { DefaultLayout } from './layouts/DefaultLayout'
import { History } from './pages/History'
import { Home } from './pages/Home'

export function Router() {
  return (
    <Routes>
      {/* Todas as rotas dentro de / (ex: /history) terao o <DefaultLayout /> */}
      <Route path="/" element={<DefaultLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<History />} />
      </Route>

      {/* Aqui, o AdminLayout será aplicado a todas as rotas dentro de /admin */}
      {/* Todas as rotas dentro desse primeiro Route começam com /admin, ex: /admin/products */}
      {/* 
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="products" element={<Products />} />
        </Route>
      */}
    </Routes>
  )
}
