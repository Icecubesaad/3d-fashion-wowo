import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Shirt,
  ArrowLeft,
  ShoppingBag,
  Heart,
  Check,
  Truck,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Product = {
  id: string;
  name: string;
  price: number;
  color: string;
  section: "women" | "men";
  category: string;
  description: string;
};

const PRODUCTS: Record<string, Product> = {
  w1: { id: "w1", name: "Oversized Cotton Tee", price: 32, color: "#ff4d8b", section: "women", category: "Tops", description: "A breezy, boxy-fit tee in heavyweight combed cotton. Dropped shoulders and a relaxed hem make it the easy layering piece your avatar will live in." },
  w2: { id: "w2", name: "Pleated Midi Skirt", price: 48, color: "#b8a4ed", section: "women", category: "Bottoms", description: "Knife-pleated midi with a soft A-line sweep. Sits at the natural waist and moves with you — preview the drape on your own proportions." },
  w3: { id: "w3", name: "Knit Cardigan", price: 64, color: "#ffb084", section: "women", category: "Tops", description: "Chunky open-front knit with a fuzzy, soft-hand feel. Oversized enough to throw over the tee or wear solo." },
  w4: { id: "w4", name: "Silk Slip Dress", price: 89, color: "#e8b94a", section: "women", category: "Dresses", description: "Bias-cut silk slip that skims the body. Adjustable straps and a bias hem that reacts to your avatar's shape." },
  w5: { id: "w5", name: "Wide-Leg Trousers", price: 56, color: "#1a3a3a", section: "women", category: "Bottoms", description: "High-rise, flowing wide-leg trousers in a matte twill. Pleated front, full-length break at the ankle." },
  w6: { id: "w6", name: "Denim Jacket", price: 78, color: "#a4d4c5", section: "women", category: "Outerwear", description: "Classic trucker jacket in rigid denim with a clean wash. Boxier through the body, hits at the hip." },
  m1: { id: "m1", name: "Boxy Graphic Tee", price: 30, color: "#1a3a3a", section: "men", category: "Tops", description: "Relaxed boxy tee with a clean front print. Heavy cotton, straight hem, easy everyday fit." },
  m2: { id: "m2", name: "Linen Blazer", price: 96, color: "#f5f0e0", section: "men", category: "Outerwear", description: "Unstructured linen blazer with patch pockets. Soft shoulder, breathable, sharp enough for smart-casual." },
  m3: { id: "m3", name: "Relaxed Chinos", price: 54, color: "#e8b94a", section: "men", category: "Bottoms", description: "Mid-rise chinos with a relaxed taper. Stretch twill that holds its shape through the day." },
  m4: { id: "m4", name: "Crewneck Sweat", price: 44, color: "#ff4d8b", section: "men", category: "Tops", description: "Brushed-back fleece crew with a standard fit. Ribbed collar, cuffs, and hem." },
  m5: { id: "m5", name: "Cargo Shorts", price: 38, color: "#b8a4ed", section: "men", category: "Bottoms", description: "Above-the-knee cargo shorts with bellows pockets. Relaxed through the thigh." },
  m6: { id: "m6", name: "Bomber Jacket", price: 88, color: "#0a0a0a", section: "men", category: "Outerwear", description: "Lightweight bomber with ribbed hem and cuffs, a zip placket, and a clean matte shell." },
};

const SIZES = ["XS", "S", "M", "L", "XL"];

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = id ? PRODUCTS[id] : undefined;

  const [size, setSize] = useState("M");
  const [saved, setSaved] = useState(false);

  if (!product) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-canvas text-ink">
        <p className="text-muted">Product not found.</p>
        <Button asChild className="mt-4">
          <Link to="/shop">Back to shop</Link>
        </Button>
      </main>
    );
  }

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
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-4" /> Back
        </button>

        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          {/* Visual */}
          <div
            className="relative aspect-square w-full overflow-hidden rounded-xl"
            style={{ background: product.color }}
          >
            <span className="absolute left-4 top-4 rounded-full bg-canvas/90 px-3 py-1 text-xs font-medium text-ink">
              {product.category}
            </span>
            <span className="absolute bottom-4 left-4 rounded-full bg-canvas/90 px-3 py-1 text-xs font-medium uppercase text-ink">
              {product.section}
            </span>
          </div>

          {/* Details */}
          <div>
            <p className="text-caption-uppercase text-muted-soft">
              {product.section === "women" ? "Women" : "Men"} · {product.category}
            </p>
            <h1 className="mt-2 font-display text-display-sm tracking-tight">
              {product.name}
            </h1>
            <p className="mt-3 text-2xl font-semibold">${product.price}</p>
            <p className="mt-5 text-body-md text-body">{product.description}</p>

            {/* Size */}
            <div className="mt-8">
              <p className="text-sm font-semibold">Size</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={cn(
                      "h-11 w-11 rounded-md border text-sm font-medium transition",
                      size === s
                        ? "border-ink bg-ink text-white"
                        : "border-hairline bg-canvas text-ink hover:bg-surface-soft"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                size="lg"
                className="flex-1"
                onClick={() => toast(`Added ${product.name} (${size}) to cart (demo)`)}
              >
                <ShoppingBag className="size-4" /> Add to cart
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-4"
                onClick={() => {
                  setSaved((v) => !v);
                  toast(saved ? "Removed from wishlist" : "Saved to wishlist (demo)");
                }}
              >
                <Heart className={cn("size-4", saved && "fill-current")} />
              </Button>
            </div>

            {/* Perks */}
            <div className="mt-8 space-y-3 rounded-xl bg-surface-soft p-5 text-sm">
              <div className="flex items-center gap-3">
                <Check className="size-4 text-success" />
                <span>Free 3D try-on on your avatar before you buy</span>
              </div>
              <div className="flex items-center gap-3">
                <Truck className="size-4 text-muted" />
                <span>Free shipping over $75</span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="size-4 text-muted" />
                <span>30-day easy returns</span>
              </div>
            </div>

            <Button variant="link" asChild className="mt-6 px-0">
              <Link to="/">Try this on your avatar →</Link>
            </Button>
          </div>
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
