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
  Award,
  Gamepad2,
  Plus,
  Trash2,
  Type,
  LayoutGrid,
  Calendar,
  MapPin,
  FileText,
} from "lucide-react";
import { siteConfig } from "@/lib/config";


// ==========================================
// 1. PRESET DEFINITIONS (10 GAYA VISUAL)
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
    tagline: "Desain poster turnamen siap pakai lengkap layout judul, bracket kompetisi, & detail acara",
    icon: Gamepad2,
    promptSnippet:
      "Complete finished graphic design tournament poster artwork, official sports championship event flyer composition. Features prominent bold distressed athletic tournament typography reading the event title at top header, realistic wooden dominoes tiles in action focal point, clean event badge badges, dedicated footer section for tournament date, venue in Timika, and registration info, bold Swiss graphic hierarchy, dramatic warm rim lighting, high-contrast tournament branding, zero clutter",
  },
  // 3. Poster Acara Silaturahmi & Musyawarah
  {
    id: "poster_silaturahmi",
    category: "Poster Kegiatan & Lomba",
    name: "Poster Kegiatan Musyawarah & Silaturahmi",
    tagline: "Poster resmi acara organisasi lengkap header judul, tanggal, ornamen Bugis, & layout rapi",
    icon: Trophy,
    promptSnippet:
      "Official finished event announcement poster design, high-end corporate civic summit layout. Features a dignified header banner with elegant bold typography for the convention title, tasteful Bugis Saoraja geometric filigree accents, structured clean content cards for meeting agenda, date, time, and hall location, professional executive layout with ample clean white space, warm golden ambient lighting, balanced modern Swiss typography, ready-to-print gala invitation flyer",
  },
  // 4. Gen Z Pop & Neo-Brutalism Bersih
  {
    id: "gen_z_vibrant",
    category: "Gaya Generasi & Kreatif",
    name: "Gen Z Neo-Brutalist Pop",
    tagline: "Poster gaya streetwear kekinian, tipografi blok tebal, stiker grafis dinamis, layout majalah",
    icon: Flame,
    promptSnippet:
      "Complete modern youth event poster design in trendy Neo-Brutalist graphic style. Features oversized bold grotesque sans-serif title typography across the top, high-contrast blocky layout containers, playful graphic badge stickers, barcode and date stamp graphic accents, refreshing vibrant color blocking, streetwear culture festival flyer aesthetic, perfectly aligned modular layout, ultra-crisp vector shapes",
  },
  // 5. Millennial Modern Minimalist (Monocle / Kinfolk)
  {
    id: "millennial_kinfolk",
    category: "Gaya Generasi & Kreatif",
    name: "Milenial Minimalis Estetik",
    tagline: "Poster editorial artistik ala majalah Kinfolk/Monocle, tipografi elegan, sangat lapang & rapi",
    icon: Palette,
    promptSnippet:
      "High-end editorial exhibition poster design, inspired by Kinfolk and Monocle art direction. Features refined serif headline typography, generous intentional breathable white margins, minimalist layout with subtle thin line dividers, warm earthy neutral tones (terracotta, sage, cream), soft natural morning light, serene community lifestyle flyer aesthetic, understated luxury and calm dignity",
  },
  // 6. Ilustrasi 3D Frosted Glass Minimalis
  {
    id: "3d_clay_glass",
    category: "Gaya Generasi & Kreatif",
    name: "Ilustrasi 3D Frosted Glass",
    tagline: "Poster teknologi/kreatif dengan elemen 3D clay & kaca semi-transparan, warna Emas & Biru",
    icon: Box,
    promptSnippet:
      "Modern 3D promotional event poster design featuring tactile matte clay and frosted glass elements. Features bold modern floating typography for the event title, soft rounded 3D community icons, premium UI card layout displaying event date and details, curated palette featuring Bugis gold (#D97706) and sky blue (#38BDF8) on clean off-white canvas, subtle ambient shadows, octane render poster layout",
  },
  // 7. Poster Warta & Informasi Ringkas
  {
    id: "poster_warta_flat",
    category: "Poster Kegiatan & Lomba",
    name: "Infografis & Warta Ringkas",
    tagline: "Poster selebaran pengumuman ringkas, blok informasi modular teratur, sangat mudah dibaca",
    icon: Megaphone,
    promptSnippet:
      "Complete official civic bulletin poster design, clean modern flat infographic layout. Features clear high-contrast header for announcement title, neatly separated infographic panels for key points, dates, and contacts, clean sans-serif typography, crisp icons and bullet points, zero visual noise, professional municipal community notice flyer format",
  },
  // 8. Poster Lelayu / Takziah Berwibawa
  {
    id: "poster_lelayu_solemn",
    category: "Warta & Takziah",
    name: "Poster Lelayu / Takziah Khidmat",
    tagline: "Poster duka cita resmi paguyuban, ornamen khidmat, tempat foto almarhum/ah & doa Salipuri",
    icon: HeartHandshake,
    promptSnippet:
      "Dignified finished bereavement condolence tribute poster design (Salipuri Temmadinging). Features respectful calligraphy header 'Innalillahi Wa Inna Ilaihi Rajiun' and memorial title, dedicated central ornate frame reserved for portrait photo, elegant subtle Bugis cultural respect motifs, soft white floral accents, muted charcoal and warm ivory backdrop, solemn prayerful layout, peace and solace flyer design",
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
    tagline: "Poster budaya warisan klasik Bugis modern, motif sutra Saoraja, tipografi berwibawa",
    icon: Award,
    promptSnippet:
      "Archival cultural heritage festival poster design. Features stately vintage serif headline typography, traditional Bugis Saoraja architectural silhouettes and authentic silk weaving patterns in clean contemporary lines, rich burgundy and antique gold hues on creamy textured paper canvas, structured ceremonial event flyer layout, timeless historical prestige",
  },
];

// ==========================================
// 2. COLOR PALETTE TEMPLATES (DEFAULT + 4 LAINNYA + KUSTOM)
// ==========================================

export interface ColorPalette {
  id: string;
  name: string;
  tagline: string;
  swatches: string[];
  promptInstruction: string;
}

export const PRESET_COLOR_PALETTES: ColorPalette[] = [
  {
    id: "default_kks",
    name: "Default (Emas Soppeng & Merah Siri')",
    tagline: "Emas keagungan (#D97706), Merah siri' (#DC2626), dan Biru Papua (#38BDF8)",
    swatches: ["#D97706", "#DC2626", "#38BDF8", "#0F172A", "#FFFFFF"],
    promptInstruction:
      "Color Palette: Harmonious civic palette with warm Bugis gold (#D97706), dignified crimson red (#DC2626), serene sky blue (#38BDF8), contrasted against elegant slate charcoal (#0F172A) and bright clean off-white (#FFFFFF)",
  },
  {
    id: "earthy_kinfolk",
    name: "Earthy Warm Neutral (Milenial)",
    tagline: "Terracotta hangat, sage green alami, beige pasir lembut, dan warm cream",
    swatches: ["#C27D56", "#8F9E8B", "#D9CAB3", "#F6F1EB", "#2C3531"],
    promptInstruction:
      "Color Palette: Sophisticated earthy neutral palette featuring warm terracotta clay (#C27D56), gentle botanical sage green (#8F9E8B), soft sandy linen beige (#D9CAB3), airy off-white canvas, and deep grounding espresso charcoal",
  },
  {
    id: "gen_z_cyber",
    name: "Gen Z Energetic Vibrant",
    tagline: "Coral neon segar, electric indigo, cyber lime, dan pure paper white",
    swatches: ["#FF6B6B", "#4F46E5", "#10B981", "#FACC15", "#18181B"],
    promptInstruction:
      "Color Palette: High-energy Gen Z youth palette featuring fresh coral orange (#FF6B6B), bold electric indigo (#4F46E5), lively mint emerald (#10B981), and energetic sunflower yellow (#FACC15) with crisp clean contrast",
  },
  {
    id: "royal_heritage",
    name: "Kerajaan Soppeng (Royal Maroon & Gold)",
    tagline: "Maroon sutra tua, emas antik, ivory sutra, dan charcoal wibawa",
    swatches: ["#7F1D1D", "#B45309", "#FDE68A", "#1E293B", "#FAFAF9"],
    promptInstruction:
      "Color Palette: Regal heritage palette inspired by Bugis royal silk court, rich deep maroon (#7F1D1D), antique burnished gold (#B45309), soft silk ivory (#FDE68A), stately deep charcoal slate, and clean warm paper white",
  },
  {
    id: "monochrome_editorial",
    name: "Editorial Monochrome Minimalis",
    tagline: "Hitam arang elegan, abu-abu perak lembut, dan kanvas putih susu lapang",
    swatches: ["#0F172A", "#64748B", "#CBD5E1", "#F8FAFC", "#FFFFFF"],
    promptInstruction:
      "Color Palette: Pure timeless monochrome editorial palette with rich deep ink black (#0F172A), balanced architectural cool slates (#64748B, #CBD5E1), and spacious brilliant off-white canvas with subtle tonal contrast",
  },
];

// ==========================================
// 3. ASPECT RATIO DEFINITIONS
// ==========================================

interface AspectRatioOption {
  id: string;
  name: string;
  ratio: string;
  promptParam: string;
  description: string;
}

const ASPECT_RATIOS: AspectRatioOption[] = [
  {
    id: "4_5",
    name: "Poster Vertikal 4:5",
    ratio: "4:5",
    promptParam: "--ar 4:5 (Standard Event Poster ratio 4:5 vertical print & social feed)",
    description: "Format Ideal Cetak Poster & Flyer Event",
  },
  {
    id: "9_16",
    name: "Story / Banner 9:16",
    ratio: "9:16",
    promptParam: "--ar 9:16 (Aspect Ratio 9:16 vertical portrait)",
    description: "WhatsApp Story, Banner Berdiri, & Reels",
  },
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
];

export default function PromptStudioPage() {
  const [userInput, setUserInput] = useState("");
  const [selectedStyleId, setSelectedStyleId] = useState<string>("poster_domino_turnamen");
  const [hasPhotoReference, setHasPhotoReference] = useState(false);
  const [selectedRatioId, setSelectedRatioId] = useState<string>("4_5");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isCopied, setIsCopied] = useState(false);

  // Palet Warna State
  const [selectedPaletteId, setSelectedPaletteId] = useState<string>("default_kks");
  const [customColors, setCustomColors] = useState<string[]>(["#DC2626", "#D97706", "#0F172A", "#FFFFFF"]);
  const [customPaletteNotes, setCustomPaletteNotes] = useState<string>("Warna Emas dan Merah dengan latar bersih");

  // Mode Poster & Elemen Tipografi
  const [isPosterMode, setIsPosterMode] = useState(true);
  const [posterTitle, setPosterTitle] = useState("TURNAMEN DOMINO KKS MIMIKA 2026");
  const [posterSubtitle, setPosterSubtitle] = useState("Ajang Silaturahmi & Asah Taktik Perantau Soppeng");
  const [posterDateVenue, setPosterDateVenue] = useState("Sabtu - Minggu, 15-16 Oktober 2026 • Gedung Tongkonan Timika");
  const [posterOrganizer, setPosterOrganizer] = useState(siteConfig.orgName);


  // Active items
  const activeStyle =
    STYLE_PRESETS.find((s) => s.id === selectedStyleId) || STYLE_PRESETS[0]!;
  const activeRatio =
    ASPECT_RATIOS.find((r) => r.id === selectedRatioId) || ASPECT_RATIOS[0]!;
  const activePresetPalette =
    PRESET_COLOR_PALETTES.find((p) => p.id === selectedPaletteId) || PRESET_COLOR_PALETTES[0]!;

  // Category list
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

  // Quick suggestions
  const suggestions = [
    {
      title: "Turnamen Domino KKS Mimika",
      text: "Turnamen Lomba Domino Semi-Open KKS Mimika memperebutkan Piala Bergilir di Gedung Tongkonan / Balai Paguyuban, suasana kompetitif penuh tawa dan persaudaraan.",
      styleId: "poster_domino_turnamen",
      paletteId: "default_kks",
      ratioId: "4_5",
      titleText: "TURNAMEN DOMINO KKS MIMIKA 2026",
      subtitleText: "Ajang Silaturahmi & Asah Taktik Perantau Soppeng - Total Hadiah Rp 15 Juta",
      dateVenueText: "15 - 16 Oktober 2026 • Balai Paguyuban KKS Timika",
      organizerText: "Kerukunan Keluarga Soppeng (KKS) Kab. Mimika",
    },
    {
      title: "Musyawarah Tahunan & Silaturahmi",
      text: "Musyawarah Warga Perantau Soppeng di Timika, pemaparan program kas sosial dan santunan, peserta duduk rapi di ruangan ber-AC dengan backdrop paguyuban.",
      styleId: "poster_silaturahmi",
      paletteId: "royal_heritage",
      ratioId: "4_5",
      titleText: "MUSYAWARAH BESAR & SILATURAHMI TAHUNAN",
      subtitleText: "Mempererat Siri' Na Pesse di Tanah Rantau Mimika",
      dateVenueText: "Minggu, 22 November 2026 • Hotel Grand Mozza Timika",
      organizerText: "Pengurus BPH Kerukunan Keluarga Soppeng (KKS)",
    },
    {
      title: "Nonton Bareng & Santai Gen Z",
      text: "Pemuda-pemudi rantau generasi muda KKS berkumpul di cafe Timika dengan laptop, kopi, dan camilan santai dalam suasana nongkrong kasual kekinian.",
      styleId: "gen_z_vibrant",
      paletteId: "gen_z_cyber",
      ratioId: "4_5",
      titleText: "KKS YOUTH HANGOUT & CREATIVE MEETUP",
      subtitleText: "Temu Kreatif Pemuda Rantau • Diskusi, Kopi, & Kolaborasi",
      dateVenueText: "Jumat Malam, 28 Oktober 2026 • Cafe Titik Temu Timika",
      organizerText: "Divisi Kepemudaan & Media Kreatif KKS Mimika",
    },
  ];

  // Helper untuk menambahkan warna custom
  const handleAddCustomColor = () => {
    if (customColors.length < 6) {
      setCustomColors([...customColors, "#2563EB"]);
    }
  };

  const handleUpdateCustomColor = (index: number, newColor: string) => {
    const updated = [...customColors];
    updated[index] = newColor;
    setCustomColors(updated);
  };

  const handleRemoveCustomColor = (index: number) => {
    if (customColors.length > 2) {
      setCustomColors(customColors.filter((_, i) => i !== index));
    }
  };

  // =========================================================================
  // LOGIKA ENGINE GENERATOR (ANTI AI-SLOP, HIGH WHITESPACE, NATURAL LOOK)
  // =========================================================================
  const buildPrompt = () => {
    const parts: string[] = [];

    // 1. Klausul Referensi Gambar (jika toggle aktif)
    if (hasPhotoReference) {
      parts.push(
        "IMPORTANT REFERENCE CONTEXT:\nPlease strictly reference the attached image below. Faithfully preserve the facial identity, likeness, key subject features, or physical location from the uploaded photo, while harmoniously rendering it into the visual layout described below:"
      );
    }

    // 2. Tipe Dokumen / Output Medium (KUNCI AGAR TIDAK HANYA GAMBAR POLOS)
    if (isPosterMode) {
      parts.push(
        "DELIVERABLE FORMAT - OFFICIAL FINISHED POSTER DESIGN:\n" +
        "You must generate a complete, publication-ready graphic event poster artwork (not just a standalone background illustration or raw photo). " +
        "The final image must be formatted as a complete promotional event poster with integrated graphic typography hierarchy, header section, central hero artwork, and clean structured event details at the bottom."
      );

      // Injeksi Teks & Tata Letak Tipografi Poster
      const typographySpecs: string[] = [];
      if (posterTitle.trim()) {
        typographySpecs.push(`- Main Header Title: "${posterTitle.trim()}" in bold, prominent, high-contrast display lettering`);
      }
      if (posterSubtitle.trim()) {
        typographySpecs.push(`- Subtitle Tagline: "${posterSubtitle.trim()}" in clean secondary typographic font`);
      }
      if (posterDateVenue.trim()) {
        typographySpecs.push(`- Schedule & Location Badge: "${posterDateVenue.trim()}" displayed inside a dedicated clean badge/ribbon container`);
      }
      if (posterOrganizer.trim()) {
        typographySpecs.push(`- Organizer Branding: "${posterOrganizer.trim()}" at the top or bottom footer banner`);
      }

      if (typographySpecs.length > 0) {
        parts.push(
          "POSTER TYPOGRAPHY & TEXT SPECIFICATION (RENDER VISIBLE TEXT):\n" +
          typographySpecs.join("\n") + "\n" +
          "- Typography Rule: All text rendered on the poster must be clear, crisp, properly spelled, balanced in visual hierarchy, and completely legible without messy distortion."
        );
      }
    } else {
      parts.push(
        "DELIVERABLE FORMAT - EDITORIAL VISUAL COMPOSITION:\n" +
        "Generate a clean visual composition with spacious negative breathing room reserved for manual typography overlay by human graphic designers."
      );
    }

    // 3. Deskripsi Ide Utama (Bahasa Inggris Terstruktur)
    const coreSubject = userInput.trim()
      ? userInput.trim()
      : "A lively community event of Kerukunan Keluarga Soppeng (KKS) diaspora in Timika Papua, featuring friendly gatherings, cultural camaraderie, and shared civic unity";
    parts.push(`PRIMARY VISUAL THEME & SCENE:\n${coreSubject}.`);

    // 4. Preset Gaya Visual & Karakteristik
    parts.push(`ART DIRECTION & POSTER STYLE:\n${activeStyle.promptSnippet}.`);

    // 5. Color Palette Directive (Default, Preset, atau Custom)
    if (selectedPaletteId === "custom") {
      const hexList = customColors.join(", ");
      const customInstruction = `Custom Color Palette: Curated custom palette focusing on hex codes (${hexList})${
        customPaletteNotes.trim() ? ` with design mood: ${customPaletteNotes.trim()}` : ""
      }, maintaining balanced contrast, generous bright background space, and non-jarring color harmony`;
      parts.push(`COLOR PALETTE DIRECTIVE:\n${customInstruction}.`);
    } else {
      parts.push(`COLOR PALETTE DIRECTIVE:\n${activePresetPalette.promptInstruction}.`);
    }

    // 6. Anti-Slop Guard & Whitespace Rule (Mencegah tampilan AI Murahan)
    const antiSlopAndWhitespace =
      "COMPOSITION & ANTI-SLOP RULES:\n" +
      (isPosterMode
        ? "1. Professional graphic layout: Maintain balanced Swiss editorial alignment, generous padding around text margins, and distinct separation between visual artwork and text areas.\n"
        : "1. High editorial whitespace: Ensure generous, intentional empty negative space (at least 35% of the frame) suitable for clean headline and date typography overlay without visual interference.\n") +
      "2. Natural and authentic look: Strictly avoid synthetic plastic AI skin, avoid oversaturated cartoonish neon tints, avoid generic AI clutter, and avoid surreal distorted background objects.\n" +
      "3. Anatomical accuracy: Perfectly formed human hands with exactly five fingers per hand, natural eye contact, realistic posture, and non-distorted facial structures.\n" +
      "4. Quality & Clarity: 8k resolution, authentic lighting physics, realistic depth of field, balanced visual hierarchy, tasteful color grading.";
    parts.push(antiSlopAndWhitespace);

    // 7. Format Rasio Aspek
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
    setSelectedPaletteId("default_kks");
    setHasPhotoReference(false);
    setSelectedRatioId("4_5");
    setIsPosterMode(true);
    setPosterTitle("TURNAMEN DOMINO KKS MIMIKA 2026");
    setPosterSubtitle("Ajang Silaturahmi & Asah Taktik Perantau Soppeng");
    setPosterDateVenue("Sabtu - Minggu, 15-16 Oktober 2026 • Gedung Tongkonan Timika");
    setPosterOrganizer(siteConfig.orgName);
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
                  10 Preset Gaya • Color Palettes
                </span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Rancang prompt visual poster kegiatan (lomba domino, silaturahmi, gaya Gen Z/Milenial). Diformulasikan dengan ruang kosong pembaca (*whitespace*) dan palet warna terkurasi agar hasil generate tidak berantakan khas AI murahan.
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
                      setSelectedPaletteId(sug.paletteId);
                      setSelectedRatioId(sug.ratioId);
                      setIsPosterMode(true);
                      setPosterTitle(sug.titleText);
                      setPosterSubtitle(sug.subtitleText);
                      setPosterDateVenue(sug.dateVenueText);
                      setPosterOrganizer(sug.organizerText);
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition cursor-pointer text-left"
                  >
                    + {sug.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Mode Pembuatan: Poster Lengkap vs Gambar Saja */}
            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-rose-600" />
                    Format Poster Kegiatan Lengkap (Ada Judul & Teks)
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Jika aktif, AI akan merender <strong>poster utuh siap tayang</strong> dengan tipografi judul, tanggal, dan nama paguyuban.
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={isPosterMode}
                    onChange={(e) => setIsPosterMode(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                </label>
              </div>

              {/* Form Input Detail Teks Poster jika Mode Poster Aktif */}
              {isPosterMode && (
                <div className="mt-3 p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Type className="w-3.5 h-3.5 text-slate-600" />
                      Detail Teks / Tipografi yang Tampil di Poster:
                    </span>
                    <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded font-semibold">
                      Terbaca di Poster AI
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[11px] font-semibold text-slate-700 flex items-center gap-1">
                        <span>1. Judul Utama Poster (Header Title):</span>
                      </label>
                      <input
                        type="text"
                        value={posterTitle}
                        onChange={(e) => setPosterTitle(e.target.value)}
                        placeholder="Contoh: TURNAMEN DOMINO KKS MIMIKA 2026"
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md text-slate-900 font-bold focus:outline-hidden focus:border-slate-500"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[11px] font-semibold text-slate-700 flex items-center gap-1">
                        <span>2. Subjudul / Tema / Hadiah (Subtitle Tagline):</span>
                      </label>
                      <input
                        type="text"
                        value={posterSubtitle}
                        onChange={(e) => setPosterSubtitle(e.target.value)}
                        placeholder="Contoh: Ajang Silaturahmi & Asah Taktik - Total Hadiah Rp 15 Juta"
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md text-slate-800 focus:outline-hidden focus:border-slate-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-700 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        <span>3. Waktu & Lokasi Kegiatan:</span>
                      </label>
                      <input
                        type="text"
                        value={posterDateVenue}
                        onChange={(e) => setPosterDateVenue(e.target.value)}
                        placeholder="Contoh: 15-16 Oktober 2026 • Gedung Tongkonan Timika"
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md text-slate-800 focus:outline-hidden focus:border-slate-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-700 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span>4. Penyelenggara / Paguyuban:</span>
                      </label>
                      <input
                        type="text"
                        value={posterOrganizer}
                        onChange={(e) => setPosterOrganizer(e.target.value)}
                        placeholder="Contoh: Kerukunan Keluarga Soppeng (KKS) Kab. Mimika"
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md text-slate-800 focus:outline-hidden focus:border-slate-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-500 flex items-center gap-1.5 pt-1 border-t border-slate-100">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>
                {isPosterMode
                  ? "Mode Poster Aktif: Prompt yang dihasilkan akan memerintahkan AI merancang layout poster acara lengkap dengan blok judul, tema, dan jadwal."
                  : "Mode Gambar Murni: AI hanya akan menghasilkan gambar visual tanpa teks, menyisakan ruang lapang (whitespace) untuk Anda tambahkan teks manual."}
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

            {/* Responsive Grid of Preset Cards */}
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

          {/* ===================================================================
              Section 3: Template Palet Warna (Default + 4 Template + Custom)
              =================================================================== */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center font-bold">
                  3
                </span>
                <span>Template Palet Warna (Color Palette)</span>
              </label>
              <span className="text-[11px] text-slate-400">
                Default & 4 Opsi + Kustom
              </span>
            </div>

            {/* List 5 Palet Template (Default + 4 Lainnya) */}
            <div className="space-y-2.5">
              {PRESET_COLOR_PALETTES.map((palette) => {
                const isSelected = selectedPaletteId === palette.id;

                return (
                  <div
                    key={palette.id}
                    onClick={() => setSelectedPaletteId(palette.id)}
                    className={`p-3.5 rounded-lg border text-left transition-all duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? "bg-rose-50/50 border-rose-300 ring-1 ring-rose-400/40 shadow-xs"
                        : "bg-white hover:bg-slate-50 border-slate-200/80"
                    }`}
                  >
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="color_palette_choice"
                          checked={isSelected}
                          onChange={() => setSelectedPaletteId(palette.id)}
                          className="text-rose-600 focus:ring-rose-500 h-4 w-4 border-slate-300"
                        />
                        <span
                          className={`text-xs font-bold truncate ${
                            isSelected ? "text-rose-950" : "text-slate-800"
                          }`}
                        >
                          {palette.name}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 pl-6 line-clamp-1">
                        {palette.tagline}
                      </p>
                    </div>

                    {/* Swatches Visual */}
                    <div className="flex items-center gap-1.5 pl-6 sm:pl-0 shrink-0">
                      {palette.swatches.map((color, cIdx) => (
                        <span
                          key={cIdx}
                          title={color}
                          style={{ backgroundColor: color }}
                          className="w-5 h-5 rounded-md border border-black/10 shadow-2xs inline-block"
                        />
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Opsi Palet Kustom (Custom Color Palette) */}
              <div
                onClick={() => setSelectedPaletteId("custom")}
                className={`p-3.5 rounded-lg border text-left transition-all duration-150 space-y-3 cursor-pointer ${
                  selectedPaletteId === "custom"
                    ? "bg-rose-50/50 border-rose-300 ring-1 ring-rose-400/40 shadow-xs"
                    : "bg-white hover:bg-slate-50 border-slate-200/80"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="color_palette_choice"
                      checked={selectedPaletteId === "custom"}
                      onChange={() => setSelectedPaletteId("custom")}
                      className="text-rose-600 focus:ring-rose-500 h-4 w-4 border-slate-300"
                    />
                    <span
                      className={`text-xs font-bold ${
                        selectedPaletteId === "custom"
                          ? "text-rose-950"
                          : "text-slate-800"
                      }`}
                    >
                      Palet Warna Kustom (Tambahan Admin)
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded">
                    Admin Custom
                  </span>
                </div>

                {selectedPaletteId === "custom" && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="pl-6 space-y-3 pt-1 animate-in fade-in duration-150"
                  >
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Pilih warna-warna spesifik yang ingin Anda tekankan dalam desain poster (klik kotak warna untuk mengubah):
                    </p>

                    {/* Color pickers list */}
                    <div className="flex flex-wrap items-center gap-3">
                      {customColors.map((color, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1.5 p-1.5 rounded-md bg-slate-50 border border-slate-200"
                        >
                          <input
                            type="color"
                            value={color}
                            onChange={(e) => handleUpdateCustomColor(idx, e.target.value)}
                            className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                            title="Klik untuk memilih warna"
                          />
                          <span className="font-mono text-[11px] text-slate-700 uppercase font-semibold">
                            {color}
                          </span>
                          {customColors.length > 2 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveCustomColor(idx)}
                              className="text-slate-400 hover:text-rose-600 p-0.5 rounded transition cursor-pointer"
                              title="Hapus warna ini"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}

                      {customColors.length < 6 && (
                        <button
                          type="button"
                          onClick={handleAddCustomColor}
                          className="px-3 py-1.5 rounded-md border border-dashed border-slate-300 hover:border-slate-400 text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center gap-1.5 transition bg-white cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Tambah Warna</span>
                        </button>
                      )}
                    </div>

                    {/* Catatan / Keterangan mood warna */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-600">
                        Catatan Suasana Warna (Opsional):
                      </label>
                      <input
                        type="text"
                        value={customPaletteNotes}
                        onChange={(e) => setCustomPaletteNotes(e.target.value)}
                        placeholder="Contoh: Nuansa hangat bersahabat dengan kontras tajam..."
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md text-slate-800 focus:outline-hidden focus:border-slate-400"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 4: Toggle Lampiran Foto Referensi */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center font-bold">
                    4
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

          {/* Section 5: Format Rasio Dimensi Gambar */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-3">
            <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center font-bold">
                5
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

            {/* Highlights Anti-Slop Protections, Poster Layout & Color Directive */}
            <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-200/50 text-[11px] text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>
                  {isPosterMode ? "Mode Poster Acara Resmi Aktif:" : "Karakteristik Anti AI-Slop & Warna:"}
                </span>
              </div>
              <p className="text-amber-800/90 leading-relaxed">
                {isPosterMode ? (
                  <>
                    AI diperintahkan menghasilkan <strong>desain poster publikasi utuh</strong> lengkap dengan teks judul, jadwal acara, palet warna terkontrol, dan tata letak Swiss grafis yang seimbang (bukan sekadar ilustrasi gambar mentah).
                  </>
                ) : (
                  <>
                    Prompt mewajibkan <strong>35% negative whitespace</strong>, palet warna terkontrol, pencahayaan alami tanpa kulit plastik, dan akurasi anatomi 5 jari sempurna untuk ditambahi teks manual.
                  </>
                )}
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
