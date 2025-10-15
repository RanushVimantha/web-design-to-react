import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setChecking(false);
        return;
      }

      // Add timeout for admin check
      const timeoutId = setTimeout(() => {
        console.error('Admin check timed out');
        setIsAdmin(false);
        setChecking(false);
      }, 5000);

      try {
        const { data, error } = await supabase.rpc('is_admin', { user_id: user.id });
        clearTimeout(timeoutId);
        
        if (error) {
          console.error('Admin check failed:', error);
          setIsAdmin(false);
          setChecking(false);
          return;
        }
        
        setIsAdmin(data === true);
        setChecking(false);
      } catch (err) {
        clearTimeout(timeoutId);
        console.error('Admin check exception:', err);
        setIsAdmin(false);
        setChecking(false);
      }
    };
    checkAdmin();
  }, [user]);

  if (loading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  
  return <>{children}</>;
};

export default AdminRoute;
