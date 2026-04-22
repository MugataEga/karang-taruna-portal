// components/layout/HeaderOnlyLayout.jsx
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

export default function HeaderOnlyLayout() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: '60px' }}>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
