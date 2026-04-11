import { Menu, MoonStar, SunMedium, Trees, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'

const navigation = [
  { to: '/', label: 'Home' },
  { to: '/directory', label: 'Directory' },
  { to: '/activities', label: 'Activities' },
  { to: '/events', label: 'Events' },
  { to: '/trip-planner', label: 'Trip Planner' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { user, signOut } = useAuth()

  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-alaska-night/85">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-slate-900 dark:text-white">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-aurora bg-cover text-white shadow-glacier">
            <Trees className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-xs uppercase tracking-[0.3em] text-alaska-ocean">Community hub</span>
            <span className="text-lg font-semibold">Kenai Borough</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive
                  ? 'rounded-full px-4 py-2 text-sm font-medium transition bg-alaska-forest text-white shadow-glacier'
                  : 'rounded-full px-4 py-2 text-sm font-medium transition text-slate-700 hover:bg-slate-900/5 dark:text-slate-200 dark:hover:bg-white/10'
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            onClick={toggleTheme}
            className="rounded-full border border-slate-200 bg-white p-2 text-slate-700 transition hover:scale-105 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <SunMedium className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
          </button>
          {user ? (
            <>
              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-900/5 dark:text-white dark:hover:bg-white/10">
                {user.role === 'admin' ? 'Admin' : 'Dashboard'}
              </Link>
              <button onClick={() => void signOut()} className="rounded-full bg-alaska-forest px-4 py-2 text-sm font-semibold text-white">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/sign-in" className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-900/5 dark:text-white dark:hover:bg-white/10">
                Sign in
              </Link>
              <Link to="/sign-up" className="rounded-full bg-alaska-forest px-4 py-2 text-sm font-semibold text-white shadow-glacier">
                Join now
              </Link>
            </>
          )}
        </div>

        <button className="rounded-full border border-slate-200 p-2 lg:hidden dark:border-white/10" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/60 bg-white px-4 py-4 dark:border-white/10 dark:bg-alaska-night lg:hidden">
          <nav className="grid gap-2">
            {navigation.map((item) => (
              <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-900/5 dark:text-slate-100 dark:hover:bg-white/10">
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-4 flex items-center gap-3">
            <button onClick={toggleTheme} className="rounded-full border border-slate-200 p-2 dark:border-white/10">
              {theme === 'dark' ? <SunMedium className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
            </button>
            {user ? (
              <>
                <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} onClick={() => setOpen(false)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold dark:border-white/10">
                  Dashboard
                </Link>
                <button onClick={() => void signOut()} className="rounded-full bg-alaska-forest px-4 py-2 text-sm font-semibold text-white">
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/sign-in" onClick={() => setOpen(false)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold dark:border-white/10">
                  Sign in
                </Link>
                <Link to="/sign-up" onClick={() => setOpen(false)} className="rounded-full bg-alaska-forest px-4 py-2 text-sm font-semibold text-white">
                  Join now
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
