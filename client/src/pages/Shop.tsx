import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Shirt, Search, ShoppingBag, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Product = {
  id: string;
  name: string;
  price: number;
  color: string;
  section: "women" | "men";
  category: string;
};

const PRODUCTS: Product[] = [
  { id: "w1", name: "Oversized Cotton Tee", price: 32, color: "#ff4d8b", section: "women", category: "Tops" },
  { id: "w2", name: "Pleated Midi Skirt", price: 48, color: "#b8a4ed", section: "women", category: "Bottoms" },
  { id: "w3", name: "Knit Cardigan", price: 64, color: "#ffb084", section: "women", category: "Tops" },
  { id: "w4", name: "Silk Slip Dress", price: 89, color: "#e8b94a", section: "women", category: "Dresses" },
  { id: "w5", name: "Wide-Leg Trousers", price: 56, color: "#1a3a3a", section: "women", category: "Bottoms" },
  { id: "w6", name: "Denim Jacket", price: 78, color: "#a4d4c5", section: "women", category: "Outerwear" },
  { id: "m1", name: "Boxy Graphic Tee", price: 30, color: "#1a3a3a", section: "men", category: "Tops" },
  { id: "m2", name: "Linen Blazer", price: 96, color: "#f5f0e0", section: "men", category: "Outerwear" },
  { id: "m3", name: "Relaxed Chinos", price: 54, color: "#e8b94a", section: "men", category: "Bottoms" },
  { id: "m4", name: "Crewneck Sweat", price: 44, color: "#ff4d8b", section: "men", category: "Tops" },
  { id: "m5", name: "Cargo Shorts", price: 38, color: "#b8a4ed", section: "men", category: "Bottoms" },
  { id: "m6", name: "Bomber Jacket", price: 88, color: "#0a0a0a", section: "men", category: "Outerwear" },
];

const SECTIONS: { key: "women" | "men" | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "women", label: "Women" },
  { key: "men", label: "Men" },
];

function ProductCard({ p }: { p: Product }) {
  return (
    <Link
      to={`/product/${p.id}`}
      className="group block overflow-hidden rounded-xl border border-hairline bg-canvas transition-shadow hover:shadow-clay"
    >
      <div className="relative aspect-[4/5] w-full" style={{ background: p.color }}>
        <span className="absolute left-3 top-3 rounded-full bg-canvas/90 px-3 py-1 text-xs font-medium text-ink">
          {p.category}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toast("Saved to wishlist (demo)");
          }}
          className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-canvas/90 text-ink transition hover:bg-canvas"
          aria-label="Save"
        >
          <Heart className="size-4" />
        </button>
        <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
          <Button
            size="sm"
            className="w-full"
            onClick={(e) => {
              e.preventDefault();
              toast(`Added ${p.name} to cart (demo)`);
            }}
          >
            <ShoppingBag className="size-4" /> Add to cart
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between p-4">
        <div>
          <h3 className="font-medium leading-tight">{p.name}</h3>
          <p className="mt-1 text-sm text-muted">${p.price}</p>
        </div>
      </div>
    </Link>
  );
}

export default function Shop() {
  const [section, setSection] = useState<"women" | "men" | "all">("all");
  const [query, setQuery] = useState("");

  const filtered = PRODUCTS.filter(
    (p) =>
      (section === "all" || p.section === section) &&
      p.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-canvas text-ink">
      {/* Top nav */}
      <header className="sticky top-0 z-40 border-b border-hairline bg-canvas/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-content items-center justify-between px-6">
          <Link to="/" className="inline-flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-md bg-primary text-on-primary">
              <Shirt className="size-5" />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">
              Fitting Room
            </span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-ink md:flex">
            <Link to="/shop" className="text-ink">Shop</Link>
            <Link to="/" className="text-ink/70 hover:text-ink">Avatar</Link>
            <Link to="/" className="text-ink/70 hover:text-ink">Try-on</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Sign in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/signup">Try free</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-content px-6 py-section">
        {/* Heading */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-caption-uppercase text-muted-soft">SHOP</p>
            <h1 className="mt-2 font-display text-display-sm tracking-tight">
              The catalogue.
            </h1>
            <p className="mt-2 max-w-md text-body-md text-body">
              Every piece is ready to try on your 3D avatar. Pick a section and
              start building looks.
            </p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-soft" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products"
              className="pl-9"
            />
          </div>
        </div>

        {/* Section tabs */}
        <div className="mt-8 flex gap-2">
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              onClick={() => setSection(s.key)}
              className={cn(
                "rounded-pill px-4 py-2 text-sm font-medium transition",
                section === s.key
                  ? "bg-surface-card text-ink"
                  : "text-muted hover:text-ink"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <p className="mt-16 text-center text-muted">No products match.</p>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-section rounded-xl bg-surface-soft p-10 text-center">
          <h2 className="font-display text-display-sm tracking-tight">
            See it on your avatar.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-body-md text-body">
            Head to the fitting room and drape any of these on a body that's
            built like yours.
          </p>
          <Button size="lg" className="mt-6" asChild>
            <Link to="/">
              Open the fitting room
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>

      <footer className="border-t border-hairline bg-surface-soft">
        <div className="mx-auto max-w-content px-6 py-10 text-sm text-muted">
          © {new Date().getFullYear()} Fitting Room — see the fit before you
          buy.
        </div>
      </footer>
    </main>
  );
}
