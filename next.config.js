/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração otimizada para Vercel
  output: 'standalone',
  
  // Desabilitar strict mode para compatibilidade
  reactStrictMode: false,
  
  // Configurações para melhor compatibilidade de deploy
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  
  // Configuração específica para resolver problemas de Git
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
  
  // Headers para resolver conflitos
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;