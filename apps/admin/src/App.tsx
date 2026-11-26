import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout, AuthLayout } from './components/layout';
import { Dashboard } from './pages/Dashboard';
import { Societies } from './pages/Societies';
import { Residents } from './pages/Residents';
import { Visitors } from './pages/Visitors';
import { Passes } from './pages/Passes';
import { Tickets } from './pages/Tickets';
import { Notices } from './pages/Notices';
import { Staff } from './pages/Staff';
import { Amenities } from './pages/Amenities';
import { Billing } from './pages/Billing';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/societies" element={<Societies />} />
        <Route path="/residents" element={<Residents />} />
        <Route path="/visitors" element={<Visitors />} />
        <Route path="/passes" element={<Passes />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/notices" element={<Notices />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/amenities" element={<Amenities />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}