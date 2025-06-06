// components/ProtectedRoute.tsx
import { useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return <div>Loading...</div>;

  return isSignedIn ? children : <Navigate to="/sign-in" />;
};
