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
import { StatsCards } from "@/components/dashboard/StatsCards";
import { ClientsSearch } from "@/components/clients/ClientsSearch";
import { ExportClients } from "@/components/clients/ExportClients";

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

      console.log("Supabase response:", { data, error });

      if (error) {
        console.error("Erro ao buscar clientes:", error);
        setClients([]);
        return;
      }

      // Garantir que data é sempre um array válido
      if (!data) {
        console.log("Data is null, setting empty array");
        setClients([]);
        return;
      }

      if (!Array.isArray(data)) {
        console.log("Data is not array, setting empty array");
        setClients([]);
        return;
      }

      console.log("Setting clients:", data);
      setClients(data);
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

  const handleSearch = (query: string) => {
    setSearchQuery(query || "");
  };

  // Garantir que clients é sempre um array antes de qualquer operação
  const safeClients = Array.isArray(clients) ? clients : [];
  console.log("Safe clients:", safeClients);
  
  // Filtrar clientes baseado na busca com verificações extras
  let filteredClients: Client[] = [];
  try {
    if (searchQuery && searchQuery.trim() !== "") {
      filteredClients = safeClients.filter(client => {
        if (!client || typeof client !== 'object') return false;
        
        const name = String(client.name || '').toLowerCase();
        const email = String(client.email || '').toLowerCase();
        const phone = String(client.phone || '');
        const query = String(searchQuery || '').toLowerCase();
        
        return name.includes(query) ||
               email.includes(query) ||
               phone.includes(query);
      });
    } else {
      filteredClients = safeClients;
    }
  } catch (error) {
    console.error("Erro ao filtrar clientes:", error);
    filteredClients = safeClients;
  }

  console.log("Filtered clients:", filteredClients);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Meus Clientes
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-300 hidden sm:block">
              {user.email}
            </span>
            <Button onClick={handleSignOut} variant="outline">
              Sair
            </Button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Estatísticas */}
        <StatsCards clients={safeClients} />
        
        {/* Busca e Ações */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <ClientsSearch onSearch={handleSearch} searchQuery={searchQuery} />
          </div>
          <div className="flex gap-2">
            <AddClientModal onClientAdded={fetchClients} />
            <ExportClients clients={filteredClients} />
          </div>
        </div>
        
        {/* Tabela de Clientes */}
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
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
            <p className="text-blue-700 dark:text-blue-300">
              Mostrando {filteredClients.length} de {safeClients.length} clientes
            </p>
          </div>
        )}
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