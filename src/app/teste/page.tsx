"use client";

export default function TestePage() {
  return (
    <div className="min-h-screen bg-green-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-800 mb-4">
          ✅ MUDANÇAS APLICADAS!
        </h1>
        <p className="text-green-600">
          Se você está vendo esta página, as mudanças foram aplicadas com sucesso.
        </p>
        <p className="text-sm text-gray-600 mt-4">
          Acesse: /dashboard para ver as novas funcionalidades
        </p>
      </div>
    </div>
  );
}