"use client";

import { useState } from "react";
import {
  Wand2,
  Copy,
  Check,
  Image as ImageIcon,
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
} from "lucide-react";

// ==========================================
// PRESET DEFINITIONS
// ==========================================

interface StylePreset {
  id: string;
  name: string;
  tagline: string;
  icon: typeof Camera;
  promptSnippet: string;
}

const STYLE_PRESETS: StylePreset[] = [
  {
    id: "photo",
    name: "Dokumentasi Foto Realistis",
    tagline: "Kamera 35mm, pencahayaan alami siang hari di Timika, candid hangat",
    icon: Camera,
    promptSnippet:
      "Award-winning realistic documentary photography style, captured on 35mm lens, f/2.8, natural daylight in Timika Papua, authentic friendly expressions, warm community atmosphere, lifelike skin textures, realistic depth of field, sharp focus, cinematic Indonesian diaspora gathering",
  },
  {
    id: "3d_minimal",
    name: "Ilustrasi 3D Minimalis Elegan",
    tagline: "Elemen 3D bertekstur frosted glass, palet warna Emas Soppeng & Biru",
    icon: Box,
    promptSnippet:
      "Modern 3D minimalist graphic illustration, clean geometric shapes, soft frosted glass textures, ambient occlusion, premium color palette featuring warm Bugis gold (#D97706), sky blue (#38BDF8), and pristine semi-white background, subtle soft shadows, high-end tech aesthetic, octane render",
  },
  {
    id: "poster_info",
    name: "Poster Warta & Informasi",
    tagline: "Format grafis flat berkelas, ruang kosong lapang untuk teks, anti-slop",
    icon: Megaphone,
    promptSnippet:
      "Editorial communication graphic poster, elegant flat vector art, organized layout with generous breathable negative space for typography, sophisticated color harmony, minimalist borders, high visual clarity, modern civic announcement style, balanced composition",
  },
  {
    id: "poster_lelayu",
    name: "Poster Lelayu / Takziah",
    tagline: "Nuansa damai, aksen bunga putih lembut, berwibawa & khidmat",
    icon: HeartHandshake,
    promptSnippet:
      "Solemn and dignified condolence memorial tribute banner (Salipuri Temmadinging), peaceful serene atmosphere, elegant subtle white floral accents, soft respectful lighting, pure off-white and charcoal gray canvas, dignified Bugis cultural motifs, solemn and comforting vibe, no eerie elements",
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
    description: "Website Banner, Hero, & Presentasi Layar",
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
  const [selectedStyleId, setSelectedStyleId] = useState<string>("photo");
  const [hasPhotoReference, setHasPhotoReference] = useState(false);
  const [selectedRatioId, setSelectedRatioId] = useState<string>("16_9");
  const [isCopied, setIsCopied] = useState(false);

  // Active items
  const activeStyle =
    STYLE_PRESETS.find((s) => s.id === selectedStyleId) || STYLE_PRESETS[0]!;
  const activeRatio =
    ASPECT_RATIOS.find((r) => r.id === selectedRatioId) || ASPECT_RATIOS[0]!;

  // Build real-time prompt
  const buildPrompt = () => {
    const parts: string[] = [];

    // 1. Klausul Referensi Gambar (jika aktif)
    if (hasPhotoReference) {
      parts.push(
        "IMPORTANT CONTEXT: Please strictly refer to the attached reference image below. Maintain the likeness, identity, facial features, or key environmental elements from the uploaded image while applying the following style:"
      );
    }

    // 2. Deskripsi / Ide Utama Pengguna
    const coreSubject = userInput.trim()
      ? userInput.trim()
      : "A gathering of Kerukunan Keluarga Soppeng (KKS) community members in Timika Papua, sharing warm companionship and discussing community welfare";
    parts.push(`Subject: ${coreSubject}.`);

    // 3. Preset Gaya Visual & Pencahayaan
    parts.push(`Visual Style: ${activeStyle.promptSnippet}.`);

    // 4. Parameter Rasio & Anti-Slop Guard
    const antiSlopGuard =
      "Composition & Quality: Clean composition, elegant lighting, professional look, no weird extra fingers, no distorted faces, no text clutter, anti-slop, 8k resolution, photorealistic masterpiece.";
    parts.push(antiSlopGuard);
    parts.push(`Format: ${activeRatio.promptParam}.`);

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
    setSelectedStyleId("photo");
    setHasPhotoReference(false);
    setSelectedRatioId("16_9");
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
                  Generator Konsisten
                </span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Studio peracik deskripsi gambar untuk pengurus paguyuban KKS Timika. Cukup masukkan ide singkat bahasa Indonesia, sistem menyusun prompt siap tempel untuk ChatGPT / Midjourney.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200/70 transition flex items-center gap-1.5 self-start md:self-auto shrink-0"
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
          {/* Section 1: Ide / Kalimat Utama */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center font-bold">
                  1
                </span>
                <span>Ide Kegiatan atau Objek Gambar</span>
              </label>
              <span className="text-[11px] text-slate-400">Bahasa Indonesia / Bebas</span>
            </div>

            <textarea
              rows={4}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Contoh: Pertemuan musyawarah warga Soppeng di Timika dalam suasana hangat penuh kekeluargaan, duduk bersama di balai sekretariat..."
              className="w-full p-3.5 text-sm bg-slate-50/60 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition"
            />
            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>
                Cukup tuliskan ide secara singkat. Asisten AI akan otomatis menerjemahkan dan menambahkan detail pencahayaan profesional.
              </span>
            </p>
          </div>

          {/* Section 2: Pilihan Gaya Visual */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-3">
            <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center font-bold">
                2
              </span>
              <span>Pilih Gaya Tampilan (Preset Style)</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {STYLE_PRESETS.map((preset) => {
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
                      <p
                        className={`text-xs font-bold leading-tight ${
                          isSelected ? "text-rose-900" : "text-slate-800"
                        }`}
                      >
                        {preset.name}
                      </p>
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
                  Centang opsi ini jika Anda ingin mengunggah foto tokoh/lokasi ke ChatGPT agar AI meniru wajah atau tempat tersebut secara presisi.
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
                  <strong>Instruksi Lampiran Disuntikkan:</strong> Sistem menambahkan klausul resmi agar AI wajib menjaga kemiripan wajah/lingkungan dari foto yang Anda lampirkan.
                </span>
              </div>
            )}
          </div>

          {/* Section 4: Format Rasio Gambar (Aspect Ratio) */}
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
                  Hasil Prompt Terstruktur
                </h3>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3" />
                Siap Disalin
              </span>
            </div>

            {/* Prompt Box Display */}
            <div className="relative">
              <div className="w-full p-4 rounded-lg bg-slate-50/80 border border-slate-200 font-mono text-xs text-slate-800 leading-relaxed max-h-[340px] overflow-y-auto whitespace-pre-wrap select-all">
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

            {/* 3 Langkah Mudah Panduan Pengurus */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/70 space-y-2.5">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
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
                  <strong>Tempel (Paste / Ctrl+V)</strong> teks tersebut ke kotak obrolan AI
                  {hasPhotoReference ? " dan jangan lupa lampirkan foto yang ingin Anda gunakan." : "."}
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
