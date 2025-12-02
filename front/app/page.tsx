import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600">
      <div className="text-center text-white p-8">
        <h1 className="text-6xl font-bold mb-4">🎵 DJ Marcel</h1>
        <p className="text-2xl mb-12">Gestion de soirées et playlists</p>
        
        <div className="flex gap-6 justify-center">
          <Link
            href="/reserver"
            className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition shadow-lg"
          >
            Réserver une soirée
          </Link>
          
          <Link
            href="/dj"
            className="bg-purple-800 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-purple-900 transition shadow-lg border-2 border-white"
          >
            Espace DJ
          </Link>
        </div>

        <div className="mt-12 text-sm opacity-80">
          <p>Architecture microservices avec event-driven :</p>
          <p>Consul • RabbitMQ • Service Clients • Service Playlists • Service Soirées</p>
          <p className="mt-2">🎵 Génération automatique de playlists via API externe</p>
        </div>
      </div>
    </div>
  );
}
