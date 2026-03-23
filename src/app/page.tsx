"use client";

import { useAuth } from "@/context/AuthContext";
import { useLoading } from "@/context/LoadingContext";
import Loading from "@/components/ui/Loading";

export default function Home() {
  const { user } = useAuth();
  const { showLoading, hideLoading, withLoading } = useLoading();

  const handleSimulateLoading = () => {
    showLoading();
    setTimeout(() => {
      hideLoading();
    }, 2000);
  };

  const handleAsyncOperation = async () => {
    await withLoading(async () => {
      await new Promise((resolve) => setTimeout(resolve, 3000));
    });
  };

  return (
    <div>
      {/* Loading Demo Section */}
      <section className="card mb-8">
        <h2 className="text-title mb-4">
          Loading Component Demo
        </h2>
        <div className="flex gap-4 items-center flex-wrap">
          <button
            onClick={handleSimulateLoading}
            className="btn-primary"
          >
            Show Global Loading (2s)
          </button>

          <button
            onClick={handleAsyncOperation}
            className="btn-primary !bg-purple-600 hover:!brightness-90 transition-colors"
          >
            Loading with Async Wrapper (3s)
          </button>
        </div>

        <div className="mt-4 flex gap-4 items-center">
          <span className="text-muted">Inline Loading:</span>
          <Loading size="sm" />
          <Loading size="md" />
          <Loading size="lg" />
        </div>
      </section>

      <header className="mb-8">
        <h1 className="text-2xl font-bold mb-2 text-[var(--text-dark)] transition-colors duration-300">
          Welcome back, {user ? user.name : "Guest"}
        </h1>
        <p className="text-muted">
          Here is what's happening with your projects today.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="card">
          <h3 className="text-sm font-semibold text-muted mb-2 uppercase tracking-wider">
            TOTAL REVENUE
          </h3>
          <div className="text-2xl font-bold text-[var(--text-dark)]">$14,200</div>
        </div>

        {/* Card 2 */}
        <div className="card">
          <h3 className="text-sm font-semibold text-muted mb-2 uppercase tracking-wider">
            ACTIVE PROJECTS
          </h3>
          <div className="text-2xl font-bold text-[var(--text-dark)]">24</div>
        </div>

        {/* Card 3 */}
        <div className="card">
          <h3 className="text-sm font-semibold text-muted mb-2 uppercase tracking-wider">
            NEW CLIENTS
          </h3>
          <div className="text-2xl font-bold text-[var(--text-dark)]">+12</div>
        </div>
      </div>
    </div>
  );
}
