import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Mail, Lock, ArrowRight, Shirt, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export default function Signup() {
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords don't match");
      return;
    }
    setLoading(true);
    try {
      const { user } = await authApi.register({ name, email, password });
      await refresh();
      toast.success(`Account created — welcome, ${user.name}!`);
      navigate("/shop");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-canvas text-ink">
      <div className="mx-auto flex min-h-screen max-w-content items-center px-6 py-12">
        <div className="grid w-full gap-12 md:grid-cols-2 md:items-center">
          {/* Left: brand panel */}
          <div className="hidden md:block">
            <Link to="/" className="mb-10 inline-flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-md bg-primary text-on-primary">
                <Shirt className="size-5" />
              </span>
              <span className="font-display text-xl font-semibold tracking-tight">
                Fitting Room
              </span>
            </Link>
            <h1 className="font-display text-display-md leading-tight tracking-tight">
              Create your account.
            </h1>
            <p className="mt-4 max-w-sm text-body-md text-body">
              Build a true-to-you 3D avatar, try clothes on in real time, and
              see the fit before you buy. Takes under a minute to get started.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-3">
              {["#ff4d8b", "#1a3a3a", "#b8a4ed"].map((c) => (
                <div key={c} className="h-20 rounded-xl" style={{ background: c }} />
              ))}
            </div>
          </div>

          {/* Right: form */}
          <div className="rounded-xl border border-hairline bg-canvas p-8 shadow-clay">
            <div className="mb-6 md:hidden">
              <Link to="/" className="inline-flex items-center gap-2">
                <span className="flex size-9 items-center justify-center rounded-md bg-primary text-on-primary">
                  <Shirt className="size-5" />
                </span>
                <span className="font-display text-xl font-semibold tracking-tight">
                  Fitting Room
                </span>
              </Link>
            </div>
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              Sign up
            </h2>
            <p className="mt-1 text-sm text-muted">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-ink underline">
                Sign in
              </Link>
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-soft" />
                  <Input
                    id="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Doe"
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-soft" />
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-soft" />
                    <Input
                      id="password"
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm">Confirm</Label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-soft" />
                    <Input
                      id="confirm"
                      type="password"
                      required
                      minLength={6}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="••••••••"
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <>
                    Create account
                    <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-xs text-muted-soft">
              No credit card required.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
