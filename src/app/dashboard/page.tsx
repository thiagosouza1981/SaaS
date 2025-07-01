"use client";

import { supabase } from "@/integrations/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const getUserAndClients = async () => {
      try {
        console.log("1. Iniciando busca do usuário...");
        
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
          console.log("2. Erro ou usuário não encontrado, redirecionando...");
          router.push("/login");
          return;
        }
        
        console.log("3. Usuário encontrado:", user.email);
        setUser(user);
        
        console.log("4. Buscando clientes...");
        await fetchClients();
      } catch (error) {
        console.error("5. Erro geral:", error);
        setError(`Erro geral: ${error}`);
        router.push("/login");
      }
    };
    getUserAndClients();
  }, [router]);

  const fetchClients = async () => {
    setLoading(true);
    setError("");
    
    try {
      console.log("6. Fazendo query no Supabase...");
      
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false });

      console.log("7. Resposta do Supabase:", { data, error });

      if (error) {
        console.error("8. Erro do Supabase:", error);
        setError(`Erro do Supabase: ${error.message}`);
        setClients([]);
        return;
      }

      console.log("9. Tipo de data:", typeof data);
      console.log("10. É array?", Array.isArray(data));
      console.log("11. Data:", data);

      // Verificação ultra-segura
      if (data === null || data === undefined) {
        console.log("12. Data é null/undefined, usando array vazio");
        setClients([]);
      } else if (Array.isArray(data)) {
        console.log("13. Data é array, usando diretamente");
        setClients(data);
      } else {
        console.log("14. Data não é array, convertendo para array");
        setClients([]);
      }

    } catch (error) {
      console.error("15. Erro na função fetchClients:", error);
      setError(`Erro na função: ${error}`);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      router.push("/login");
    }
  };

  // Verificação ultra-segura dos clientes
  const safeClients = Array.isArray(clients) ? clients : [];
  console.log("16. Safe clients:", safeClients);
  console.log("17. Safe clients length:", safeClients.length);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Carregando usuário...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Dashboard Simplificado
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {user.email}
            </span>
            <Button onClick={handleSignOut} variant="outline">
              Sair
            </Button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Debug Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Debug Info</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Loading:</strong> {loading ? "Sim" : "Não"}</p>
            <p><strong>Error:</strong> {error || "Nenhum"}</p>
            <p><strong>Clients type:</strong> {typeof clients}</p>
            <p><strong>Is Array:</strong> {Array.isArray(clients) ? "Sim" : "Não"}</p>
            <p><strong>Clients length:</strong> {safeClients.length}</p>
            <p><strong>Raw clients:</strong> {JSON.stringify(clients)}</p>
          </CardContent>
        </Card>

        {/* Estatísticas Simples */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Estatísticas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{safeClients.length}</p>
            <p className="text-sm text-gray-600">Total de clientes</p>
          </CardContent>
        </Card>
        
        {/* Lista Simples */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Carregando clientes...</p>
            ) : error ? (
              <p className="text-red-600">Erro: {error}</p>
            ) : safeClients.length === 0 ? (
              <p>Nenhum cliente encontrado</p>
            ) : (
              <div className="space-y-2">
                {safeClients.map((client, index) => (
                  <div key={client?.id || index} className="p-2 border rounded">
                    <p><strong>Nome:</strong> {client?.name || "N/A"}</p>
                    <p><strong>Email:</strong> {client?.email || "N/A"}</p>
                    <p><strong>Telefone:</strong> {client?.phone || "N/A"}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}