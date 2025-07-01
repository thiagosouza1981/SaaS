"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, UserPlus, Crown } from "lucide-react";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>('user');
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [isPromoting, setIsPromoting] = useState(false);
  const [canSelfPromote, setCanSelfPromote] = useState(false);

  useEffect(() => {
    const checkUserAndRole = async () => {
      try {
        // Verificar se usuário está logado
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          router.push("/login");
          return;
        }
        
        setUser(user);

        // Verificar role do usuário
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        const currentRole = profile?.role || 'user';
        setUserRole(currentRole);

        // Verificar se existe algum admin no sistema
        const { data: adminCount } = await supabase
          .from('profiles')
          .select('id')
          .eq('role', 'admin');

        // Se não há admins, permitir auto-promoção
        setCanSelfPromote(!adminCount || adminCount.length === 0);

      } catch (error) {
        console.error("Erro ao verificar usuário:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkUserAndRole();
  }, [router]);

  const promoteToAdmin = async () => {
    if (!email) {
      toast.error("Por favor, insira um email");
      return;
    }

    setIsPromoting(true);
    try {
      const { data, error } = await supabase.rpc('promote_user_to_admin', {
        user_email: email
      });

      if (error) {
        throw error;
      }

      toast.success(data || "Usuário promovido para admin com sucesso!");
      setEmail("");
      
      // Se promoveu a si mesmo, atualizar o role local
      if (email === user?.email) {
        setUserRole('admin');
        setCanSelfPromote(false);
      }
    } catch (error) {
      console.error("Erro ao promover usuário:", error);
      toast.error("Erro ao promover usuário. Verifique se o email está correto.");
    } finally {
      setIsPromoting(false);
    }
  };

  const selfPromote = async () => {
    if (!user) return;
    
    setIsPromoting(true);
    try {
      const { data, error } = await supabase.rpc('promote_user_to_admin', {
        user_email: user.email
      });

      if (error) {
        throw error;
      }

      toast.success("Você foi promovido para admin com sucesso!");
      setUserRole('admin');
      setCanSelfPromote(false);
    } catch (error) {
      console.error("Erro ao se promover:", error);
      toast.error("Erro ao se promover para admin.");
    } finally {
      setIsPromoting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Não Logado</CardTitle>
            <CardDescription>
              Você precisa fazer login para acessar esta página.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/login")} className="w-full">
              Ir para Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (userRole !== 'admin' && !canSelfPromote) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Acesso Negado</CardTitle>
            <CardDescription>
              Você não tem permissão para acessar esta página.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Usuário atual: {user.email}<br/>
              Role atual: {userRole}
            </p>
            <Button onClick={() => router.push("/dashboard")} className="w-full">
              Voltar ao Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-red-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Painel de Administração
            </h1>
            {userRole === 'admin' && (
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                Admin
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6">
          {canSelfPromote && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-800">
                  <Crown className="h-5 w-5" />
                  Primeiro Admin
                </CardTitle>
                <CardDescription className="text-yellow-700">
                  Não há administradores no sistema. Você pode se promover para admin.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-yellow-700 mb-4">
                  Usuário: {user.email}
                </p>
                <Button 
                  onClick={selfPromote}
                  disabled={isPromoting}
                  className="w-full bg-yellow-600 hover:bg-yellow-700"
                >
                  {isPromoting ? "Promovendo..." : "Tornar-se Admin"}
                </Button>
              </CardContent>
            </Card>
          )}

          {userRole === 'admin' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Promover Usuário para Admin
                </CardTitle>
                <CardDescription>
                  Digite o email de um usuário existente para promovê-lo a administrador.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email do usuário</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="usuario@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={promoteToAdmin}
                  disabled={isPromoting || !email}
                  className="w-full"
                >
                  {isPromoting ? "Promovendo..." : "Promover para Admin"}
                </Button>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Informações do Sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Usuário atual:</strong> {user.email}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Role atual:</strong> {userRole}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Pode auto-promover:</strong> {canSelfPromote ? 'Sim' : 'Não'}
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}