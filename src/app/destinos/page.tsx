export default function DestinosPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sky-100 to-cyan-200 px-4 py-8">
      <div className="max-w-lg w-full bg-white/90 rounded-2xl shadow-xl p-8 flex flex-col items-center gap-6">
        <h1 className="text-3xl font-extrabold text-cyan-800 text-center mb-2">Destinos recientes <span className='text-yellow-500'>★</span></h1>
        <p className="text-lg text-cyan-700 text-center mb-2">
          Esta sección es exclusiva para usuarios <b>premium</b>.<br/>
          Aquí podrás:
        </p>
        <ul className="text-cyan-700 text-base list-disc list-inside mb-4">
          <li>Ver los destinos más buscados por la comunidad</li>
          <li>Acceder a recomendaciones avanzadas y personalizadas</li>
          <li>Guardar tus rutas favoritas</li>
          <li>Recibir alertas de ofertas y novedades</li>
        </ul>
        <div className="mt-2 text-cyan-400 text-sm">Próximamente más características premium...</div>
        <button className="mt-6 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg text-lg hover:scale-105 transition-transform">
          Hazte Premium
        </button>
        <div className="text-xs text-cyan-400 mt-2">¿Ya eres premium? <a href="#" className="underline text-cyan-700">Inicia sesión</a></div>
      </div>
    </main>
  );
} 