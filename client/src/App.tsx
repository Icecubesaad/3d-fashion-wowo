import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import {
  motion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import {
  Sparkles,
  Shirt,
  Camera,
  ShoppingBag,
  Ruler,
  Check,
  ArrowRight,
  Menu,
  X,
  ScanLine,
  Palette,
  RotateCcw,
  Heart,
  Plus,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ClayAvatar from "@/components/ClayAvatar";

/* ------------------------------------------------------------------ */
/* Motion helpers                                                      */
/* ------------------------------------------------------------------ */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

function Reveal({
  children,
  className,
  i = 0,
}: {
  children: React.ReactNode;
  className?: string;
  i?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      custom={i}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Top Navigation                                                      */
/* ------------------------------------------------------------------ */

const NAV_LINKS: { label: string; to: string }[] = [
  { label: "Features", to: "/#features" },
  { label: "How it works", to: "/#how-it-works" },
  { label: "Shop", to: "/shop" },
  { label: "Pricing", to: "/#pricing" },
];

function TopNav() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-50 h-16 border-b border-hairline/60 bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-content items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-ink text-white">
            <Shirt className="h-4 w-4" />
          </span>
          <span className="font-display text-lg text-ink">Fitting Room</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              className="text-sm font-medium text-ink transition-colors hover:text-muted"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <>
              <span className="text-sm font-semibold text-ink">
                Hi, {user.name.split(" ")[0]}
              </span>
              <button
                onClick={() => {
                  void logout();
                  navigate("/");
                }}
                className="inline-flex h-11 items-center justify-center rounded-md bg-ink px-5 text-sm font-semibold text-white transition-colors hover:bg-[#1f1f1f]"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-ink">
                Sign in
              </Link>
              <Link
                to="/signup"
                className="inline-flex h-11 items-center justify-center rounded-md bg-ink px-5 text-sm font-semibold text-white transition-colors hover:bg-[#1f1f1f]"
              >
                Try free
              </Link>
            </>
          )}
        </div>

        <button
          className="lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-hairline/60 bg-canvas px-6 py-4 lg:hidden">
          <nav className="flex flex-col gap-4">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                className="text-sm font-medium text-ink"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Button asChild className="mt-2 h-11 rounded-md bg-ink text-white">
              <Link to="/signup" onClick={() => setOpen(false)}>
                Try free
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Hero — live 3D clay avatar                                          */
/* ------------------------------------------------------------------ */

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yArt = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <section id="top" ref={ref} className="relative overflow-hidden">
      {/* faint decorative grid behind hero */}
      <div className="pointer-events-none absolute inset-0 bg-grid-hairline opacity-[0.35] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />

      <div className="relative mx-auto max-w-content px-6 py-16 md:py-24">
        <div className="grid items-center gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-pill border border-hairline bg-surface-card px-3 py-1 text-xs font-semibold uppercase tracking-[1.5px] text-ink">
                <Sparkles className="h-3.5 w-3.5" /> New · Real-time 3D try-on
              </span>
            </Reveal>
            <Reveal i={1}>
              <h1 className="mt-6 font-display text-[44px] leading-[0.95] text-ink sm:text-[60px] md:text-[72px]">
                Try it on
                <br />
                <span className="relative inline-block">
                  before you buy.
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 300 12"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M2 9C60 3 140 3 298 7"
                      stroke="#ff4d8b"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>
            </Reveal>
            <Reveal i={2}>
              <p className="mt-7 max-w-lg text-lg leading-relaxed text-body">
                Build a true-to-you 3D avatar from a few measurements, drape real
                clothing on it, and preview every outfit on your own photo. Stop
                guessing your size — see the drape, the length, the fit, all
                before checkout.
              </p>
            </Reveal>
            <Reveal i={3}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/signup"
                  className="group inline-flex h-12 items-center justify-center rounded-md bg-ink px-6 text-sm font-semibold text-white transition-colors hover:bg-[#1f1f1f]"
                >
                  Create your avatar
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  to="/shop"
                  className="inline-flex h-12 items-center justify-center rounded-md border-hairline bg-canvas px-6 text-sm font-semibold text-ink transition-colors hover:bg-surface-soft"
                >
                  Browse the shop
                </Link>
              </div>
            </Reveal>
            <Reveal i={4}>
              <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-ink">
                <span className="inline-flex items-center gap-2">
                  <Check className="h-4 w-4 text-success" /> No credit card
                  required
                </span>
                <span className="inline-flex items-center gap-2">
                  <Check className="h-4 w-4 text-success" /> Build an avatar in
                  under a minute
                </span>
              </div>
            </Reveal>
          </div>

          <motion.div style={{ y: yArt }} className="md:col-span-6">
            <div className="relative overflow-hidden rounded-xl border border-hairline bg-surface-soft">
              {/* live 3D scene */}
              <div className="h-[420px] w-full sm:h-[480px]">
                <ClayAvatar />
              </div>
              {/* floating UI chips over the canvas */}
              <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-pill bg-canvas/90 px-3 py-1.5 text-xs font-semibold text-ink shadow-clay backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-success" /> Live preview
              </div>
              <div className="pointer-events-none absolute bottom-4 right-4 rounded-lg bg-canvas/90 px-4 py-2 text-xs shadow-clay backdrop-blur">
                <div className="font-semibold text-ink">Recommended: Size M</div>
                <div className="text-muted-ink">based on your measurements</div>
              </div>
            </div>
            <p className="mt-3 text-center text-xs text-muted-ink">
              Drag to rotate · rendered in your browser in real time
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Garment marquee                                                     */
/* ------------------------------------------------------------------ */

const GARMENTS = [
  { name: "Oversized Tee", color: "#ff4d8b" },
  { name: "Linen Blazer", color: "#1a3a3a" },
  { name: "Pleated Skirt", color: "#b8a4ed" },
  { name: "Knit Cardigan", color: "#ffb084" },
  { name: "Wide Trousers", color: "#e8b94a" },
  { name: "Silk Slip Dress", color: "#a4d4c5" },
  { name: "Denim Jacket", color: "#ff6b5a" },
];

function GarmentMarquee() {
  const row = [...GARMENTS, ...GARMENTS];
  return (
    <section className="border-y border-hairline/60 bg-surface-soft py-6">
      <div className="mb-4 text-center text-xs font-semibold uppercase tracking-[1.5px] text-muted-soft">
        A growing catalog of garments to try
      </div>
      <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
        <div className="marquee-track flex w-max gap-4">
          {row.map((g, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-pill border border-hairline bg-canvas px-4 py-2"
            >
              <span
                className="h-6 w-6 rounded-full"
                style={{ background: g.color }}
              />
              <span className="whitespace-nowrap text-sm font-medium text-ink">
                {g.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Feature cards (saturated Clay palette)                              */
/* ------------------------------------------------------------------ */

type Feature = {
  title: string;
  body: string;
  icon: React.ReactNode;
  bg: string;
  text: string;
  chip: string;
  span?: string;
};

const FEATURES: Feature[] = [
  {
    title: "Build your avatar",
    body: "Enter a few measurements or scan with your phone camera. We generate an accurate 3D body model — height, shoulders, waist, inseam — in seconds.",
    icon: <Ruler className="h-6 w-6" />,
    bg: "bg-brand-pink",
    text: "text-white",
    chip: "bg-white/20 text-white",
    span: "lg:col-span-2",
  },
  {
    title: "Try on in 3D",
    body: "Rotate, zoom, and inspect real fabric drape on your avatar.",
    icon: <RotateCcw className="h-6 w-6" />,
    bg: "bg-brand-teal",
    text: "text-white",
    chip: "bg-white/15 text-white",
  },
  {
    title: "Preview on your photo",
    body: "Upload a full-body photo and see the outfit composited onto you.",
    icon: <Camera className="h-6 w-6" />,
    bg: "bg-brand-lavender",
    text: "text-ink",
    chip: "bg-ink/10 text-ink",
  },
  {
    title: "Smart size match",
    body: "We compare each garment's spec against your avatar and recommend the size most likely to fit — with a confidence score.",
    icon: <ScanLine className="h-6 w-6" />,
    bg: "bg-brand-peach",
    text: "text-ink",
    chip: "bg-ink/10 text-ink",
    span: "lg:col-span-2",
  },
  {
    title: "Mix & match",
    body: "Style full outfits across brands and recolor pieces on the fly.",
    icon: <Palette className="h-6 w-6" />,
    bg: "bg-brand-ochre",
    text: "text-ink",
    chip: "bg-ink/10 text-ink",
  },
  {
    title: "Save your looks",
    body: "Curate outfits into collections and get alerts when they go on sale.",
    icon: <Heart className="h-6 w-6" />,
    bg: "bg-surface-card",
    text: "text-ink",
    chip: "bg-ink/5 text-ink",
  },
];

function FeatureCard({ f, i }: { f: Feature; i: number }) {
  return (
    <Reveal i={i} className={cn(f.span)}>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={cn("h-full rounded-xl p-8", f.bg, f.text)}
      >
        <span
          className={cn(
            "inline-flex h-12 w-12 items-center justify-center rounded-md",
            f.chip
          )}
        >
          {f.icon}
        </span>
        <h3 className="mt-6 text-lg font-semibold">{f.title}</h3>
        <p
          className={cn(
            "mt-2 text-sm leading-relaxed",
            f.text === "text-white" ? "text-white/85" : "text-body"
          )}
        >
          {f.body}
        </p>
      </motion.div>
    </Reveal>
  );
}

function Features() {
  return (
    <section id="features" className="mx-auto max-w-content px-6 py-20 md:py-[96px]">
      <div className="max-w-2xl">
        <Reveal>
          <span className="text-xs font-semibold uppercase tracking-[1.5px] text-muted-ink">
            Features
          </span>
        </Reveal>
        <Reveal i={1}>
          <h2 className="mt-4 font-display text-[32px] leading-tight text-ink md:text-display-lg">
            Everything you need to shop with certainty.
          </h2>
        </Reveal>
      </div>
      <div className="mt-12 grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <FeatureCard key={f.title} f={f} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* How it works — stepper                                              */
/* ------------------------------------------------------------------ */

const STEPS = [
  {
    n: "01",
    title: "Scan or measure",
    body: "Use your phone camera for a full-body scan, or type in your measurements manually. Takes under a minute.",
    icon: <ScanLine className="h-5 w-5" />,
  },
  {
    n: "02",
    title: "Dress your avatar",
    body: "Browse the catalog and drop garments onto your model. Everything renders with realistic fabric drape.",
    icon: <Shirt className="h-5 w-5" />,
  },
  {
    n: "03",
    title: "Check the fit",
    body: "Rotate to inspect drape and length. Our size engine flags the best match with a confidence score.",
    icon: <Ruler className="h-5 w-5" />,
  },
  {
    n: "04",
    title: "Buy with confidence",
    body: "Add the recommended size to cart and check out. Fewer surprises, far fewer returns.",
    icon: <ShoppingBag className="h-5 w-5" />,
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-surface-strong/40">
      <div className="mx-auto max-w-content px-6 py-20 md:py-[96px]">
        <div className="max-w-2xl">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-[1.5px] text-muted-ink">
              How it works
            </span>
          </Reveal>
          <Reveal i={1}>
            <h2 className="mt-4 font-display text-[32px] leading-tight text-ink md:text-display-lg">
              From measurements to checkout in four steps.
            </h2>
          </Reveal>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} i={i}>
              <div className="relative h-full rounded-lg border border-hairline bg-canvas p-6">
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-ink text-white">
                    {s.icon}
                  </span>
                  <span className="font-display text-3xl text-hairline">
                    {s.n}
                  </span>
                </div>
                <h3 className="mt-5 text-base font-semibold text-ink">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-body">
                  {s.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Pricing                                                             */
/* ------------------------------------------------------------------ */

const TIERS = [
  {
    name: "Free",
    price: "$0",
    tagline: "For casual browsing",
    features: ["1 saved avatar", "3D try-on", "Basic size match", "Community support"],
    featured: false,
  },
  {
    name: "Plus",
    price: "$9",
    tagline: "For frequent shoppers",
    features: [
      "Unlimited avatars",
      "Photo preview compositing",
      "Smart size match + confidence",
      "Saved outfit collections",
      "Sale alerts",
    ],
    featured: true,
  },
  {
    name: "Studio",
    price: "$29",
    tagline: "For power users",
    features: [
      "Everything in Plus",
      "Batch outfit rendering",
      "Custom catalog upload",
      "Analytics dashboard",
      "Priority support",
    ],
    featured: false,
  },
];

function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-content px-6 py-20 md:py-[96px]">
      <div className="max-w-2xl">
        <Reveal>
          <span className="text-xs font-semibold uppercase tracking-[1.5px] text-muted-ink">
            Pricing
          </span>
        </Reveal>
        <Reveal i={1}>
          <h2 className="mt-4 font-display text-[32px] leading-tight text-ink md:text-display-lg">
            Simple plans. Cancel anytime.
          </h2>
        </Reveal>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {TIERS.map((t, i) => (
          <Reveal key={t.name} i={i}>
            <div
              className={cn(
                "flex h-full flex-col rounded-lg p-8",
                t.featured
                  ? "bg-brand-teal text-white shadow-clay"
                  : "border border-hairline bg-canvas text-ink"
              )}
            >
              {t.featured && (
                <span className="mb-4 inline-flex w-fit items-center rounded-pill bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[1.5px]">
                  Most popular
                </span>
              )}
              <h3 className="text-2xl font-semibold">{t.name}</h3>
              <p
                className={cn(
                  "mt-1 text-sm",
                  t.featured ? "text-white/70" : "text-muted-ink"
                )}
              >
                {t.tagline}
              </p>
              <div className="mt-6 flex items-end gap-1">
                <span className="font-display text-[44px] leading-none">
                  {t.price}
                </span>
                <span
                  className={cn(
                    "pb-1.5 text-sm",
                    t.featured ? "text-white/70" : "text-muted-ink"
                  )}
                >
                  /mo
                </span>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {t.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2 text-sm">
                    <Check
                      className={cn(
                        "mt-0.5 h-4 w-4 shrink-0",
                        t.featured ? "text-brand-mint" : "text-success"
                      )}
                    />
                    <span className={t.featured ? "text-white/90" : "text-body"}>
                      {feat}
                    </span>
                  </li>
                ))}
              </ul>
              <Button
                className={cn(
                  "mt-8 h-11 rounded-md text-sm font-semibold",
                  t.featured
                    ? "bg-white text-ink hover:bg-white/90"
                    : "bg-ink text-white hover:bg-[#1f1f1f]"
                )}
              >
                Get started
              </Button>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ                                                                 */
/* ------------------------------------------------------------------ */

const FAQS = [
  {
    q: "How accurate is the size recommendation?",
    a: "We compare each garment's measurement spec against your avatar's dimensions and return the size with the highest fit probability, along with a confidence indicator.",
  },
  {
    q: "Do I need special hardware to scan my body?",
    a: "No. A regular phone camera works for the guided full-body scan, or you can skip scanning entirely and type in your measurements. Both paths produce an accurate 3D avatar.",
  },
  {
    q: "Which garments are supported?",
    a: "The catalog includes a range of garments across common categories, and it keeps growing as new pieces are added.",
  },
  {
    q: "Is my body data private?",
    a: "Yes. Your measurements and photos are encrypted, never sold, and you can delete your avatar and all associated data at any time from your account settings.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-hairline">
      <button
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-base font-semibold text-ink">{q}</span>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-surface-card text-ink">
          {open ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden"
      >
        <p className="pb-5 pr-12 text-sm leading-relaxed text-body">{a}</p>
      </motion.div>
    </div>
  );
}

function Faq() {
  return (
    <section className="mx-auto max-w-content px-6 py-20 md:py-[96px]">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-[1.5px] text-muted-ink">
              FAQ
            </span>
            <h2 className="mt-4 font-display text-[32px] leading-tight text-ink md:text-display-md">
              Questions, answered.
            </h2>
            <p className="mt-4 text-sm text-muted-ink">
              Still curious? Reach our team at{" "}
              <a href="#" className="text-ink underline">
                hello@fittingroom.app
              </a>
            </p>
          </Reveal>
        </div>
        <div className="md:col-span-8">
          <Reveal i={1}>
            <div className="rounded-lg border border-hairline bg-canvas px-6">
              {FAQS.map((f) => (
                <FaqItem key={f.q} {...f} />
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* CTA band                                                            */
/* ------------------------------------------------------------------ */

function CtaBand() {
  return (
    <section className="mx-auto max-w-content px-6 pb-20 md:pb-[96px]">
      <div className="relative overflow-hidden rounded-xl bg-surface-soft px-8 py-16 text-center md:px-20 md:py-24">
        <div className="clay-float pointer-events-none absolute -left-8 top-8 h-24 w-24 rounded-full bg-brand-peach/70" />
        <div className="clay-float pointer-events-none absolute -right-6 bottom-6 h-28 w-28 rounded-2xl bg-brand-lavender/70 [animation-delay:1.5s]" />
        <div className="clay-float pointer-events-none absolute left-12 bottom-10 h-12 w-12 rounded-xl bg-brand-ochre/70 [animation-delay:0.8s]" />
        <Reveal>
          <h2 className="relative mx-auto max-w-2xl font-display text-[32px] leading-tight text-ink md:text-display-md">
            Turn your next purchase into a perfect fit.
          </h2>
          <p className="relative mx-auto mt-4 max-w-md text-base text-body">
            Create your avatar in under a minute — no credit card required.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Button className="group h-12 rounded-md bg-ink px-6 text-sm font-semibold text-white hover:bg-[#1f1f1f]">
              Get started free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
            <Button
              variant="outline"
              className="h-12 rounded-md border-hairline bg-canvas px-6 text-sm font-semibold text-ink hover:bg-surface-card"
            >
              Talk to sales
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

const FOOTER_COLS = [
  { title: "Product", links: ["Avatar", "3D Try-On", "Photo Preview", "Shop"] },
  { title: "Company", links: ["About", "Careers", "Press", "Contact"] },
  { title: "Resources", links: ["Help center", "Size guide", "Blog", "Status"] },
  { title: "Legal", links: ["Privacy", "Terms", "Cookies"] },
];

function Footer() {
  return (
    <footer className="border-t border-hairline/60 bg-surface-soft">
      <div className="mx-auto max-w-content px-6 py-16 md:py-20">
        <div className="grid gap-10 md:grid-cols-[1.5fr_repeat(4,1fr)]">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-ink text-white">
                <Shirt className="h-4 w-4" />
              </span>
              <span className="font-display text-lg text-ink">Fitting Room</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-muted-ink">
              See the fit before you buy. Premium 3D avatar customization and
              virtual try-on.
            </p>
            <div className="mt-6 flex max-w-xs items-center gap-2 rounded-md border border-hairline bg-canvas p-1.5">
              <input
                type="email"
                placeholder="Your email"
                className="h-9 flex-1 bg-transparent px-3 text-sm text-ink outline-none placeholder:text-muted-soft"
              />
              <Button className="h-9 rounded-md bg-ink px-4 text-xs font-semibold text-white hover:bg-[#1f1f1f]">
                Notify me
              </Button>
            </div>
          </div>
          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold uppercase tracking-[1.5px] text-ink">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-muted-ink transition-colors hover:text-ink"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Signature Clay horizon "mountain" band, cream throughout */}
        <div className="relative mt-14 h-16 overflow-hidden">
          <div className="absolute bottom-0 left-1/4 h-24 w-24 -translate-x-1/2 rounded-t-full bg-brand-lavender/50" />
          <div className="absolute bottom-0 left-1/2 h-32 w-32 -translate-x-1/2 rounded-t-full bg-brand-peach/50" />
          <div className="absolute bottom-0 left-3/4 h-20 w-20 -translate-x-1/2 rounded-t-full bg-brand-mint/50" />
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-hairline/60 pt-6 text-sm text-muted-ink sm:flex-row">
          <span>
            © {new Date().getFullYear()} Fitting Room. All rights reserved.
          </span>
          <span>Made with warmth on a cream canvas.</span>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* App                                                                 */
/* ------------------------------------------------------------------ */

function App() {
  return (
    <div className="min-h-screen bg-canvas text-body">
      <TopNav />
      <main>
        <Hero />
        <GarmentMarquee />
        <Features />
        <HowItWorks />
        <Pricing />
        <Faq />
        <CtaBand />
      </main>
      <Footer />
    </div>
  );
}

export default App;
