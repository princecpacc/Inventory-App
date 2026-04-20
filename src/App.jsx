import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/common/ProtectedRoute'
import Layout from './components/ui/Layout'
import { AuthProvider } from './context/AuthContext'
import { InventoryProvider } from './context/InventoryContext'

const InventoryList = lazy(() => import('./features/inventory/InventoryList'))
const HomePage = lazy(() => import('./pages/HomePage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const AuthPage = lazy(() => import('./pages/AuthPage'))
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'))

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense
          fallback={
            <div className="p-6 text-sm text-slate-600 md:p-10">
              Loading page...
            </div>
          }
        >
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route element={<ProtectedRoute />}>
              <Route
                element={
                  <InventoryProvider>
                    <Layout />
                  </InventoryProvider>
                }
              >
                <Route path="/" element={<HomePage />} />
                <Route path="/inventory" element={<InventoryList />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
