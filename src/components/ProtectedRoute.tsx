// components/ProtectedRoute.tsx
import { JSX } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return <div>Loading...</div>;

  return isSignedIn ? children : <Navigate to="/sign-in" />;
};
