import { useState } from "react";
import { KeyRound, Save } from "lucide-react";
import SealAvatar from "./SealAvatar";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { authApi } from "../api/endpoints";
import { extractErrorMessage } from "../utils/errors";
import { formatDate } from "../utils/format";

export default function ProfileForm() {
  const { user, refreshUser, isAdmin } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [saving, setSaving] = useState(false);

  const [pwForm, setPwForm] = useState({ old_password: "", new_password: "" });
  const [pwSaving, setPwSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await authApi.updateMe(form);
      await refreshUser();
      toast.success("Profile updated.");
    } catch (err) {
      toast.error(extractErrorMessage(err, "Could not update profile."));
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwSaving(true);
    try {
      await authApi.changePassword(pwForm);
      toast.success("Password changed successfully.");
      setPwForm({ old_password: "", new_password: "" });
    } catch (err) {
      toast.error(extractErrorMessage(err, "Could not change password."));
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <div className="card p-6 lg:col-span-1">
        <div className="flex flex-col items-center text-center">
          <SealAvatar name={user?.full_name} size="lg" tone={isAdmin ? "gold" : "brand"} />
          <p className="mt-4 font-display text-lg font-bold text-ink-800">{user?.full_name}</p>
          <p className="font-mono text-xs text-ink-400">{user?.employee_id}</p>
          <span className="badge mt-2 bg-ink-100 text-ink-600 capitalize">{user?.role}</span>
          <div className="mt-5 w-full space-y-2 border-t border-ink-100 pt-5 text-left text-sm">
            <div className="flex justify-between"><span className="text-ink-400">Department</span><span className="font-medium text-ink-700">{user?.department || "—"}</span></div>
            <div className="flex justify-between"><span className="text-ink-400">Designation</span><span className="font-medium text-ink-700">{user?.designation || "—"}</span></div>
            <div className="flex justify-between"><span className="text-ink-400">Joined</span><span className="font-medium text-ink-700">{formatDate(user?.date_of_joining)}</span></div>
          </div>
        </div>
      </div>

      <div className="space-y-5 lg:col-span-2">
        <div className="card p-6">
          <h2 className="mb-4 font-display text-base font-bold text-ink-800">Personal Information</h2>
          <form onSubmit={handleSave} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">First name</label>
              <input className="input" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
            </div>
            <div>
              <label className="label">Last name</label>
              <input className="input" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <button className="btn-primary" type="submit" disabled={saving}>
                <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>

        <div className="card p-6">
          <h2 className="mb-4 flex items-center gap-2 font-display text-base font-bold text-ink-800">
            <KeyRound className="h-4.5 w-4.5 text-brand-500" /> Change Password
          </h2>
          <form onSubmit={handlePasswordChange} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Current password</label>
              <input type="password" className="input" required value={pwForm.old_password}
                onChange={(e) => setPwForm({ ...pwForm, old_password: e.target.value })} />
            </div>
            <div>
              <label className="label">New password</label>
              <input type="password" className="input" required value={pwForm.new_password}
                onChange={(e) => setPwForm({ ...pwForm, new_password: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <button className="btn-secondary" type="submit" disabled={pwSaving}>
                {pwSaving ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
