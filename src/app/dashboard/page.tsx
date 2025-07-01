"use client";

import { supabase } from "@/integrations/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Client } from "@/types";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ClientsTable } from "@/components/clients/ClientsTable";
import { AddClientModal } from "@/components/clients/AddClientModal";
import { EditClientModal } from "@/components/clients/EditClientModal";
import { DeleteClientAlert } from "@/components/clients/DeleteClientAlert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // CRUD state
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  useEffect(() => {
    const getUserAndClients = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
          router.push("/login");
          return;
        }
        
        setUser(user);
        await fetchClients();
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        router.push("/login");
      }
    };
    getUserAndClients();
  }, [router]);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar clientes:", error);
        setClients([]);
        return;
      }

      setClients(data || []);
    } catch (error) {
      console.error("Erro inesperado ao buscar clientes:", error);
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

  const handleEditClient = (client: Client) => {
    setClientToEdit(client);
    setIsEditModalOpen(true);
  };

  const handleDeleteClient = (client: Client) => {
    setClientToDelete(client);
    setIsDeleteAlertOpen(true);
  };

  // Filtrar clientes baseado na busca
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (client.email && client.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (client.phone && client.phone.includes(searchQuery))
  );

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🎉 BANNER DE SUCESSO */}
      <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm">
              ✅ <strong>NOVAS FUNCIONALIDADES ATIVAS!</strong> Dashboard atualizado com busca e estatísticas!
            </p>
          </div>
        </div>
      </div>

      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            🎯 Dashboard Atualizado - Meus Clientes
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:block">
              {user.email}
            </span>
            <Button onClick={handleSignOut} variant="outline">
              Sair
            </Button>
          </div>
        </div>
      </header>
      
      <main>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          
          {/* 📊 ESTATÍSTICAS SIMPLES */}
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <Card className="bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-800">Total de Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{clients.length}</div>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800">Com Email</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {clients.filter(c => c.email).length}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-purple-50">
              <CardHeader>
                <CardTitle className="text-purple-800">Com Telefone</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {clients.filter(c => c.phone).length}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* 🔍 BUSCA SIMPLES */}
          <div className="mb-4">
            <Input
              placeholder="🔍 Buscar clientes por nome, email ou telefone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>
          
          {/* 🔧 AÇÕES */}
          <div className="flex gap-2 mb-4">
            <AddClientModal onClientAdded={fetchClients} />
            <Button variant="outline">
              📤 Exportar ({filteredClients.length} clientes)
            </Button>
          </div>
          
          {/* 📋 TABELA */}
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <ClientsTable 
              clients={filteredClients} 
              onEdit={handleEditClient} 
              onDelete={handleDeleteClient} 
            />
          )}
          
          {/* 📊 RESULTADOS */}
          {searchQuery && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-yellow-800">
                🔍 Mostrando {filteredClients.length} de {clients.length} clientes
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Modais */}
      <EditClientModal 
        client={clientToEdit}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onClientUpdated={fetchClients}
      />

      <DeleteClientAlert
        client={clientToDelete}
        open={isDeleteAlertOpen}
        onOpenChange={setIsDeleteAlertOpen}
        onClientDeleted={fetchClients}
      />
    </div>
  );
}