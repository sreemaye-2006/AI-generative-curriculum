import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CurriculumPage from './pages/CurriculumPage';
import AdminPage from './pages/AdminPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import ResumeBuilderPage from './pages/ResumeBuilderPage';
import SettingsPage from './pages/SettingsPage';
import Chatbot from './components/Chatbot';

function App() {
  return (
    <Router>
      <div className="flex bg-slate-900 h-screen overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 bg-slate-900">
          <div className="max-w-6xl mx-auto pb-20">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/setup-profile" element={<ProfileSetupPage />} />
            <Route path="/curriculum" element={<CurriculumPage />} />
            <Route path="/resume" element={<ResumeBuilderPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
          </div>
        </main>
        <Chatbot />
      </div>
    </Router>
  );
}

export default App;
