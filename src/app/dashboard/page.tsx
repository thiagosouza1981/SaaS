"use client";

import { createClient } from "@/integrations/supabase/client";
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

export default function DashboardPage() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  
  // CRUD state
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  // Fetch user and clients
  useEffect(() => {
    const getUserAndClients = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        router.push("/login");
        return;
      }
      setUser(user);

      fetchClients();
    };
    getUserAndClients();
  }, [supabase, router]);

  // Fetch clients
  const fetchClients = async () => {
    setLoading(true);
    const { data: clientsData, error: clientsError } = await supabase
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false });

    if (clientsError) {
      console.error("Erro ao buscar clientes:", clientsError);
    } else {
      setClients(clientsData || []);
    }
    setLoading(false);
  };

  // Handle sign out
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
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
            <span className="text-sm text-gray-600 dark:text-gray-300 hidden sm:block">{user.email}</span>
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
          <div className="flex justify-end mb-4">
            <AddClientModal onClientAdded={fetchClients} />
          </div>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <ClientsTable 
              clients={clients} 
              onEdit={handleEditClient} 
              onDelete={handleDeleteClient} 
            />
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