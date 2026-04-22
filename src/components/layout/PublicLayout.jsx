import { Outlet } from 'react-router-dom'
import Header from './Header'
import RWBar from './RWBar'
import Footer from './Footer'

export default function PublicLayout() {
  return (
    <>
      <Header />
      <RWBar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
