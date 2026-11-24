import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './pages/Dashboard';
import { Societies } from './pages/Societies';
import { Residents } from './pages/Residents';
import { Visitors } from './pages/Visitors';
import { Tickets } from './pages/Tickets';
import { Notices } from './pages/Notices';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';

function Layout() {
  return (
    <div className="min-h-screen bg-paper">
      <Sidebar />
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/societies" element={<Societies />} />
        <Route path="/residents" element={<Residents />} />
        <Route path="/visitors" element={<Visitors />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/notices" element={<Notices />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}