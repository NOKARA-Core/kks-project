"use client";

import { Megaphone, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/config";


export interface WartaBroadcastButtonProps {
  judul: string;
  kategori: "duka_cita" | "suka_cita" | "agenda_kegiatan";
  ringkasan?: string | null;
  detailLokasi?: string | null;
  kontakPic?: string | null;
  slugOrId: string;
  className?: string;
  variant?: "primary" | "compact" | "icon";
  label?: string;
}

export function WartaBroadcastButton({
  judul,
  kategori,
  ringkasan,
  detailLokasi,
  kontakPic,
  slugOrId,
  className,
  variant = "primary",
  label = "Siarkan ke WhatsApp",
}: WartaBroadcastButtonProps) {
  const handleBroadcast = () => {
    const baseUrl = siteConfig.appUrl;
    const portalUrl = `${baseUrl}/warta/${slugOrId}`;
    const lokasi = detailLokasi?.trim() || "Timika, Papua Tengah";
    const ringkasanText = ringkasan?.trim() || "";
    const pic = kontakPic?.trim();

    let message = "";

    if (kategori === "duka_cita") {
      message = [
        `🕯️ *KABAR DUKA CITA (LELAYU) — ${siteConfig.shortOrgName.toUpperCase()}*`,
        "",
        "_Inna lillahi wa inna ilaihi raji'un_",
        "",
        `*${judul.trim()}*`,
        "",
        ringkasanText ? `${ringkasanText}\n` : "",
        `📍 *Rumah Duka/Lokasi:* ${lokasi}`,
        pic ? `📞 *Kontak Keluarga:* ${pic}` : "",
        "",
        `🔗 *Warta Resmi:* ${portalUrl}`,
        "",
        `_Semoga almarhum/ah diampuni segala dosanya dan keluarga diberikan ketabahan. Salipuri Temmadinging._`,
        `*(Pengurus ${siteConfig.orgName})*`,
      ]
        .filter(Boolean)
        .join("\n");
    } else if (kategori === "agenda_kegiatan") {
      message = [
        `📢 *AGENDA & KEGIATAN WARGA — ${siteConfig.shortOrgName.toUpperCase()}*`,
        "",
        `*${judul.trim()}*`,
        "",
        ringkasanText ? `${ringkasanText}\n` : "",
        `📍 *Lokasi:* ${lokasi}`,
        pic ? `📞 *Narahubung / PIC:* ${pic}` : "",
        "",
        `🔗 *Detail Lengkap:* ${portalUrl}`,
        "",
        `*(Pengurus ${siteConfig.orgName} — Yassisoppengi)*`,
      ]
        .filter(Boolean)
        .join("\n");
    } else {
      message = [
        `🎉 *KABAR SUKACITA & SYUKURAN — ${siteConfig.shortOrgName.toUpperCase()}*`,
        "",
        `*${judul.trim()}*`,
        "",
        ringkasanText ? `${ringkasanText}\n` : "",
        `📍 *Lokasi:* ${lokasi}`,
        pic ? `📞 *Narahubung:* ${pic}` : "",
        "",
        `🔗 *Selengkapnya:* ${portalUrl}`,
        "",
        `*(Pengurus ${siteConfig.orgName})*`,
      ]
        .filter(Boolean)
        .join("\n");
    }

    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleBroadcast}
        className={cn(
          "p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200 hover:border-emerald-600 transition-all duration-150 shadow-xs",
          className
        )}
        title="Siarkan ke WhatsApp"
      >
        <Megaphone className="w-3.5 h-3.5" />
      </button>
    );
  }

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={handleBroadcast}
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs hover:shadow active:scale-95",
          className
        )}
        title="Siarkan ke Saluran / Grup WhatsApp"
      >
        <Megaphone className="w-3.5 h-3.5" />
        <span>{label}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleBroadcast}
      className={cn(
        "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-150 shadow-md shadow-emerald-600/20 active:scale-95",
        className
      )}
    >
      <Megaphone className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
}
