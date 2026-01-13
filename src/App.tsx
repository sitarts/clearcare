import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Layout } from './components/layout'
import { ToastProvider, ErrorBoundary, DashboardSkeleton } from './components/ui'
import { AuthProvider } from './contexts'
import { ProtectedRoute } from './components/auth'

// Lazy load pages for code splitting
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })))
const Patients = lazy(() => import('./pages/Patients').then(m => ({ default: m.Patients })))
const PatientDetail = lazy(() => import('./pages/PatientDetail').then(m => ({ default: m.PatientDetail })))
const NewPatient = lazy(() => import('./pages/NewPatient').then(m => ({ default: m.NewPatient })))
const EditPatient = lazy(() => import('./pages/EditPatient').then(m => ({ default: m.EditPatient })))
const Cycles = lazy(() => import('./pages/Cycles').then(m => ({ default: m.Cycles })))
const NewCycle = lazy(() => import('./pages/NewCycle').then(m => ({ default: m.NewCycle })))
const CycleDetail = lazy(() => import('./pages/CycleDetail').then(m => ({ default: m.CycleDetail })))
const Embryology = lazy(() => import('./pages/Embryology').then(m => ({ default: m.Embryology })))
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })))
const Signup = lazy(() => import('./pages/Signup').then(m => ({ default: m.Signup })))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword').then(m => ({ default: m.ForgotPassword })))
const ResetPassword = lazy(() => import('./pages/ResetPassword').then(m => ({ default: m.ResetPassword })))
const Settings = lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })))
const Calendar = lazy(() => import('./pages/Calendar').then(m => ({ default: m.Calendar })))
const Reports = lazy(() => import('./pages/Reports').then(m => ({ default: m.Reports })))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

// Page loading fallback
function PageLoader() {
  return (
    <div className="p-6">
      <DashboardSkeleton />
    </div>
  )
}

// Auth page loading fallback
function AuthLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-pulse w-full max-w-md h-96 bg-white rounded-xl shadow-lg" />
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <ErrorBoundary>
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route
                  path="/login"
                  element={
                    <Suspense fallback={<AuthLoader />}>
                      <Login />
                    </Suspense>
                  }
                />
                <Route
                  path="/signup"
                  element={
                    <Suspense fallback={<AuthLoader />}>
                      <Signup />
                    </Suspense>
                  }
                />
                <Route
                  path="/forgot-password"
                  element={
                    <Suspense fallback={<AuthLoader />}>
                      <ForgotPassword />
                    </Suspense>
                  }
                />
                <Route
                  path="/reset-password"
                  element={
                    <Suspense fallback={<AuthLoader />}>
                      <ResetPassword />
                    </Suspense>
                  }
                />

                {/* Protected routes */}
                <Route
                  path="/*"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Suspense fallback={<PageLoader />}>
                          <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/patients" element={<Patients />} />
                            <Route path="/patients/new" element={<NewPatient />} />
                            <Route path="/patients/:id" element={<PatientDetail />} />
                            <Route path="/patients/:id/edit" element={<EditPatient />} />
                            <Route path="/cycles" element={<Cycles />} />
                            <Route path="/cycles/new" element={<NewCycle />} />
                            <Route path="/cycles/:id" element={<CycleDetail />} />
                            <Route path="/calendar" element={<Calendar />} />
                            <Route path="/embryology" element={<Embryology />} />
                            <Route path="/reports" element={<Reports />} />
                            <Route path="/settings" element={<Settings />} />
                          </Routes>
                        </Suspense>
                      </Layout>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </BrowserRouter>
          </ErrorBoundary>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
