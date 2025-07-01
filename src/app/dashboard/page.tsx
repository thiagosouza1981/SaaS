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
import { ClientsSearch } from "@/components/clients/ClientsSearch";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { ExportClients } from "@/components/clients/ExportClients";
import { Settings, User as UserIcon } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>('user');
  const [searchQuery, setSearchQuery] = useState("");
  
  // CRUD state
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  // Fetch user and clients
  useEffect(() => {
    const getUserAndClients = async () => {
      try {
        console.log("Buscando usuário...");
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
          console.log("Usuário não encontrado, redirecionando para login");
          router.push("/login");
          return;
        }
        
        console.log("Usuário encontrado:", user.email);
        setUser(user);

        // Buscar role do usuário
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
          
          setUserRole(profile?.role || 'user');
          console.log("Role do usuário:", profile?.role || 'user');
        } catch (roleError) {
          console.log("Erro ao buscar role, usando 'user' como padrão:", roleError);
          setUserRole('user');
        }

        await fetchClients();
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        router.push("/login");
      }
    };
    getUserAndClients();
  }, [router]);

  // Filter clients based on search
  useEffect(() => {
    if (!searchQuery) {
      setFilteredClients(clients);
    } else {
      const filtered = clients.filter(client =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (client.email && client.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (client.phone && client.phone.includes(searchQuery))
      );
      setFilteredClients(filtered);
    }
  }, [clients, searchQuery]);

  // Fetch clients with better error handling
  const fetchClients = async () => {
    setLoading(true);
    try {
      console.log("Buscando clientes...");
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false });

      console.log("Resposta do Supabase - data:", data);
      console.log("Resposta do Supabase - error:", error);

      if (error) {
        console.error("Erro ao buscar clientes:", error);
        setClients([]);
        return;
      }

      // Verificação robusta dos dados
      if (data === null || data === undefined) {
        console.log("Dados são null/undefined, definindo array vazio");
        setClients([]);
      } else if (Array.isArray(data)) {
        console.log("Dados são array válido com", data.length, "itens");
        setClients(data);
      } else {
        console.warn("Dados não são um array:", typeof data, data);
        setClients([]);
      }
    } catch (error) {
      console.error("Erro inesperado ao buscar clientes:", error);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      router.push("/login");
    }
  };

  // Edit client
  const handleEditClient = (client: Client) => {
    setClientToEdit(client);
    setIsEditModalOpen(true);
  };

  // Delete client
  const handleDeleteClient = (client: Client) => {
    setClientToDelete(client);
    setIsDeleteAlertOpen(true);
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Carregando...</p>
      </div>
    );
  }

  const isAdmin = userRole === 'admin';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {isAdmin ? "Painel Administrativo" : "Meus Clientes"}
            </h1>
            {isAdmin && (
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                Admin
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-300 hidden sm:block">
              {user.email}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push("/profile")}
            >
              <UserIcon className="h-4 w-4" />
            </Button>
            {isAdmin && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => router.push("/admin")}
              >
                <Settings className="h-4 w-4" />
              </Button>
            )}
            <Button
              onClick={handleSignOut}
              variant="outline"
            >
              Sair
            </Button>
          </div>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {isAdmin && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Modo Administrador
              </h2>
              <p className="text-blue-700 dark:text-blue-300">
                Você está visualizando todos os clientes do sistema. Como admin, você pode gerenciar qualquer cliente.
              </p>
            </div>
          )}
          
          {/* Estatísticas */}
          <StatsCards clients={clients} />
          
          {/* Ações e busca */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="flex gap-2">
              <AddClientModal onClientAdded={fetchClients} />
              <ExportClients clients={filteredClients} />
            </div>
          </div>
          
          {/* Busca */}
          <ClientsSearch onSearch={handleSearch} searchQuery={searchQuery} />
          
          {/* Tabela */}
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
          
          {/* Resultados da busca */}
          {searchQuery && (
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
              Mostrando {filteredClients.length} de {clients.length} clientes
            </div>
          )}
        </div>
      </main>

      {/* Modais e alertas */}
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