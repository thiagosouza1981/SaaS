"use client";

import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface DeleteClientAlertProps {
  client: Client | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClientDeleted: () => void;
}

export function DeleteClientAlert({
  client,
  open,
  onOpenChange,
  onClientDeleted,
}: DeleteClientAlertProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!client) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("clients")
        .delete()
        .eq("id", client.id);

      if (error) {
        throw error;
      }

      toast.success("Cliente excluído com sucesso!");
      onOpenChange(false);
      onClientDeleted();
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
      toast.error("Erro ao excluir cliente. Tente novamente.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Cliente</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o cliente {client?.name}? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Excluindo..." : "Excluir"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}