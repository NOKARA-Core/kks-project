export function formatRupiah(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined || amount === "") return "Rp 0";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatNominal(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined || amount === "") return "0";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "0";
  return new Intl.NumberFormat("id-ID").format(num);
}

export function parseRupiahInput(value: string): number {
  const clean = value.replace(/[^0-9]/g, "");
  return clean ? parseInt(clean, 10) : 0;
}

export function formatTanggal(dateStr: string | Date | null | undefined): string {
  if (!dateStr) return "-";
  const d = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
  if (isNaN(d.getTime())) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

export function formatWhatsAppUrl(phone: string, text?: string): string {
  let cleaned = phone.replace(/[^0-9]/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.slice(1);
  }
  const baseUrl = `https://wa.me/${cleaned}`;
  return text ? `${baseUrl}?text=${encodeURIComponent(text)}` : baseUrl;
}
