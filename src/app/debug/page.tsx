"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DebugPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [clients, setClients] = useState<any>(null);

  const addLog = (message: string) => {
    console.log(message);
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testSupabase = async () => {
    setLogs([]);
    addLog("Iniciando teste do Supabase...");

    try {
      addLog("1. Testando conexão...");
      const { data: testData, error: testError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);

      if (testError) {
        addLog(`Erro na conexão: ${testError.message}`);
        return;
      }

      addLog("2. Conexão OK, testando busca de clientes...");
      
      const { data, error } = await supabase
        .from("clients")
        .select("*");

      addLog(`3. Resposta recebida - Error: ${error ? error.message : "null"}`);
      addLog(`4. Data type: ${typeof data}`);
      addLog(`5. Data is array: ${Array.isArray(data)}`);
      addLog(`6. Data: ${JSON.stringify(data)}`);

      setClients(data);

      if (data && Array.isArray(data)) {
        addLog(`7. Testando filter em ${data.length} items...`);
        try {
          const filtered = data.filter(item => item !== null);
          addLog(`8. Filter funcionou! Resultado: ${filtered.length} items`);
        } catch (filterError) {
          addLog(`9. ERRO NO FILTER: ${filterError}`);
        }
      }

    } catch (error) {
      addLog(`Erro geral: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Debug Supabase</h1>
        
        <Button onClick={testSupabase}>
          Testar Supabase
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {logs.map((log, index) => (
                <p key={index} className="text-sm font-mono">{log}</p>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dados Brutos</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(clients, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}