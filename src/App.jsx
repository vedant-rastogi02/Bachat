import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { LanguageProvider } from './context/LanguageContext'
import AppLayout from './layouts/AppLayout'
import ChatPage from './pages/ChatPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import SavingsGamePage from './pages/SavingsGamePage'
import SchemesPage from './pages/SchemesPage'
import SignupPage from './pages/SignupPage'

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="signup" element={<SignupPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="schemes" element={<SchemesPage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="savings-game" element={<SavingsGamePage />} />
            <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App
