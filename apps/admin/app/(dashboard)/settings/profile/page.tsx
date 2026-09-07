import { getCurrentAdminUser } from "@/lib/auth";
import { ProfileSettingsForm } from "@/components/settings/ProfileSettingsForm";

export default async function ProfileSettingsPage() {
  const currentUser = await getCurrentAdminUser();

  return (
    <div className="max-w-4xl space-y-6">
      <ProfileSettingsForm user={currentUser} />
    </div>
  );
}
