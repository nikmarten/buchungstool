import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  
  if (!isAdmin) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

export default ProtectedRoute; 