import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import PostPage from './pages/PostPage.jsx'
import CreatePostPage from './pages/CreatePostPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import { researchPostIds } from './data/researchPosts.js'

export default function App() {
  const defaultPostId = researchPostIds[0] ?? '1'

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
          <Route path="/criar-post" element={<CreatePostPage />} />
          <Route path="/post" element={<Navigate to={`/post/${defaultPostId}`} replace />} />
          <Route path="/post/:postId" element={<PostPage />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
