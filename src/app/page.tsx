"use client";

import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div style={{ maxWidth: 800 }}>
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
