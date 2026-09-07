"use client";

import { useState } from "react";
import {
  Wand2,
  Copy,
  Check,
  Sparkles,
  Camera,
  Box,
  Megaphone,
  HeartHandshake,
  Paperclip,
  Maximize2,
  HelpCircle,
  ExternalLink,
  RotateCcw,
  CheckCircle2,
  Trophy,
  Users2,
  Flame,
  Palette,
  Layers,
  Award,
  Gamepad2,
} from "lucide-react";

// ==========================================
// PRESET DEFINITIONS (10 GAYA BERVARIASI & TERKURASI)
// ==========================================

export interface StylePreset {
  id: string;
  category: "Dokumentasi & Komunitas" | "Poster Kegiatan & Lomba" | "Gaya Generasi & Kreatif" | "Warta & Takziah";
  name: string;
  tagline: string;
  icon: typeof Camera;
  promptSnippet: string;
}

export const STYLE_PRESETS: StylePreset[] = [
  // 1. Dokumentasi Foto Realistis
  {
    id: "photo_realistic",
    category: "Dokumentasi & Komunitas",
    name: "Foto Dokumenter Natural",
    tagline: "Fotografi kamera mirrorless 35mm, pencahayaan alami siang hari di Timika, candid bersahabat",
    icon: Camera,
    promptSnippet:
      "Award-winning realistic documentary photography style, captured on 35mm lens, f/2.8, natural daylight in Timika Papua, authentic friendly expressions, natural skin tones with realistic fine textures, cinematic Indonesian diaspora community gathering, documentary photojournalism style, unposed and organic, genuine human connection, true-to-life color grading, no plastic shine",
  },
  // 2. Poster Turnamen Domino & Olahraga Paguyuban
  {
    id: "poster_domino_turnamen",
    category: "Poster Kegiatan & Lomba",
    name: "Poster Turnamen Domino & Lomba",
    tagline: "Desain poster kompetisi seru, fokus meja batu domino & pion catur, pencahayaan dramatis lapang",
    icon: Gamepad2,
    promptSnippet:
      "Dynamic community sports & game tournament poster art, dramatic close-up composition focusing on classic dominoes tiles on a wooden table, intense friendly rivalry atmosphere, subtle motion blur on hands playing tiles, bold modern graphic layout with generous clean whitespace for event typography, Bugis gold (#D97706) and deep navy accents, energetic yet mature civic sports poster",
  },
  // 3. Poster Acara Silaturahmi & Musyawarah
  {
    id: "poster_silaturahmi",
    category: "Poster Kegiatan & Lomba",
    name: "Poster Kegiatan Musyawarah & Silaturahmi",
    tagline: "Komposisi grafis editorial lapang, ruang kosong pembaca lega untuk judul/jadwal/lokasi",
    icon: Trophy,
    promptSnippet:
      "High-end corporate editorial event poster design, elegant civic convention theme, spacious breathable layout with intentional negative white space reserved for typography and schedules, tasteful traditional Bugis geometric border motifs, dignified warm golden ambient lighting, modern Swiss graphic design sensibility, crisp vector precision, balanced hierarchy",
  },
  // 4. Gen Z Pop & Neo-Brutalism Bersih
  {
    id: "gen_z_vibrant",
    category: "Gaya Generasi & Kreatif",
    name: "Gen Z Neo-Brutalist Pop",
    tagline: "Warna segar energik, tipografi blok tegas, stiker grafis kekinian, clean whitespace",
    icon: Flame,
    promptSnippet:
      "Youthful Gen Z trendy visual art, clean neo-brutalist aesthetic with playful high-contrast elements, bold modern layout, subtle retro halftone dot textures, vibrant contemporary color palette with refreshing coral, sunshine yellow, and emerald accents, ample uncluttered negative space, streetwear magazine aesthetic, stylish and punchy without visual noise",
  },
  // 5. Millennial Modern Minimalist (Monocle / Kinfolk)
  {
    id: "millennial_kinfolk",
    category: "Gaya Generasi & Kreatif",
    name: "Milenial Minimalis Estetik",
    tagline: "Palet warna earthy hangat, pencahayaan lembut ala majalah Kinfolk/Monocle, sangat rapi",
    icon: Palette,
    promptSnippet:
      "Sophisticated millennial editorial aesthetic, inspired by Kinfolk and Monocle magazine photography, warm earthy neutral tones (beige, sage, terracotta, warm taupe), soft diffused morning window light, serene atmosphere, artistic negative space, clean thoughtful composition, organic linen and natural wood textures, understated luxury and calm community dignity",
  },
  // 6. Ilustrasi 3D Frosted Glass Minimalis
  {
    id: "3d_clay_glass",
    category: "Gaya Generasi & Kreatif",
    name: "Ilustrasi 3D Frosted Glass",
    tagline: "Bentuk 3D lembut semi-transparan, warna Emas Soppeng & Biru, kanvas terang lapang",
    icon: Box,
    promptSnippet:
      "High-end 3D graphic illustration with matte clay and frosted glass elements, smooth rounded geometric shapes, soft ambient occlusion, curated palette featuring Bugis gold (#D97706), sky blue (#38BDF8), and bright off-white canvas, clean breathable spatial layout, subtle soft directional shadows, premium UI design illustration, octane render",
  },
  // 7. Poster Warta & Informasi Ringkas
  {
    id: "poster_warta_flat",
    category: "Poster Kegiatan & Lomba",
    name: "Infografis & Warta Ringkas",
    tagline: "Desain visual datar flat modern, blok pembagian informasi rapi, bebas dari kepadatan",
    icon: Megaphone,
    promptSnippet:
      "Contemporary editorial infographic visual, flat modern design with clear structural zones, generous airy padding, balanced contrast, refined sans-serif typographic breathing room, civic community news bulletin format, crisp vector clarity, orderly and straightforward visual communication",
  },
  // 8. Poster Lelayu / Takziah Berwibawa
  {
    id: "poster_lelayu_solemn",
    category: "Warta & Takziah",
    name: "Poster Lelayu / Takziah Khidmat",
    tagline: "Nuansa damai dan menentang, aksen bunga putih lembut, penghormatan Salipuri Temmadinging",
    icon: HeartHandshake,
    promptSnippet:
      "Dignified condolence memorial tribute banner (Salipuri Temmadinging), peaceful serene and comforting atmosphere, pure white floral accents with subtle olive foliage, soft respectful ambient glow, muted charcoal slate and warm ivory canvas, elegant Bugis cultural respect motifs, solemn prayerful vibe, completely free of eerie or spooky elements, peaceful solace",
  },
  // 9. Foto Komunitas Golden Hour (Malam Ramah Tamah)
  {
    id: "photo_golden_hour",
    category: "Dokumentasi & Komunitas",
    name: "Foto Ramah Tamah Golden Hour",
    tagline: "Pencahayaan senja keemasan hangat, kebersamaan santap malam & silaturahmi perantau",
    icon: Users2,
    promptSnippet:
      "Intimate dusk / golden hour documentary photography, warm twilight glow illuminating smiling faces of community members, traditional Indonesian shared feast atmosphere, cozy warm bokeh in background, authentic laughter and conversation, cinematic natural color grading, Leica 50mm f/1.4 lens rendering, soul-stirring nostalgic warmth",
  },
  // 10. Grafis Retro Nostalgia Bugis Heritage
  {
    id: "retro_heritage",
    category: "Gaya Generasi & Kreatif",
    name: "Vintage Bugis Heritage Modern",
    tagline: "Sentuhan ornamen warisan Saoraja Soppeng dipadu tipografi poster modern kontemporer",
    icon: Award,
    promptSnippet:
      "Modern heritage cultural graphic poster, subtle traditional Bugis Saoraja architectural silhouettes and silk weaving patterns reimagined in clean contemporary lines, rich burgundy and antique gold hues on creamy paper texture, generous margins for clear typography, stately and culturally proud, anti-clutter, refined archival elegance",
  },
];

interface AspectRatioOption {
  id: string;
  name: string;
  ratio: string;
  promptParam: string;
  description: string;
}

const ASPECT_RATIOS: AspectRatioOption[] = [
  {
    id: "16_9",
    name: "Lanskap 16:9",
    ratio: "16:9",
    promptParam: "--ar 16:9 (Aspect Ratio 16:9 widescreen landscape)",
    description: "Website Banner, Hero, & Layar Lebar",
  },
  {
    id: "1_1",
    name: "Persegi 1:1",
    ratio: "1:1",
    promptParam: "--ar 1:1 (Aspect Ratio 1:1 square format)",
    description: "Feed Instagram, Profil, & Katalog",
  },
  {
    id: "9_16",
    name: "Potret 9:16",
    ratio: "9:16",
    promptParam: "--ar 9:16 (Aspect Ratio 9:16 vertical portrait)",
    description: "WhatsApp Story & Instagram Reels",
  },
];

export default function PromptStudioPage() {
  const [userInput, setUserInput] = useState("");
  const [selectedStyleId, setSelectedStyleId] = useState<string>("poster_domino_turnamen");
  const [hasPhotoReference, setHasPhotoReference] = useState(false);
  const [selectedRatioId, setSelectedRatioId] = useState<string>("16_9");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isCopied, setIsCopied] = useState(false);

  // Active items
  const activeStyle =
    STYLE_PRESETS.find((s) => s.id === selectedStyleId) || STYLE_PRESETS[0]!;
  const activeRatio =
    ASPECT_RATIOS.find((r) => r.id === selectedRatioId) || ASPECT_RATIOS[0]!;

  // Filtered presets by category tab
  const categories = [
    { id: "all", label: "Semua Gaya (10)" },
    { id: "Poster Kegiatan & Lomba", label: "Poster & Turnamen" },
    { id: "Gaya Generasi & Kreatif", label: "Gen Z & Milenial" },
    { id: "Dokumentasi & Komunitas", label: "Foto Dokumenter" },
    { id: "Warta & Takziah", label: "Warta & Lelayu" },
  ];

  const filteredPresets =
    categoryFilter === "all"
      ? STYLE_PRESETS
      : STYLE_PRESETS.filter((p) => p.category === categoryFilter);

  // Quick prompt fill suggestions
  const suggestions = [
    {
      title: "Turnamen Domino KKS Mimika",
      text: "Turnamen Lomba Domino Semi-Open KKS Mimika memperebutkan Piala Bergilir di Gedung Tongkonan / Balai Paguyuban, suasana kompetitif penuh tawa dan persaudaraan.",
      styleId: "poster_domino_turnamen",
    },
    {
      title: "Musyawarah Tahunan & Silaturahmi",
      text: "Musyawarah Warga Perantau Soppeng di Timika, pemaparan program kas sosial dan santunan, peserta duduk rapi di ruangan ber-AC dengan backdrop paguyuban.",
      styleId: "poster_silaturahmi",
    },
    {
      title: "Nonton Bareng & Santai Gen Z",
      text: "Pemuda-pemudi rantau generasi muda KKS berkumpul di cafe Timika dengan laptop, kopi, dan camilan santai dalam suasana nongkrong kasual kekinian.",
      styleId: "gen_z_vibrant",
    },
  ];

  // =========================================================================
  // LOGIKA ENGINE GENERATOR (ANTI AI-SLOP, HIGH WHITESPACE, NATURAL LOOK)
  // =========================================================================
  const buildPrompt = () => {
    const parts: string[] = [];

    // 1. Klausul Referensi Gambar (jika toggle aktif)
    if (hasPhotoReference) {
      parts.push(
        "IMPORTANT REFERENCE CONTEXT:\nPlease strictly reference the attached image below. Faithfully preserve the facial identity, likeness, key subject features, or physical location from the uploaded photo, while harmoniously rendering it into the visual style described below:"
      );
    }

    // 2. Deskripsi Ide Utama (Bahasa Inggris Terstruktur)
    const coreSubject = userInput.trim()
      ? userInput.trim()
      : "A lively community event of Kerukunan Keluarga Soppeng (KKS) diaspora in Timika Papua, featuring friendly gatherings, cultural camaraderie, and shared civic unity";
    parts.push(`PRIMARY SUBJECT:\n${coreSubject}.`);

    // 3. Preset Gaya Visual & Karakteristik
    parts.push(`ART DIRECTION & STYLE:\n${activeStyle.promptSnippet}.`);

    // 4. Anti-Slop Guard & Whitespace Rule (Mencegah tampilan AI Murahan)
    const antiSlopAndWhitespace =
      "COMPOSITION & ANTI-SLOP RULES:\n" +
      "1. High editorial whitespace: Ensure generous, intentional empty negative space (at least 35% of the frame) suitable for clean headline and date typography overlay without visual interference.\n" +
      "2. Natural and authentic look: Strictly avoid synthetic plastic AI skin, avoid oversaturated cartoonish neon tints, avoid generic AI clutter, and avoid surreal distorted background objects.\n" +
      "3. Anatomical accuracy: Perfectly formed human hands with exactly five fingers per hand, natural eye contact, realistic posture, and non-distorted facial structures.\n" +
      "4. Quality & Clarity: 8k resolution, authentic lighting physics, realistic depth of field, balanced visual hierarchy, tasteful color grading.";
    parts.push(antiSlopAndWhitespace);

    // 5. Format Rasio Aspek
    parts.push(`OUTPUT FORMAT:\n${activeRatio.promptParam}.`);

    return parts.join("\n\n");
  };

  const generatedPrompt = buildPrompt();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2200);
    } catch (err) {
      console.error("Gagal menyalin prompt:", err);
    }
  };

  const handleReset = () => {
    setUserInput("");
    setSelectedStyleId("poster_domino_turnamen");
    setHasPhotoReference(false);
    setSelectedRatioId("16_9");
    setCategoryFilter("all");
    setIsCopied(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-rose-50 text-rose-700 border border-rose-100">
              <Wand2 className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Prompt Studio (Asisten Gambar AI)</span>
                <span className="text-[10px] uppercase font-bold bg-amber-50 text-amber-800 border border-amber-200/60 px-2 py-0.5 rounded-md">
                  10 Preset Gaya • Anti AI-Slop
                </span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Rancang prompt visual poster kegiatan (lomba domino, silaturahmi, gaya Gen Z/Milenial). Diformulasikan dengan ruang kosong pembaca (*whitespace*) agar hasil generate tidak berantakan khas AI murahan.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200/70 transition flex items-center gap-1.5 self-start md:self-auto shrink-0 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Form</span>
        </button>
      </div>

      {/* 2-Column Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ===================================================================
            KOLOM KIRI: FORM KONTROL RAMAH PENGGUNA (7 Kolom)
            =================================================================== */}
        <div className="lg:col-span-7 space-y-5">
          {/* Section 1: Ide / Kalimat Utama & Quick Suggestions */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center font-bold">
                  1
                </span>
                <span>Ide Kegiatan, Lomba, atau Objek Gambar</span>
              </label>
              <span className="text-[11px] text-slate-400">Bahasa Indonesia Bebas</span>
            </div>

            <textarea
              rows={4}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Contoh: Turnamen Lomba Domino Semi-Open KKS Mimika di balai sekretariat, fokus batu domino berjejer di meja kayu dengan riuh tawa warga..."
              className="w-full p-3.5 text-sm bg-slate-50/60 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition"
            />

            {/* Quick Suggestion Chips */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Inspirasi Cepat Sekali Klik:
              </span>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setUserInput(sug.text);
                      setSelectedStyleId(sug.styleId);
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition cursor-pointer text-left"
                  >
                    + {sug.title}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-500 flex items-center gap-1.5 pt-1 border-t border-slate-100">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>
                Cukup ketikkan ide singkat Anda. Prompt engine kami menyuntikkan instruksi komposisi profesional agar hasilnya tampak seperti karya desainer grafis sungguhan.
              </span>
            </p>
          </div>

          {/* Section 2: Pilihan 10 Gaya Visual (Preset Style) dengan Tab Kategori */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center font-bold">
                  2
                </span>
                <span>Pilih Gaya Tampilan (10 Preset Style Terkurasi)</span>
              </label>
              <span className="text-[11px] text-slate-400">
                Pilih gaya yang paling cocok
              </span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    categoryFilter === cat.id
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Responsive Grid of Preset Cards (1-col on mobile, 2-col on sm+) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {filteredPresets.map((preset) => {
                const Icon = preset.icon;
                const isSelected = preset.id === selectedStyleId;

                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSelectedStyleId(preset.id)}
                    className={`p-3.5 rounded-lg border text-left transition-all duration-150 flex items-start gap-3 group cursor-pointer ${
                      isSelected
                        ? "bg-rose-50/50 border-rose-300 ring-1 ring-rose-400/40 shadow-xs"
                        : "bg-white hover:bg-slate-50/80 border-slate-200/80"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg shrink-0 transition-colors ${
                        isSelected
                          ? "bg-rose-600 text-white"
                          : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <p
                          className={`text-xs font-bold leading-tight truncate ${
                            isSelected ? "text-rose-900" : "text-slate-800"
                          }`}
                        >
                          {preset.name}
                        </p>
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {preset.tagline}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Toggle Lampiran Foto Referensi */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center font-bold">
                    3
                  </span>
                  <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Paperclip className="w-4 h-4 text-slate-600" />
                    Ada Foto Wajah / Lokasi Asli yang Ingin Dilampirkan?
                  </span>
                </div>
                <p className="text-xs text-slate-500 pl-7 leading-relaxed">
                  Centang opsi ini jika Anda berencana mengunggah foto wajah sesepuh, pengurus, atau lokasi sekretariat asli ke ChatGPT agar AI menirunya secara presisi.
                </p>
              </div>

              {/* Custom Switch */}
              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={hasPhotoReference}
                  onChange={(e) => setHasPhotoReference(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
              </label>
            </div>

            {hasPhotoReference && (
              <div className="mt-4 p-3 rounded-lg bg-rose-50/70 border border-rose-100 text-xs text-rose-800 flex items-center gap-2 animate-in fade-in duration-200">
                <Sparkles className="w-4 h-4 text-rose-600 shrink-0" />
                <span>
                  <strong>Instruksi Referensi Aktif:</strong> Sistem menyuntikkan klausul ketat di baris paling atas agar AI mengunci kemiripan wajah/tempat dari foto yang Anda unggah.
                </span>
              </div>
            )}
          </div>

          {/* Section 4: Format Rasio Dimensi Gambar */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-3">
            <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center font-bold">
                4
              </span>
              <span>Format Rasio Dimensi Gambar</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {ASPECT_RATIOS.map((item) => {
                const isSelected = item.id === selectedRatioId;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedRatioId(item.id)}
                    className={`p-3 rounded-lg border text-left transition-all duration-150 flex flex-col justify-between space-y-1 cursor-pointer ${
                      isSelected
                        ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                        : "bg-white hover:bg-slate-50 border-slate-200/80 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold">{item.name}</span>
                      <Maximize2
                        className={`w-3.5 h-3.5 ${
                          isSelected ? "text-white" : "text-slate-400"
                        }`}
                      />
                    </div>
                    <p
                      className={`text-[11px] leading-tight ${
                        isSelected ? "text-slate-300" : "text-slate-500"
                      }`}
                    >
                      {item.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ===================================================================
            KOLOM KANAN: LIVE PROMPT PREVIEW & SALIN BOX (5 Kolom)
            =================================================================== */}
        <div className="lg:col-span-5 space-y-5 sticky top-20">
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Hasil Prompt Terstruktur (Anti-Slop Engine)
                </h3>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3" />
                Siap Disalin
              </span>
            </div>

            {/* Prompt Box Display */}
            <div className="relative">
              <div className="w-full p-4 rounded-lg bg-slate-50/80 border border-slate-200 font-mono text-xs text-slate-800 leading-relaxed max-h-[380px] overflow-y-auto whitespace-pre-wrap select-all">
                {generatedPrompt}
              </div>
            </div>

            {/* Tombol Utama Salin Prompt (Emas Paguyuban #D97706) */}
            <button
              onClick={handleCopy}
              className={`w-full py-3.5 px-4 rounded-lg font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-md cursor-pointer ${
                isCopied
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25"
                  : "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/25 active:scale-[0.99]"
              }`}
            >
              {isCopied ? (
                <>
                  <Check className="w-5 h-5 text-white animate-in zoom-in-50 duration-150" />
                  <span>Tersalin! Siap Tempel di ChatGPT</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-white" />
                  <span>Salin Prompt ke Clipboard</span>
                </>
              )}
            </button>

            {/* Highlights Anti-Slop Protections */}
            <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-200/50 text-[11px] text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>Karakteristik Anti AI-Slop Terpasang:</span>
              </div>
              <p className="text-amber-800/90 leading-relaxed">
                Prompt otomatis mewajibkan <strong>35% negative whitespace</strong> (ruang kosong teks), pencahayaan alami tanpa kulit plastik mengkilap, dan akurasi anatomi 5 jari sempurna.
              </p>
            </div>

            {/* 3 Langkah Mudah Panduan Pengurus */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/70 space-y-2.5">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-slate-500" />
                Panduan Praktis 3 Langkah
              </h4>
              <ol className="text-xs text-slate-600 space-y-2 list-decimal list-inside leading-relaxed">
                <li>
                  Klik tombol emas <strong className="text-slate-800">"Salin Prompt ke Clipboard"</strong> di atas.
                </li>
                <li>
                  Buka layanan AI gambar (misal:{" "}
                  <a
                    href="https://chatgpt.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-rose-600 font-semibold hover:underline inline-flex items-center gap-0.5"
                  >
                    chatgpt.com
                    <ExternalLink className="w-3 h-3" />
                  </a>{" "}
                  atau Midjourney).
                </li>
                <li>
                  <strong>Tempel (Paste / Ctrl+V)</strong> teks tersebut ke obrolan AI
                  {hasPhotoReference ? " dan lampirkan foto yang ingin Anda tiru." : "."}
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
