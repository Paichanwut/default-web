"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import styles from "@/app/auth/login/login.module.scss"; // Adjusted import path
import { Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("admin@demo.com");
  const [password, setPassword] = useState("123456");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      login(email);
    }
  };

  return (
    <div className={styles.login_container}>
      <div className={styles.login_card}>
        <h1 className={styles.title}>Sign in</h1>
        <p className={styles.subtitle}>
          Need an account?
          <Link href="/auth/register">Sign up</Link>
        </p>

        <div className={styles.social_buttons}>
          <button type="button">
            <span style={{ color: "#EA4335", fontWeight: "bold" }}>G</span>
            Use Google
          </button>
          <button type="button">
            <span style={{ color: "#000", fontWeight: "bold" }}></span>
            Use Apple
          </button>
        </div>

        <div className={styles.divider}>
          <span>OR</span>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.form_group}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="email@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.form_group}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <label htmlFor="password">Password</label>
              <Link
                href="/auth/forgot-password"
                className={styles.form_options + " " + styles.forgot}
                style={{
                  margin: 0,
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: "#3E97FF",
                }}
              >
                Forgot Password?
              </Link>
            </div>

            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "#99A1B7",
                  cursor: "pointer",
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className={styles.form_options} style={{ marginTop: 10 }}>
            <label className={styles.remember}>
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
          </div>

          <button type="submit" className={styles.submit_btn}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
