"use client";

import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useUserRole } from "@/hooks/use-user-role";

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
import { Shield, UserPlus } from "lucide-react";

export default function AdminPage() {
  const { isAdmin, loading } = useUserRole();
  const [email, setEmail] = useState("");
  const [isPromoting, setIsPromoting] = useState(false);

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
    } catch (error) {
      console.error("Erro ao promover usuário:", error);
      toast.error("Erro ao promover usuário. Verifique se o email está correto.");
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

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Acesso Negado</CardTitle>
            <CardDescription>
              Você não tem permissão para acessar esta página.
            </CardDescription>
          </CardHeader>
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
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6">
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

          <Card>
            <CardHeader>
              <CardTitle>Instruções</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                1. O usuário deve primeiro criar uma conta normal no sistema
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                2. Digite o email exato da conta criada
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                3. Clique em "Promover para Admin"
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                4. O usuário terá acesso administrativo na próxima vez que fizer login
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}