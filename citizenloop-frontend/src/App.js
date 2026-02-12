import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ComplaintForm from './pages/ComplaintForm';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import PublicMap from './pages/PublicMap';
import Navbar from './components/Navbar';

// admin route protection
const AdminRoute = ({ children }) => {
  return localStorage.getItem('role') === 'ADMIN' ? children : <Navigate to="/" />;
};

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div style={{ padding: 12 }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/complaint-form" element={<ComplaintForm />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/public-map" element={<PublicMap />} />

          <Route
            path="/admin-dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
