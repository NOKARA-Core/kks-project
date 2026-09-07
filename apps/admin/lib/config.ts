/**
 * Konfigurasi Terpusat Komunitas KKS Timika (Admin Dashboard)
 */

export const siteConfig = {
  orgName:
    process.env.NEXT_PUBLIC_ORG_NAME ||
    "Kerukunan Keluarga Soppeng (KKS) Kabupaten Mimika",
  shortOrgName: "KKS Timika",
  
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3009",
  adminUrl: process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:3008",
  
  waChannelUrl:
    process.env.NEXT_PUBLIC_WA_CHANNEL_URL ||
    "https://whatsapp.com/channel/0029VbDSxiID38CTGypJBm3p",
  hotlineWa: process.env.NEXT_PUBLIC_HOTLINE_WA || "6281234567890",
  emailSekretariat:
    process.env.NEXT_PUBLIC_SECRETARIAT_EMAIL || "sekretariat@kks-mimika.org",

  bank: {
    name: process.env.NEXT_PUBLIC_BANK_NAME || "Bank Rakyat Indonesia (BRI)",
    accountNo: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NO || "0321-01-001234-53-9",
    accountHolder:
      process.env.NEXT_PUBLIC_BANK_ACCOUNT_HOLDER || "KKS KABUPATEN MIMIKA",
  },
};
