"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, Calendar, TrendingUp } from "lucide-react";
import { Client } from "@/types";

interface StatsCardsProps {
  clients: Client[];
}

export function StatsCards({ clients }: StatsCardsProps) {
  const totalClients = clients.length;
  const clientsWithEmail = clients.filter(client => client.email).length;
  const clientsWithPhone = clients.filter(client => client.phone).length;
  
  // Clientes adicionados nos últimos 7 dias
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  const recentClients = clients.filter(client => 
    new Date(client.created_at) > lastWeek
  ).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalClients}</div>
          <p className="text-xs text-muted-foreground">
            Clientes cadastrados
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Novos (7 dias)</CardTitle>
          <UserPlus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{recentClients}</div>
          <p className="text-xs text-muted-foreground">
            Adicionados recentemente
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Com Email</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{clientsWithEmail}</div>
          <p className="text-xs text-muted-foreground">
            {totalClients > 0 ? Math.round((clientsWithEmail / totalClients) * 100) : 0}% do total
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Com Telefone</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{clientsWithPhone}</div>
          <p className="text-xs text-muted-foreground">
            {totalClients > 0 ? Math.round((clientsWithPhone / totalClients) * 100) : 0}% do total
          </p>
        </CardContent>
      </Card>
    </div>
  );
}