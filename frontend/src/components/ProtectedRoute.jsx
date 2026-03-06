import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  if (!userInfo) {
    return <Navigate to="/login" />;
  }

  if (role && userInfo.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
