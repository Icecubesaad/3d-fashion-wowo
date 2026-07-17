# Virtual Fitting Room — Final Consolidated Spec (v2, with Morph-Target Avatar Architecture)

*Single source of truth for the project as currently scoped. This v2 supersedes the earlier "Stylized Customizable Avatars FREE / 3-slider" avatar plan. The avatar & clothing pipeline section (§7.2) has been REWRITTEN around the Blender morph-target approach with dynamic, unlimited body sliders and owner-uploaded predefined garments. Everything else from the prior plan is preserved. See §6 for the exact delta from v1.*

---

## 1. What We're Building

A full-stack web app where a user:
1. Creates a customizable 3D avatar (male/female, adjustable body — **any number of body sliders**).
2. Browses a men's + women's clothing catalogue.
3. Tries **predefined** garments on the avatar in a 3D fitting room; garments re-fit live as the body changes.
4. Uploads a real photo and gets a photorealistic AI try-on image.
5. Adds items to a cart and completes a Stripe **test-mode** checkout.

Admin side: product CRUD, 3D asset (GLB) assignment, order viewing.

---

## 2. Final Tech Decisions (and why)

| Area | Decision | Why |
|---|---|---|
| 3D avatar + clothing (PRIMARY) | **Blender-authored morph-target avatar + predefined garment GLBs** (self-hosted) | You control the body sliders (unlimited shape keys) AND the garments. No vendor cap on slider count, no per-use fee, no third-party runtime dependency. Confirmed viable: glTF morph targets load natively in Three.js / R3F and are driven by `mesh.morphTargetInfluences`. |
| 3D export pipeline | Blender → GLB (glTF 2.0) with "Shape Keys" enabled → morph targets | No Unity needed. Free. Morph targets survive the GLB export and are consumable in R3F via `morphTargetDictionary`. |
| 3D runtime | React Three Fiber + Three.js; slider state → `morphTargetInfluences` on body + every equipped garment | Standard, well-supported, no physics engine needed. Sliders are generated dynamically from the GLB's morph dictionary — not hard-coded to 3. |
| 2D realistic try-on | **Replicate (IDM-VTON model)** | Only AI API in the whole project. Pay-per-use (~$0.01–$0.05/generation), no subscription. |
| Pose detection | **MediaPipe Pose** (client-side, free, CDN) | No cost, no account, runs in-browser. |
| Rejected: WEARFITS, Style3D, CLO3D/Browzwear | Too expensive / enterprise-only | Real physics-based draping is inherently costly. |
| Rejected: Daz3D Genesis | Licensing trap | Requires paid Interactive License for real-time use. |
| Rejected: Stylized Customizable Avatars FREE (Unity pack) as PRIMARY | Slider count fixed by vendor (3 body blend shapes) | Old plan capped sliders at Height/Weight/Muscle. New requirement is *unlimited* sliders → Blender shape keys give that control directly. Kept only as an optional fallback source of base meshes, not the mechanism. |
| ReadyPlayerMe | **Removed from scope entirely** | Acquired by Netflix; all public services shut down Jan 31, 2026 (confirmed via DNS NXDOMAIN). No fallback avatar system needed — the Blender pipeline is self-hosted. |
| Rejected: AI image-to-3D (Meshy/Tripo/Rodin) for garment generation | Not adopted | Generates a raw mesh only — still requires manual shape-key authoring to share the body's morphs. Adds a paid API without removing the real labor. |

---

## 3. In Scope (Final)

- JWT auth: register, login, password reset.
- Avatar builder: male/female base, **dynamic body sliders generated from the avatar GLB's morph targets** (Height / Weight / Muscle / Shoulder width / Hip / Waist / Bust / Leg length / etc. — whatever shape keys were authored; no hard cap), face sliders, skin tone, hair style/color, save avatar.
- Product catalogue: Men's + Women's sections, category/filter/search, product detail pages.
- Cart & wishlist.
- 3D fitting room: load avatar + **predefined** garment GLBs (each shares the body's shape keys so it fits the morphed body), clothing slots (Top / Bottom / Shoes / Hat / Glasses, extensible), size/colour switching, orbit/zoom/camera presets, rule-based fit label (tight/loose/good — not physics).
- Save outfit to profile.
- 2D photo try-on: upload photo → MediaPipe landmarks → Replicate IDM-VTON realistic overlay → download.
- Stripe test-mode checkout, order confirmation.
- Admin panel: product CRUD, assign garment GLB + slot to each product, view orders.
- Mobile-responsive UI.

## 4. Out of Scope (Final)

- True physics-based cloth simulation (wrinkles, folding, wind).
- AI-generated 3D garments from 2D photos.
- Body scanning / depth-sensor capture.
- AR mirror mode.
- Real-time multiplayer / shared fitting rooms.
- **User uploading their OWN arbitrary garment file that auto-fits.** Garments are PREDEFINED by the site owner (you author them in Blender with matching shape keys). This is a deliberate scope decision — auto-fitting an arbitrary uploaded mesh is an open research problem and out of budget.
- Live/production payment processing — test mode only.
- Native iOS/Android apps.
- Multi-language / multi-currency support.

---

## 5. The Body Slider Model (Corrected in v2)

**Old plan (v1):** independent chest/waist/hip sliders were requested, then narrowed to a vendor-enforced **3-slider** set (Height / Weight / Muscle) because the free Unity pack only exposed 3 body blend shapes.

**v2 reality:** the avatar is now **authored in Blender with one Shape Key per controllable feature**. There is no upper limit. The slider panel is generated at runtime by reading `mesh.morphTargetDictionary` — so 4, 10, or 20 sliders all work with zero code change. Each shape key = one slider.

**Authoring rule that matters:** every predefined garment must include the **same set of shape keys (same names, same order)** as the body, or that garment will not deform on sliders it's missing. This is the only scaling cost: more shape keys = more work per garment in Blender, but zero code work.

**Grouping (optional, recommended for many sliders):** name shape keys with a group prefix, e.g. `body_height`, `body_weight`, `face_jaw`. The UI splits on `_` to build tabbed groups (Body / Face / Posture) instead of one long wall of sliders.

---

## 6. Change Log — v1 → v2 (Traceable Delta)

| Area | v1 assumption | v2 correction |
|---|---|---|
| Avatar source | Stylized Customizable Avatars FREE (Unity pack) as primary | **Blender-authored morph-target avatar**, self-hosted. Unity pack demoted to optional base-mesh source only. |
| Body sliders | Capped at 3 (Height/Weight/Muscle) by vendor blend shapes | **Unlimited** — generated dynamically from GLB morph targets; author as many shape keys as desired. |
| Garments | Vendor pack's ~13 meshes | **Owner-authored predefined garments** (you model + export GLBs), each sharing the body's shape keys. Catalog grows by adding GLB + one list entry. |
| RPM | "Removed, acquired by Netflix" | Confirmed dead via independent DNS check (NXDOMAIN). Unchanged. |
| Fit mechanism | Shared blend shapes via vendor skeleton | Same principle, but YOU author the shared shape keys in Blender; no vendor skeleton required. |

---

## 7. Technical Architecture

### 7.1 Technology Stack
- **Frontend:** React 19 + Vite, Three.js ^0.185 + @react-three/fiber ^9.6 + @react-three/drei ^10.7, Tailwind + shadcn/ui, Zustand, Axios, MediaPipe Pose (CDN).
- **Backend:** Node.js + Express + TypeScript, MongoDB + Mongoose, jsonwebtoken + bcrypt, Stripe SDK (test), Replicate SDK (IDM-VTON).
- **Deployment:** Vercel (frontend), Render (backend), Vercel `public/` for GLB hosting (or GitHub raw / Cloudinary free tier).
- **3D authoring:** Blender (free) for avatar + garments.

### 7.2 3D Avatar & Clothing Pipeline (CORE — v2 rewrite)

#### 7.2.1 The mechanism
The avatar is a SkinnedMesh with a set of **Shape Keys** (Blender) that export as glTF **morph targets**. Each garment is its OWN mesh with the **same shape-key names**. At runtime, a slider value is written to `mesh.morphTargetInfluences[index]` on BOTH the body and every equipped garment — so the whole outfit reshapes together when the body changes. This is the "fit."

```
Body mesh  ──morphTargetDictionary──► { body_height:0, body_weight:1, body_muscle:2, ... }
Garment A  ──same names─────────────► { body_height:0, body_weight:1, body_muscle:2, ... }
Slider drag ─► influences[name] = v ─► applied to body + garment A + garment B ...
```

#### 7.2.2 Dynamic slider generation (no hard-coded count)
```tsx
// Read whatever morphs exist in the GLB — 3 or 30, same code.
const body = nodes.Body as THREE.SkinnedMesh;
const dict = body.morphTargetDictionary!;          // name -> index
const sliders = Object.keys(dict);                 // one slider per shape key

// Optional grouping by "group_feature" naming:
const groups = sliders.reduce<Record<string,string[]>>((acc, name) => {
  const [g, ...rest] = name.split("_");
  (acc[g] ??= []).push(rest.join("_") || name);
  return acc;
}, {});

function setMorph(name: string, v: number) {
  const i = dict[name];
  if (i !== undefined) body.morphTargetInfluences[i] = v;
  // repeat for every equipped garment mesh with the same name
  equippedMeshes.forEach(m => { if (m.morphTargetDictionary?.[name] !== undefined)
    m.morphTargetInfluences[m.morphTargetDictionary[name]] = v; });
}
```
Slider UI renders `groups` → tabs → a range input per feature. Adding a slider = adding a shape key in Blender. No code edit.

#### 7.2.3 Clothing slot system
Each `Product` gains `slot` + `glbUrl`. Equipping a product in a slot replaces the previous item in that slot; same morph weights applied to all equipped garments so the outfit reshapes together. Slots are an enum and extensible (top/bottom/footwear/hair/accessory → add more as needed).

#### 7.2.4 Predefined garment catalog — how YOU add more
This is the key workflow for "adding unique garments":
1. In Blender, model the new garment around the **same base avatar**.
2. Add the **same shape keys** (names + order) as the body so it deforms identically.
3. Export GLB → `client/public/garments/<id>.glb`.
4. Add ONE entry to the garments list:
   `{ id: "hoodie", name: "Hoodie", file: "/garments/hoodie.glb", slot: "top" }`
5. It appears in the rail automatically, fits the current body, swaps like the others.

Because every garment shares the body's shape keys, any new item automatically inherits the fit behavior. 5 → 50 garments is the same per-item effort, zero code changes.

#### 7.2.5 Shared skeleton / animation
All garments are authored on the same base body, so they share topology + shape keys. If you add idle animation later, garments deform with it because they share the body's morphs. `THREE.SkeletonUtils.clone` can share one skeleton instance at runtime if loading separate GLBs causes desync.

#### 7.2.6 Procedural fallback
If a product has no `glbUrl`, the fitting room shows a simple procedural placeholder garment for that category, so the demo works before every product has a real GLB.

### 7.3 2D AI Photo Try-On Pipeline (unchanged)
- Client-side: MediaPipe Pose extracts body landmarks (no server upload for detection).
- Server-side: photo + garment sent to Replicate IDM-VTON → photorealistic composite.
- Cost: ~$0.01–$0.05/generation; only recurring cost in the architecture.
- Independent of the 3D system; primary source of visual realism.

### 7.4 High-Level Data Flow
1. User registers/logs in → JWT.
2. User adjusts avatar sliders → settings persisted (slider values map to morph names).
3. User browses catalogue → product list from API.
4. User opens fitting room → avatar GLB + equipped garment GLBs fetched and loaded client-side.
5. Morph weights applied client-side, in sync, to body + every equipped garment.
6. Garments parented to the shared body (via shared shape keys / skeleton).
7. Photo try-on → Replicate → downloadable image.
8. Cart/checkout → API order + Stripe test session.

### 7.5 Data Model
```typescript
// Product (additions)
slot: { type: String, enum: ["top","bottom","footwear","hair","accessory"], required: false }
glbUrl: String
baseColor?: String

// Avatar settings (client store + backend)
interface AvatarSettings {
  system: "blender-morph";
  gender: "male" | "female";
  morphs: Record<string, number>;   // shape-key name -> weight (0..1), dynamic
  face: FaceSettings;
  equipped: { slot: string; productId: string }[];
}
```

### 7.6 ReadyPlayerMe — Discontinued, Removed From Scope
Confirmed dead (DNS NXDOMAIN). No fallback avatar system; the Blender morph-target pipeline is self-hosted and unaffected.

---

## 8. What Is Required From the Client
### Mandatory
- Stripe test-mode keys.
- Replicate account + API token (~$5–10 covers a full demo; mock until final integration).
- MongoDB (local or Atlas free tier).
- Vercel + Render accounts (deploy-time).
- GitHub repo.
- Product data OR sign-off on placeholder seed data.
- Sign-off on: stylized look, dynamic (unlimited) body sliders, predefined-garment model.

### Optional (scope expansion)
- Blender time / 3D-artist budget for more garments or more shape keys.
- Cloudinary (only if bandwidth limit hit).
- Custom domain.

### Explicitly Not Required
- No Daz3D / WEARFITS / paid 3D vendor.
- No Unity purchase.
- No live payment processor.
- No 3D artist unless expanding wardrobe.

---

## 9. AI API Usage — Full Disclosure
**Exactly one AI API: Replicate (IDM-VTON), 2D photo try-on only.**
- MediaPipe Pose = free, client-side, no AI account.
- 3D avatar reshaping = pure geometry (glTF morph targets), no ML.
- 3D clothing = pre-authored rigged assets sharing shape keys, no ML.

---

## 10. Risks & Mitigations
| Risk | Impact | Mitigation |
|---|---|---|
| Garment missing a body shape key | Medium | Authoring rule: every garment MUST include all body shape keys (same names). Validate at export. |
| Many sliders overwhelm UI | Low | Group by `group_feature` prefix → tabbed panels. |
| Blender authoring takes long per garment | Medium | Predefined scope means fewer garments needed; reuse base meshes. Budget Blender time. |
| GLB morph targets lost in export | Low | Enable "Shape Keys" in GLB export; verify in a glTF viewer before shipping. |
| Multiple GLBs cause skeleton desync | Low | `SkeletonUtils.clone` to share one skeleton. |
| Free CDN bandwidth | Low | Vercel free tier covers FYP traffic. |

---

## 11. Implementation Phases (v2)
| Phase | Work |
|---|---|
| 1. Asset authoring (go/no-go) | In Blender: build base avatar + author body shape keys (Height/Weight/Muscle/+). Export GLB; confirm morph targets load in R3F. Author 3–5 sample garments with matching shape keys. |
| 2. Runtime morph driver | `useMorphSync` hook applies slider state to body + garments. Slider panel generated from `morphTargetDictionary`, grouped by prefix. |
| 3. Garment picker + slots | Load predefined garment GLBs by slot; equip/unequip/replace; morph sync to garments; fit label. |
| 4. Face & style | Face shape keys + hair/skin pickers. |
| 5. Save/load/profile | Persist `morphs` map; reload in fitting room + profile. |
| 6. Procedural fallback & polish | Placeholder garments; loading/error states; README. |
| 7–12. (unchanged from v1) | Backend core, shop/catalogue, 2D try-on, checkout, admin, testing/docs/demo. |

**Effort note:** ~80% of the avatar/clothing effort is in Blender (modeling garments + authoring shape keys). The R3F code is small once morph targets are in the GLBs.

---

## 12. User Experience Flow (v2)
1. User lands → sees avatar in 3D viewer.
2. Opens "Customize body" → sliders appear (generated from the GLB; as many as were authored: Height, Weight, Muscle, Shoulder, Hip, Waist, Bust, Leg length…). Drag any → avatar morphs live.
3. Opens garment rail (your predefined items). Clicks one → it appears, already fitted.
4. Changes body AFTER dressing → worn garment stretches/shrinks WITH the body (shares shape keys).
5. Swaps garments; can layer (tee under blazer) if slots allow.
6. Rotates, saves look, screenshots/exports.

**Adding more unique garments:** model in Blender with the same shape keys → export GLB → drop in `public/garments/` → add one list entry. No code change; inherits fit automatically.

---

## 13. Reference Documents
- Prior v1 spec: `Virtual_Fitting_Room_Final_Technical_Spec.docx` (preserved for history; superseded on avatar/clothing by this v2).
- Avatar research report (RPM dead; Avaturn/VRoid/SMPL alternatives assessed) — see `AVATAR_PIPELINE_REPORT.md` (available on request).

*End of v2 consolidated spec.*
