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
      <section className="mb-8 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-lg font-bold mb-4 text-gray-800">
          Loading Component Demo
        </h2>
        <div className="flex gap-4 items-center flex-wrap">
          <button
            onClick={handleSimulateLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Show Global Loading (2s)
          </button>

          <button
            onClick={handleAsyncOperation}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Loading with Async Wrapper (3s)
          </button>
        </div>

        <div className="mt-4 flex gap-4 items-center">
          <span className="text-sm text-gray-600">Inline Loading:</span>
          <Loading size="sm" />
          <Loading size="md" />
          <Loading size="lg" />
        </div>
      </section>

      <header style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: 8 }}>
          Welcome back, {user ? user.name : "Guest"}
        </h1>
        <p style={{ color: "var(--text-gray)" }}>
          Here is what's happening with your projects today.
        </p>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 24,
        }}
      >
        {/* Card 1 */}
        <div
          style={{
            backgroundColor: "var(--bg-sidebar)",
            padding: 24,
            borderRadius: 12,
            border: "1px solid var(--border-color)",
            boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
          }}
        >
          <h3
            style={{
              fontSize: "0.9rem",
              fontWeight: 600,
              color: "var(--text-gray)",
              marginBottom: 8,
            }}
          >
            TOTAL REVENUE
          </h3>
          <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>$14,200</div>
        </div>

        {/* Card 2 */}
        <div
          style={{
            backgroundColor: "var(--bg-sidebar)",
            padding: 24,
            borderRadius: 12,
            border: "1px solid var(--border-color)",
            boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
          }}
        >
          <h3
            style={{
              fontSize: "0.9rem",
              fontWeight: 600,
              color: "var(--text-gray)",
              marginBottom: 8,
            }}
          >
            ACTIVE PROJECTS
          </h3>
          <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>24</div>
        </div>

        {/* Card 3 */}
        <div
          style={{
            backgroundColor: "var(--bg-sidebar)",
            padding: 24,
            borderRadius: 12,
            border: "1px solid var(--border-color)",
            boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
          }}
        >
          <h3
            style={{
              fontSize: "0.9rem",
              fontWeight: 600,
              color: "var(--text-gray)",
              marginBottom: 8,
            }}
          >
            NEW CLIENTS
          </h3>
          <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>+12</div>
        </div>
      </div>
    </div>
  );
}
