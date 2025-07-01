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
    // Garantir que clients é sempre um array
    const safeClients = Array.isArray(clients) ? clients : [];
    
    if (safeClients.length === 0) {
      toast.error("Nenhum cliente para exportar");
      return;
    }

    try {
      const headers = ["Nome", "Email", "Telefone", "Data de Cadastro"];
      const csvContent = [
        headers.join(","),
        ...safeClients.map(client => {
          if (!client) return '';
          
          const name = (client.name || '').replace(/"/g, '""');
          const email = (client.email || '').replace(/"/g, '""');
          const phone = (client.phone || '').replace(/"/g, '""');
          
          let date = '';
          try {
            date = client.created_at ? new Date(client.created_at).toLocaleDateString('pt-BR') : '';
          } catch {
            date = '';
          }
          
          return [
            `"${name}"`,
            `"${email}"`,
            `"${phone}"`,
            `"${date}"`
          ].join(",");
        }).filter(row => row !== '')
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
    } catch (error) {
      console.error("Erro ao exportar:", error);
      toast.error("Erro ao exportar dados");
    }
  };

  // Garantir que clients é sempre um array para mostrar o count
  const safeClients = Array.isArray(clients) ? clients : [];

  return (
    <Button onClick={exportToCSV} variant="outline" size="sm">
      <Download className="mr-2 h-4 w-4" />
      Exportar CSV ({safeClients.length})
    </Button>
  );
}