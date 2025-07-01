"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Users, Lock, Zap, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function VendaPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulação de login - na prática, redirecionamos para a página de login real
    setTimeout(() => {
      router.push("/login");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header/Navbar */}
      <header className="bg-white dark:bg-gray-950 border-b">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <span className="font-bold text-xl text-gray-900 dark:text-white">ClienteManager</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
              Login
            </Link>
            <Button size="sm">Iniciar Gratuitamente</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Gerencie seus clientes com simplicidade e segurança
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Cadastre, organize e acompanhe seus clientes em um único lugar. Economize tempo e aumente sua produtividade.
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
                <p className="text-gray-700 dark:text-gray-300">Acesso seguro por usuário e senha</p>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
                <p className="text-gray-700 dark:text-gray-300">Cadastro completo com nome, email e telefone</p>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
                <p className="text-gray-700 dark:text-gray-300">Gerenciamento fácil e intuitivo</p>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
                <p className="text-gray-700 dark:text-gray-300">Interface responsiva para qualquer dispositivo</p>
              </div>
            </div>
            <div className="mt-8">
              <Button size="lg" className="mr-4">
                Começar Agora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg">
                Ver Demonstração
              </Button>
            </div>
          </div>
          
          <div>
            <Card className="w-full max-w-md mx-auto">
              <CardHeader>
                <CardTitle>Acesse sua conta</CardTitle>
                <CardDescription>
                  Entre com suas credenciais para acessar o sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="seu@email.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <Input 
                        id="password" 
                        type="password" 
                        placeholder="********" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Entrando..." : "Entrar"}
                    </Button>
                  </div>
                </form>
                
                <div className="mt-4 text-center text-sm">
                  <Link href="/login" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                    Esqueceu sua senha?
                  </Link>
                </div>
                
                <Separator className="my-4" />
                
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Ainda não tem uma conta?
                  </p>
                  <Link href="/login" passHref>
                    <Button variant="outline" className="w-full">
                      Criar Conta Grátis
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Tudo o que você precisa para gerenciar seus clientes
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Nosso sistema oferece todas as ferramentas necessárias para um gerenciamento eficiente de clientes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
                <CardTitle>Cadastro Completo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Armazene todas as informações importantes de seus clientes em um só lugar, com campos personalizados.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Lock className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
                <CardTitle>Segurança Total</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Seus dados são protegidos por criptografia e cada usuário tem acesso apenas aos seus próprios clientes.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Zap className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
                <CardTitle>Interface Intuitiva</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Design moderno e responsivo, permitindo acesso de qualquer dispositivo, a qualquer momento.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-blue-600 dark:bg-blue-700 rounded-xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para começar?
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Crie sua conta agora e comece a gerenciar seus clientes de forma eficiente e organizada.
          </p>
          <Button size="lg" variant="secondary" className="mr-4">
            Criar Conta Gratuita
          </Button>
          <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600">
            Saiba Mais
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">ClienteManager</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Simplifique o gerenciamento de seus clientes com nossa plataforma intuitiva e segura.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                Recursos
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                    Cadastro de Clientes
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                    Segurança
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                    Suporte
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                Empresa
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                    Sobre Nós
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                    Contato
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                    Política de Privacidade
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 text-center">
              &copy; {new Date().getFullYear()} ClienteManager. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}