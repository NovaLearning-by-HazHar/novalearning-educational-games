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

        <Link
          href="/games/trace-letter-a"
          className="flex items-center gap-4 p-4 rounded-2xl bg-blue-100 hover:bg-blue-200 transition-colors"
        >
          <span className="text-3xl" aria-hidden="true">✏️</span>
          <div>
            <p className="font-display text-lg text-nova-earth">
              Trace Letter A with Gogo Thandi
            </p>
            <p className="text-xs text-nova-earth/60">Language</p>
          </div>
        </Link>

        <Link
          href="/games/money-mastery"
          className="flex items-center gap-4 p-4 rounded-2xl bg-amber-100 hover:bg-amber-200 transition-colors"
        >
          <span className="text-3xl" aria-hidden="true">🪙</span>
          <div>
            <p className="font-display text-lg text-nova-earth">
              Money Mastery with Jabu
            </p>
            <p className="text-xs text-nova-earth/60">Financial Literacy</p>
          </div>
        </Link>

        <Link
          href="/games/counting-animals"
          className="flex items-center gap-4 p-4 rounded-2xl bg-green-100 hover:bg-green-200 transition-colors"
        >
          <span className="text-3xl" aria-hidden="true">🐘</span>
          <div>
            <p className="font-display text-lg text-nova-earth">
              Counting Animals
            </p>
            <p className="text-xs text-nova-earth/60">Numeracy</p>
          </div>
        </Link>

        <Link
          href="/games/letter-explorer"
          className="flex items-center gap-4 p-4 rounded-2xl bg-purple-100 hover:bg-purple-200 transition-colors"
        >
          <span className="text-3xl" aria-hidden="true">🔤</span>
          <div>
            <p className="font-display text-lg text-nova-earth">
              Letter Explorer
            </p>
            <p className="text-xs text-nova-earth/60">Language</p>
          </div>
        </Link>

        <Link
          href="/games/bontse"
          className="flex items-center gap-4 p-4 rounded-2xl bg-orange-100 hover:bg-orange-200 transition-colors"
        >
          <span className="text-3xl" aria-hidden="true">🦁</span>
          <div>
            <p className="font-display text-lg text-nova-earth">
              Bontse — Discover with Sipho
            </p>
            <p className="text-xs text-nova-earth/60">Life Sciences</p>
          </div>
        </Link>

        <Link
          href="/games/mzansi-journey"
          className="flex items-center gap-4 p-4 rounded-2xl bg-teal-100 hover:bg-teal-200 transition-colors"
        >
          <span className="text-3xl" aria-hidden="true">🗺️</span>
          <div>
            <p className="font-display text-lg text-nova-earth">
              Mzansi Journey with Liya
            </p>
            <p className="text-xs text-nova-earth/60">Geography</p>
          </div>
        </Link>

        <Link
          href="/games/ubuntu-stories"
          className="flex items-center gap-4 p-4 rounded-2xl bg-indigo-100 hover:bg-indigo-200 transition-colors"
        >
          <span className="text-3xl" aria-hidden="true">📖</span>
          <div>
            <p className="font-display text-lg text-nova-earth">
              Ubuntu Stories with Gogo Thandi
            </p>
            <p className="text-xs text-nova-earth/60">Literacy & Life Skills</p>
          </div>
        </Link>

        <Link
          href="/games/ubuntu-garden"
          className="flex items-center gap-4 p-4 rounded-2xl bg-lime-100 hover:bg-lime-200 transition-colors"
        >
          <span className="text-3xl" aria-hidden="true">🌱</span>
          <div>
            <p className="font-display text-lg text-nova-earth">
              Ubuntu Garden with Jabu
            </p>
            <p className="text-xs text-nova-earth/60">Creative Arts</p>
          </div>
        </Link>

        <Link
          href="/games/thina-trivia"
          className="flex items-center gap-4 p-4 rounded-2xl bg-rose-100 hover:bg-rose-200 transition-colors"
        >
          <span className="text-3xl" aria-hidden="true">🌟</span>
          <div>
            <p className="font-display text-lg text-nova-earth">
              Thina Trivia with Amahle
            </p>
            <p className="text-xs text-nova-earth/60">Quiz — All Subjects</p>
          </div>
        </Link>

        <Link
          href="/games/my-ubuntu-stars"
          className="flex items-center gap-4 p-4 rounded-2xl bg-yellow-100 hover:bg-yellow-200 transition-colors"
        >
          <span className="text-3xl" aria-hidden="true">⭐</span>
          <div>
            <p className="font-display text-lg text-nova-earth">
              My Ubuntu Stars
            </p>
            <p className="text-xs text-nova-earth/60">Achievements</p>
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
