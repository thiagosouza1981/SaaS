import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { UserRole } from '@/types';

export function useUserRole() {
  const [userRole, setUserRole] = useState<UserRole>('user');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setUserRole('user');
          setLoading(false);
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.log('Erro ao buscar profile, usando role padrão:', error);
          setUserRole('user');
        } else {
          setUserRole(profile?.role || 'user');
        }
      } catch (error) {
        console.error('Erro ao buscar role do usuário:', error);
        setUserRole('user');
      } finally {
        setLoading(false);
      }
    };

    getUserRole();
  }, []);

  return { userRole, loading, isAdmin: userRole === 'admin' };
}