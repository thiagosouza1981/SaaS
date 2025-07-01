"use client";

export default function TesteSyncPage() {
  return (
    <div className="min-h-screen bg-red-500 flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4">
          🔥 TESTE DE SINCRONIZAÇÃO 🔥
        </h1>
        <p className="text-2xl mb-4">
          Se você vê esta tela VERMELHA, estamos sincronizados!
        </p>
        <p className="text-lg">
          Acesse: /teste-sync
        </p>
        <div className="mt-8 p-4 bg-white text-red-500 rounded">
          <p className="font-bold">
            ✅ MUDANÇAS APLICADAS COM SUCESSO!
          </p>
        </div>
      </div>
    </div>
  );
}