import { Routes, Route, Navigate } from 'react-router-dom';
import UploadPage from '../features/upload/UploadPage';
import DashboardPage from '../features/dashboard/Dashboard';
import ShipmentsPage from '../features/shipments/ShipmentsPage';
import ConsolidationsPage from '../features/consolidations/ConsolidationsPage';
import AppShell from '../components/AppShell';

export default function AppRouter() {
  return (
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/shipments" element={<ShipmentsPage />} />
          <Route path="/consolidations" element={<ConsolidationsPage />} />
          <Route path="/" element={<Navigate to="/upload" />} />
          <Route path="*" element={<Navigate to="/upload" />} />
        </Route>
      </Routes>
  );
}
