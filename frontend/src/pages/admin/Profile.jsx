import AppShell from "../../components/AppShell";
import ProfileForm from "../../components/ProfileForm";

export default function AdminProfile() {
  return (
    <AppShell title="Profile & Settings" subtitle="Manage your account details.">
      <ProfileForm />
    </AppShell>
  );
}
