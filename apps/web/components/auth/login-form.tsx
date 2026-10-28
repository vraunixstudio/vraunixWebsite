"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/button";

export function LoginForm({ nextPath }: { nextPath: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await api("/auth/login", {
        method: "POST",
        body: { email, password },
      });
      router.replace(nextPath);
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof ApiError
          ? cause.message
          : "Sign-in could not be completed. Please check your credentials."
      );
      setBusy(false);
    }
  }

  const inputStyle = {
    width: '100%',
    height: '52px',
    padding: '0 1.25rem',
    borderRadius: '0.85rem',
    border: '1.5px solid #000',
    fontSize: '0.95rem',
    background: '#ffffff',
    outline: 'none',
    transition: 'all 0.2s ease',
    display: 'block'
  };

  const labelStyle = {
    fontSize: '0.75rem',
    fontWeight: 800,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em',
    color: '#000',
    display: 'block',
    marginBottom: '0.6rem'
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.04em', margin: 0, fontFamily: 'var(--vx-font-display)' }}>
          Welcome back.
        </h1>
        <p style={{ color: 'var(--vx-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
          Sign in to your Vraunix Studio workspace.
        </p>
      </div>

      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} noValidate>
        <div className="field">
          <label htmlFor="auth-email" style={labelStyle}>Email Address</label>
          <input
            id="auth-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@vraunix.studio"
            autoComplete="username"
            required
            maxLength={254}
            autoFocus
            style={inputStyle}
          />
        </div>

        <div className="field">
          <label htmlFor="auth-password" style={labelStyle}>Password</label>
          <div style={{ position: 'relative' }}>
            <input
              id="auth-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••••••"
              autoComplete="current-password"
              required
              maxLength={128}
              style={{ ...inputStyle, paddingRight: '3.5rem' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
              style={{
                position: 'absolute',
                right: '1.25rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--vx-muted)',
                cursor: 'pointer',
                display: 'grid',
                placeItems: 'center',
                padding: '0.25rem'
              }}
            >
              <Icon name={showPassword ? "lock" : "eye"} size={16} />
            </button>
          </div>
        </div>

        {error && (
          <div style={{ padding: '1rem', background: 'rgba(220, 50, 50, 0.08)', borderRadius: '0.75rem', color: 'rgb(200, 40, 40)', fontSize: '0.88rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.75rem' }} role="alert">
            <Icon name="alert" size={17} />
            <span>{error}</span>
          </div>
        )}

        <Button
          type="submit"
          disabled={busy}
          loading={busy}
          style={{
            height: '56px',
            borderRadius: '99px',
            background: '#000',
            color: '#fff',
            fontSize: '1rem',
            fontWeight: 700,
            marginTop: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem'
          }}
        >
          <span>Sign in to Workspace</span>
          {!busy && <Icon name="arrow-right" size={18} />}
        </Button>
      </form>
    </div>
  );
}
