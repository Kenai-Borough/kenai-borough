import { motion } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'
import { Footer } from './Footer'
import { Header } from './Header'

export function Layout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 transition-colors dark:bg-alaska-night dark:text-white">
      <Header />
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="min-h-[70vh]"
      >
        <Outlet />
      </motion.main>
      <Footer />
    </div>
  )
}
