
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AdminRoute } from './components/auth/AdminRoute'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { Layout } from './components/layout/Layout'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeContextProvider } from './contexts/ThemeContext'
import { About } from './pages/About'
import { Activities } from './pages/Activities'
import { Contact } from './pages/Contact'
import { Directory } from './pages/Directory'
import { Events } from './pages/Events'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { KenaiAccount } from './pages/auth/KenaiAccount'
import { KenaiSignIn } from './pages/auth/KenaiSignIn'
import { KenaiSignUp } from './pages/auth/KenaiSignUp'
import { Advertising } from './pages/dashboard/Advertising'
import { Analytics } from './pages/dashboard/Analytics'
import { BusinessDashboard } from './pages/dashboard/BusinessDashboard'
import { Inquiries } from './pages/dashboard/Inquiries'
import { ManageBusiness } from './pages/dashboard/ManageBusiness'
import { TripPlanner } from './pages/TripPlanner'

function App() {
  return (
    <ThemeContextProvider>
      <AuthProvider>
        <ErrorBoundary>
          <BrowserRouter basename={import.meta.env.BASE_URL}>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/directory" element={<Directory />} />
                <Route path="/activities" element={<Activities />} />
                <Route path="/events" element={<Events />} />
                <Route path="/trip-planner" element={<TripPlanner />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/sign-in" element={<KenaiSignIn />} />
                <Route path="/signin" element={<KenaiSignIn />} />
                <Route path="/login" element={<KenaiSignIn />} />
                <Route path="/sign-up" element={<KenaiSignUp />} />
                <Route path="/signup" element={<KenaiSignUp />} />
                <Route path="/account" element={<ProtectedRoute><KenaiAccount /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['business_owner', 'admin']}><BusinessDashboard /></ProtectedRoute>} />
                <Route path="/dashboard/manage-business" element={<ProtectedRoute allowedRoles={['business_owner', 'admin']}><ManageBusiness /></ProtectedRoute>} />
                <Route path="/dashboard/advertising" element={<ProtectedRoute allowedRoles={['business_owner', 'admin']}><Advertising /></ProtectedRoute>} />
                <Route path="/dashboard/analytics" element={<ProtectedRoute allowedRoles={['business_owner', 'admin']}><Analytics /></ProtectedRoute>} />
                <Route path="/dashboard/inquiries" element={<ProtectedRoute allowedRoles={['business_owner', 'admin']}><Inquiries /></ProtectedRoute>} />
                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ErrorBoundary>
      </AuthProvider>
    </ThemeContextProvider>
  )
}

export default App
