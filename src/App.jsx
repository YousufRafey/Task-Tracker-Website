import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Layout from './components/Layout';
import { Loader2 } from 'lucide-react';

import AdminDashboard from './pages/AdminDashboard';
// Placeholders for remaining dashboards
import ManagerDashboard from './pages/ManagerDashboard';
import CreateTask from './pages/CreateTask';
import EmployeeDashboard from './pages/EmployeeDashboard';
import Messages from './pages/Messages';
import CalendarView from './pages/CalendarView';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect based on role if unauthorized
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'manager') return <Navigate to="/manager" replace />;
    return <Navigate to="/employee" replace />;
  }

  return <Outlet />;
};

import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <DataProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Redirect root to login */}
              <Route path="/" element={<Navigate to="/login" replace />} />

              {/* Protected Routes */}
              <Route element={<Layout />}>
                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={['manager', 'admin']} />}>
                  <Route path="/manager/create-task" element={<CreateTask />} />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={['manager', 'admin']} />}>
                  <Route path="/manager" element={<ManagerDashboard />} />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={['employee']} />}>
                  <Route path="/employee" element={<EmployeeDashboard />} />
                </Route>

                {/* Common Protected Routes */}
                <Route element={<ProtectedRoute allowedRoles={['admin', 'manager', 'employee']} />}>
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/calendar" element={<CalendarView />} />
                </Route>
              </Route>

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </DataProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
