import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-nova-sand">
      <h1 className="text-3xl font-display text-nova-earth mb-2">
        NovaLearning
      </h1>
      <p className="text-sm text-nova-earth/70 mb-8 text-center">
        Learn together, grow together
      </p>

      <div className="w-full max-w-sm space-y-4">
        <Link
          href="/games/count-to-five"
          className="flex items-center gap-4 p-4 rounded-2xl bg-nova-sun/20 hover:bg-nova-sun/30 transition-colors"
        >
          <span className="text-3xl" aria-hidden="true">🥭</span>
          <div>
            <p className="font-display text-lg text-nova-earth">
              Count to 5 with Sipho
            </p>
            <p className="text-xs text-nova-earth/60">Numeracy</p>
          </div>
        </Link>
      </div>

      {/* Parent portal link */}
      <div className="mt-8">
        <Link
          href="/parent/dashboard"
          className="text-sm text-nova-earth/50 hover:text-nova-earth/70 transition-colors"
        >
          Parent Portal
        </Link>
      </div>
    </main>
  );
}
