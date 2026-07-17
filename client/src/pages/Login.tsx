import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Mail, Lock, ArrowRight, Shirt, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export default function Login() {
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { user } = await authApi.login({ email, password });
      await refresh();
      toast.success(`Welcome back, ${user.name}!`);
      navigate("/shop");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleForgot() {
    if (!email) {
      toast.error("Enter your email first, then tap Forgot?");
      return;
    }
    try {
      await authApi.forgotPassword(email);
      toast.success("If that email exists, a reset link is on its way.");
    } catch {
      toast.error("Could not request reset. Try again.");
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
              Welcome back.
            </h1>
            <p className="mt-4 max-w-sm text-body-md text-body">
              Sign in to pick up where you left off — your avatar, your
              saved looks, and your cart are all right here.
            </p>
            <div className="mt-8 rounded-xl bg-surface-soft p-6">
              <p className="text-caption-uppercase text-muted-soft">
                Your data is saved
              </p>
              <p className="mt-1 text-sm text-body">
                Accounts and saved profiles live in our secure database, so
                you can pick up right where you left off on any device.
              </p>
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
              Sign in
            </h2>
            <p className="mt-1 text-sm text-muted">
              New here?{" "}
              <Link to="/signup" className="font-medium text-ink underline">
                Create an account
              </Link>
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <button
                    type="button"
                    onClick={handleForgot}
                    className="text-xs font-medium text-muted hover:text-ink"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-soft" />
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-9"
                  />
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
                    Sign in
                    <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-xs text-muted-soft">
              By continuing you agree to our Terms & Privacy.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
