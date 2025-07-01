"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestConnectionPage() {
  const [connectionStatus, setConnectionStatus] = useState<string>("Testando...");
  const [userStatus, setUserStatus] = useState<string>("Verificando...");

  useEffect(() => {
    testConnection();
    checkUser();
  }, []);

  const testConnection = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);

      if (error) {
        setConnectionStatus(`Erro: ${error.message}`);
      } else {
        setConnectionStatus("✅ Conexão com Supabase funcionando!");
      }
    } catch (error) {
      setConnectionStatus(`❌ Erro de conexão: ${error}`);
    }
  };

  const checkUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        setUserStatus(`Erro ao verificar usuário: ${error.message}`);
      } else if (user) {
        setUserStatus(`✅ Usuário logado: ${user.email}`);
      } else {
        setUserStatus("❌ Nenhum usuário logado");
      }
    } catch (error) {
      setUserStatus(`❌ Erro: ${error}`);
    }
  };

  const testSignUp = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: 'test@example.com',
        password: 'test123456'
      });

      if (error) {
        alert(`Erro no signup: ${error.message}`);
      } else {
        alert('Signup funcionou! Verifique o console.');
        console.log('Signup data:', data);
      }
    } catch (error) {
      alert(`Erro: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Teste de Conexão Supabase</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Status da Conexão</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{connectionStatus}</p>
            <p className="mb-4">{userStatus}</p>
            <Button onClick={testConnection} className="mr-2">
              Testar Conexão
            </Button>
            <Button onClick={checkUser} className="mr-2">
              Verificar Usuário
            </Button>
            <Button onClick={testSignUp} variant="outline">
              Testar Signup
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações de Debug</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>URL:</strong> https://zblalosogbtxhhnxosaw.supabase.co</p>
            <p><strong>Anon Key:</strong> eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</p>
            <p><strong>Ambiente:</strong> {process.env.NODE_ENV}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}