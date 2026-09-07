"use client";

import { useState, useTransition } from "react";
import type { AdminUser } from "@repo/database";
import {
  UserPlus,
  Search,
  Shield,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Edit2,
  Lock,
  KeyRound,
  X,
  Phone,
  Mail,
  Briefcase,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { formatTanggal } from "@/lib/utils";
import {
  createAdminUser,
  updateAdminUser,
  toggleAdminUserStatus,
  resetAdminUserPassword,
} from "@/app/actions/user-actions";

interface UsersManagerClientProps {
  initialUsers: AdminUser[];
  currentUser: AdminUser;
}

export function UsersManagerClient({
  initialUsers,
  currentUser,
}: UsersManagerClientProps) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "superadmin" | "pengurus">("all");
  const [isPending, startTransition] = useTransition();

  // Toast feedback state
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Modal State: Create
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    namaLengkap: "",
    email: "",
    noWa: "",
    role: "pengurus" as "superadmin" | "pengurus",
    jabatan: "Pengurus Paguyuban",
    password: "",
  });

  // Modal State: Edit
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [editForm, setEditForm] = useState({
    namaLengkap: "",
    email: "",
    noWa: "",
    role: "pengurus" as "superadmin" | "pengurus",
    jabatan: "",
  });

  // Modal State: Reset Password
  const [resetTargetUser, setResetTargetUser] = useState<AdminUser | null>(null);
  const [newResetPassword, setNewResetPassword] = useState("");

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  };

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.namaLengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.jabatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.noWa && u.noWa.includes(searchQuery));

    const matchRole = roleFilter === "all" || u.role === roleFilter;

    return matchSearch && matchRole;
  });

  // Generate random password helper
  const handleGeneratePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
    let pwd = "";
    for (let i = 0; i < 10; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCreateForm((prev) => ({ ...prev, password: pwd }));
  };

  const handleGenerateResetPassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
    let pwd = "";
    for (let i = 0; i < 10; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewResetPassword(pwd);
  };

  // Submit Create User
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await createAdminUser(createForm);
      if (res.success && res.data) {
        setUsers((prev) => [res.data!, ...prev]);
        setIsCreateOpen(false);
        setCreateForm({
          namaLengkap: "",
          email: "",
          noWa: "",
          role: "pengurus",
          jabatan: "Pengurus Paguyuban",
          password: "",
        });
        showToast("success", res.message || "Akun pengurus berhasil dibuat.");
      } else {
        showToast("error", res.error || "Gagal membuat akun.");
      }
    });
  };

  // Open Edit Modal
  const handleOpenEdit = (user: AdminUser) => {
    setEditingUser(user);
    setEditForm({
      namaLengkap: user.namaLengkap,
      email: user.email,
      noWa: user.noWa || "",
      role: user.role,
      jabatan: user.jabatan,
    });
  };

  // Submit Edit User
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    startTransition(async () => {
      const res = await updateAdminUser({
        id: editingUser.id,
        ...editForm,
      });

      if (res.success && res.data) {
        setUsers((prev) =>
          prev.map((u) => (u.id === editingUser.id ? res.data! : u))
        );
        setEditingUser(null);
        showToast("success", res.message || "Data pengurus diperbarui.");
      } else {
        showToast("error", res.error || "Gagal memperbarui akun.");
      }
    });
  };

  // Toggle User Status
  const handleToggleStatus = (targetUser: AdminUser) => {
    if (targetUser.id === currentUser.id) {
      showToast("error", "Anda tidak dapat menonaktifkan akun Anda sendiri.");
      return;
    }

    const nextState = !targetUser.isActive;
    const confirmMsg = nextState
      ? `Aktifkan kembali akun "${targetUser.namaLengkap}"?`
      : `Nonaktifkan akun "${targetUser.namaLengkap}"? Pengurus tidak akan dapat masuk ke sistem.`;

    if (!window.confirm(confirmMsg)) return;

    startTransition(async () => {
      const res = await toggleAdminUserStatus(targetUser.id, nextState);
      if (res.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === targetUser.id ? { ...u, isActive: nextState } : u
          )
        );
        showToast("success", res.message || "Status akun diperbarui.");
      } else {
        showToast("error", res.error || "Gagal mengubah status.");
      }
    });
  };

  // Submit Reset Password
  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetTargetUser) return;

    startTransition(async () => {
      const res = await resetAdminUserPassword(
        resetTargetUser.id,
        newResetPassword
      );
      if (res.success) {
        setResetTargetUser(null);
        setNewResetPassword("");
        showToast("success", res.message || "Kata sandi berhasil direset.");
      } else {
        showToast("error", res.error || "Gagal mereset kata sandi.");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`p-4 rounded-xl border text-sm font-semibold flex items-center justify-between shadow-sm animate-in fade-in duration-150 ${
            toast.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
          <button
            onClick={() => setToast(null)}
            className="text-xs hover:underline font-bold px-2 py-1"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Control Bar: Search, Filter, & + Tambah Pengurus */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1 max-w-xl">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari pengurus, email, jabatan..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50/50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) =>
              setRoleFilter(e.target.value as "all" | "superadmin" | "pengurus")
            }
            className="px-3 py-2 text-xs sm:text-sm bg-slate-50/50 border border-slate-200 rounded-lg text-slate-700 focus:bg-white focus:outline-hidden focus:border-slate-400 transition"
          >
            <option value="all">Semua Role ({users.length})</option>
            <option value="superadmin">Superadmin</option>
            <option value="pengurus">Pengurus</option>
          </select>
        </div>

        {/* Tambah Pengurus Button */}
        <button
          onClick={() => {
            handleGeneratePassword();
            setIsCreateOpen(true);
          }}
          className="px-4 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs sm:text-sm transition shadow-xs flex items-center justify-center gap-2 shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Pengurus Baru</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-5">Nama & Kontak</th>
                <th className="py-3 px-4">Jabatan Organisasi</th>
                <th className="py-3 px-4">Hak Akses (Role)</th>
                <th className="py-3 px-4">Status Akun</th>
                <th className="py-3 px-4">Terakhir Masuk</th>
                <th className="py-3 px-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Tidak ditemukan data pengurus yang cocok dengan pencarian.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isSelf = user.id === currentUser.id;
                  const isSuperadmin = user.role === "superadmin";

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      {/* Nama & Email */}
                      <td className="py-4 px-5">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900">
                              {user.namaLengkap}
                            </span>
                            {isSelf && (
                              <span className="text-[10px] font-bold bg-slate-900 text-white px-1.5 py-0.2 rounded">
                                Anda
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span className="flex items-center gap-1 font-mono">
                              <Mail className="w-3 h-3 text-slate-400" />
                              {user.email}
                            </span>
                            {user.noWa && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1 font-mono">
                                  <Phone className="w-3 h-3 text-slate-400" />
                                  {user.noWa}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Jabatan */}
                      <td className="py-4 px-4 text-slate-700 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{user.jabatan}</span>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-4 px-4">
                        {isSuperadmin ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
                            <Shield className="w-3 h-3 text-rose-600" />
                            Superadmin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-light text-sky-dark border border-sky/30">
                            <ShieldCheck className="w-3 h-3 text-sky-dark" />
                            Pengurus
                          </span>
                        )}
                      </td>

                      {/* Status Aktif */}
                      <td className="py-4 px-4">
                        {user.isActive ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-xs">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            Aktif
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-400 font-medium text-xs">
                            <span className="w-2 h-2 rounded-full bg-slate-300" />
                            Nonaktif
                          </span>
                        )}
                      </td>

                      {/* Terakhir Masuk */}
                      <td className="py-4 px-4 text-slate-500 text-xs">
                        {user.lastLoginAt ? formatTanggal(user.lastLoginAt) : "Belum pernah"}
                      </td>

                      {/* Aksi */}
                      <td className="py-4 px-5 text-right">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          {/* Edit Button */}
                          <button
                            onClick={() => handleOpenEdit(user)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/60 transition"
                            title="Edit data pengurus"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Reset Password Button */}
                          <button
                            onClick={() => {
                              handleGenerateResetPassword();
                              setResetTargetUser(user);
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/60 transition"
                            title="Reset kata sandi"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                          </button>

                          {/* Toggle Active Status */}
                          {!isSelf && (
                            <button
                              onClick={() => handleToggleStatus(user)}
                              disabled={isPending}
                              className={`p-1.5 rounded-lg border transition ${
                                user.isActive
                                  ? "text-slate-400 hover:text-rose-600 hover:bg-rose-50 border-slate-200/60"
                                  : "text-emerald-600 hover:bg-emerald-50 border-emerald-200"
                              }`}
                              title={user.isActive ? "Nonaktifkan akun" : "Aktifkan akun"}
                            >
                              {user.isActive ? (
                                <XCircle className="w-3.5 h-3.5" />
                              ) : (
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===================================================================
          MODAL 1: TAMBAH PENGURUS BARU
          =================================================================== */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Tambah Akun Pengurus Baru
                </h3>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  value={createForm.namaLengkap}
                  onChange={(e) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      namaLengkap: e.target.value,
                    }))
                  }
                  placeholder="Contoh: H. Andi Baso Mappatunru"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Alamat Email Masuk *
                  </label>
                  <input
                    type="email"
                    required
                    value={createForm.email}
                    onChange={(e) =>
                      setCreateForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    placeholder="nama@kks-mimika.id"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Nomor WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    value={createForm.noWa}
                    onChange={(e) =>
                      setCreateForm((prev) => ({
                        ...prev,
                        noWa: e.target.value,
                      }))
                    }
                    placeholder="6281248011234"
                    className="w-full px-3 py-2 text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Hak Akses (Role) *
                  </label>
                  <select
                    value={createForm.role}
                    onChange={(e) =>
                      setCreateForm((prev) => ({
                        ...prev,
                        role: e.target.value as "superadmin" | "pengurus",
                      }))
                    }
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-hidden focus:border-slate-400"
                  >
                    <option value="pengurus">Pengurus (Kelola Warga, Warta, Kas)</option>
                    <option value="superadmin">Superadmin (Akses Penuh Sistem)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Jabatan Organisasi *
                  </label>
                  <input
                    type="text"
                    required
                    value={createForm.jabatan}
                    onChange={(e) =>
                      setCreateForm((prev) => ({
                        ...prev,
                        jabatan: e.target.value,
                      }))
                    }
                    placeholder="Sekretaris, Bendahara..."
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-hidden focus:border-slate-400"
                  />
                </div>
              </div>

              {/* Password dengan tombol auto-generate */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">
                    Kata Sandi Awal *
                  </label>
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="text-[11px] text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Acak Sandi Kuat
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={createForm.password}
                    onChange={(e) =>
                      setCreateForm((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    placeholder="Minimal 8 karakter"
                    className="w-full px-3 py-2 text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-hidden focus:border-slate-400"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Salin dan berikan kata sandi ini kepada pengurus terkait untuk masuk pertama kali.
                </p>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50"
                >
                  {isPending ? "Mendaftarkan..." : "Daftarkan Pengurus"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODAL 2: EDIT PENGURUS
          =================================================================== */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-slate-700" />
                <h3 className="font-bold text-slate-900 text-base">
                  Edit Data Pengurus: {editingUser.namaLengkap}
                </h3>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  value={editForm.namaLengkap}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      namaLengkap: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-hidden focus:border-slate-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Alamat Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-hidden focus:border-slate-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Nomor WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.noWa}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        noWa: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-hidden focus:border-slate-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Hak Akses (Role) *
                  </label>
                  <select
                    value={editForm.role}
                    disabled={editingUser.id === currentUser.id}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        role: e.target.value as "superadmin" | "pengurus",
                      }))
                    }
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-hidden focus:border-slate-400 disabled:opacity-60"
                  >
                    <option value="pengurus">Pengurus</option>
                    <option value="superadmin">Superadmin</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Jabatan Organisasi *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.jabatan}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        jabatan: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-hidden focus:border-slate-400"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs disabled:opacity-50"
                >
                  {isPending ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODAL 3: RESET KATA SANDI OLEH SUPERADMIN
          =================================================================== */}
      {resetTargetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Reset Kata Sandi Pengurus
                </h3>
              </div>
              <button
                onClick={() => setResetTargetUser(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Anda akan mereset kata sandi akun{" "}
              <strong className="text-slate-900">
                {resetTargetUser.namaLengkap}
              </strong>{" "}
              ({resetTargetUser.email}).
            </p>

            <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">
                    Kata Sandi Baru Sementara *
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateResetPassword}
                    className="text-[11px] text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Acak Sandi
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={newResetPassword}
                  onChange={(e) => setNewResetPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  className="w-full px-3 py-2 text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-hidden focus:border-slate-400"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setResetTargetUser(null)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50"
                >
                  {isPending ? "Mereset..." : "Simpan Sandi Baru"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
