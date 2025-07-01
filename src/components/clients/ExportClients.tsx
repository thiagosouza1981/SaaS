"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Client } from "@/types";
import { toast } from "sonner";

interface ExportClientsProps {
  clients: Client[];
}

export function ExportClients({ clients }: ExportClientsProps) {
  const exportToCSV = () => {
    if (clients.length === 0) {
      toast.error("Nenhum cliente para exportar");
      return;
    }

    const headers = ["Nome", "Email", "Telefone", "Data de Cadastro"];
    const csvContent = [
      headers.join(","),
      ...clients.map(client => [
        `"${client.name}"`,
        `"${client.email || ""}"`,
        `"${client.phone || ""}"`,
        `"${new Date(client.created_at).toLocaleDateString('pt-BR')}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `clientes_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Dados exportados com sucesso!");
  };

  return (
    <Button onClick={exportToCSV} variant="outline" size="sm">
      <Download className="mr-2 h-4 w-4" />
      Exportar CSV
    </Button>
  );
}