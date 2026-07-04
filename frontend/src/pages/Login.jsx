import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, ShieldCheck, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { extractErrorMessage } from "../utils/errors";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.username.trim(), form.password);
      toast.success(`Welcome back, ${user.first_name || user.username}!`);
      navigate(user.role === "admin" ? "/admin" : "/employee", { replace: true });
    } catch (err) {
      toast.error(extractErrorMessage(err, "Invalid username or password."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-950 px-4 py-10">
      <div
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, #4357e0, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle, #c8932b, transparent 70%)" }}
      />

      <div className="relative z-10 grid w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-soft md:grid-cols-2">
        {/* Brand panel */}
        <div className="hidden flex-col justify-between bg-gradient-to-br from-brand-700 via-brand-800 to-ink-900 p-10 text-white md:flex">
          <div>
            <div className="mb-8 flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 font-display text-lg font-bold">
                O
              </div>
              <span className="font-display text-lg font-bold">Orbit HRMS</span>
            </div>
            <h2 className="font-display text-3xl font-bold leading-tight">
              People operations,
              <br />
              run with precision.
            </h2>
            <p className="mt-4 max-w-xs text-sm text-white/70">
              Attendance, leave, holidays and official documents — one console for HR, one
              portal for every employee.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-white/5 p-4 text-xs text-white/60">
            <ShieldCheck className="h-5 w-5 shrink-0 text-gold-300" />
            Secured with role-based access and JWT authentication.
          </div>
        </div>

        {/* Form panel */}
        <div className="flex flex-col justify-center p-8 sm:p-10">
          <div className="mb-2 flex items-center gap-2.5 md:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 font-display text-base font-bold text-white">
              O
            </div>
            <span className="font-display text-base font-bold text-ink-800">Orbit HRMS</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-ink-800">Sign in</h1>
          <p className="mt-1 mb-7 text-sm text-ink-500">Use your employee or admin credentials.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label" htmlFor="username">Username</label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-ink-300" />
                <input
                  id="username"
                  className="input pl-10"
                  placeholder="e.g. employee1"
                  autoComplete="username"
                  required
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="label" htmlFor="password">Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-ink-300" />
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  className="input pl-10 pr-10"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-300 hover:text-ink-500"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 rounded-xl bg-ink-50 p-3.5 text-center text-xs text-ink-500">
            Demo — Admin: <span className="font-mono">admin / Admin@123</span>
            <br />
            Employee: <span className="font-mono">employee1 / Employee@123</span>
          </p>
        </div>
      </div>
    </div>
  );
}
