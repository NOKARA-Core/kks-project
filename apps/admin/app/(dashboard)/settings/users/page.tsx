import { redirect } from "next/navigation";
import { requireAuthAdminUser } from "@/lib/auth";
import { getAdminUsersList } from "@/app/actions/user-actions";
import { UsersManagerClient } from "@/components/settings/UsersManagerClient";

export default async function SettingsUsersPage() {
  const currentUser = await requireAuthAdminUser();

  // Guard: Hanya superadmin yang dapat mengakses halaman ini
  if (currentUser.role !== "superadmin") {
    redirect("/settings/profile");
  }

  const users = await getAdminUsersList();

  return (
    <div className="space-y-6">
      <UsersManagerClient initialUsers={users} currentUser={currentUser} />
    </div>
  );
}
