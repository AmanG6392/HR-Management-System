import AppShell from "../../components/AppShell";
import ProfileForm from "../../components/ProfileForm";

export default function EmployeeProfile() {
  return (
    <AppShell title="Profile & Settings" subtitle="Manage your account details.">
      <ProfileForm />
    </AppShell>
  );
}
