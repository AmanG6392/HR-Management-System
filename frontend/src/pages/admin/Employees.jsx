import { useEffect, useState } from "react";
import { Plus, Search, Trash2, Edit2, Users } from "lucide-react";
import AppShell from "../../components/AppShell";
import { PageLoader } from "../../components/Spinner";
import EmptyState from "../../components/EmptyState";
import Modal from "../../components/Modal";
import ConfirmDialog from "../../components/ConfirmDialog";
import SealAvatar from "../../components/SealAvatar";
import { employeesApi } from "../../api/endpoints";
import { useToast } from "../../context/ToastContext";
import { extractErrorMessage } from "../../utils/errors";
import { formatDate } from "../../utils/format";

const emptyForm = {
  username: "", email: "", first_name: "", last_name: "", password: "",
  role: "employee", phone: "", department: "", designation: "", date_of_joining: "",
};

export default function AdminEmployees() {
  const toast = useToast();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = (params = {}) => {
    setLoading(true);
    employeesApi
      .list(params)
      .then((res) => setEmployees(res.data.results ?? res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const t = setTimeout(() => load(search ? { search } : {}), 300);
    return () => clearTimeout(t);
  }, [search]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (emp) => {
    setEditing(emp);
    setForm({ ...emptyForm, ...emp, password: "" });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        const { password, username, ...rest } = form;
        await employeesApi.update(editing.id, rest);
        toast.success("Employee updated.");
      } else {
        await employeesApi.create(form);
        toast.success("Employee account created.");
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(extractErrorMessage(err, "Could not save employee."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await employeesApi.remove(deleteTarget.id);
      toast.success("Employee removed.");
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(extractErrorMessage(err, "Could not remove employee."));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AppShell title="Employees" subtitle="Manage employee accounts and profiles.">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-ink-300" />
          <input
            className="input pl-10"
            placeholder="Search by name, ID, department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="btn-primary" onClick={openCreate}>
          <Plus className="h-4 w-4" /> Add Employee
        </button>
      </div>

      {loading ? (
        <PageLoader />
      ) : employees.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No employees found"
          description="Add your first employee to get started."
          action={
            <button className="btn-primary" onClick={openCreate}>
              <Plus className="h-4 w-4" /> Add Employee
            </button>
          }
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-ink-50/70">
                <tr className="text-xs uppercase tracking-wide text-ink-400">
                  <th className="px-5 py-3 font-semibold">Employee</th>
                  <th className="px-5 py-3 font-semibold">Employee ID</th>
                  <th className="px-5 py-3 font-semibold">Department</th>
                  <th className="px-5 py-3 font-semibold">Designation</th>
                  <th className="px-5 py-3 font-semibold">Joined</th>
                  <th className="px-5 py-3 font-semibold">Role</th>
                  <th className="px-5 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-50">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-ink-50/40">
                    <td className="flex items-center gap-3 px-5 py-3">
                      <SealAvatar name={emp.full_name} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-ink-700">{emp.full_name}</p>
                        <p className="truncate text-xs text-ink-400">{emp.email}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-ink-500">{emp.employee_id}</td>
                    <td className="px-5 py-3 text-ink-600">{emp.department || "—"}</td>
                    <td className="px-5 py-3 text-ink-600">{emp.designation || "—"}</td>
                    <td className="px-5 py-3 text-ink-600">{formatDate(emp.date_of_joining)}</td>
                    <td className="px-5 py-3">
                      <span className="badge bg-ink-100 text-ink-600 capitalize">{emp.role}</span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => openEdit(emp)}
                          className="rounded-lg p-2 text-ink-400 hover:bg-brand-50 hover:text-brand-600"
                          aria-label="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(emp)}
                          className="rounded-lg p-2 text-ink-400 hover:bg-red-50 hover:text-red-600"
                          aria-label="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Employee" : "Add Employee"}
        size="lg"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="btn-primary" form="employee-form" type="submit" disabled={saving}>
              {saving ? "Saving..." : editing ? "Save Changes" : "Create Account"}
            </button>
          </>
        }
      >
        <form id="employee-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="label">First name</label>
            <input className="input" required value={form.first_name}
              onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
          </div>
          <div>
            <label className="label">Last name</label>
            <input className="input" value={form.last_name}
              onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
          </div>
          <div>
            <label className="label">Username</label>
            <input className="input" required disabled={!!editing} value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })} />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" className="input" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          {!editing && (
            <div>
              <label className="label">Temporary password</label>
              <input type="password" className="input" required value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
          )}
          <div>
            <label className="label">Role</label>
            <select className="input" value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="label">Phone</label>
            <input className="input" value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="label">Date of joining</label>
            <input type="date" className="input" value={form.date_of_joining || ""}
              onChange={(e) => setForm({ ...form, date_of_joining: e.target.value })} />
          </div>
          <div>
            <label className="label">Department</label>
            <input className="input" value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })} />
          </div>
          <div>
            <label className="label">Designation</label>
            <input className="input" value={form.designation}
              onChange={(e) => setForm({ ...form, designation: e.target.value })} />
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Remove employee"
        message={`Are you sure you want to remove ${deleteTarget?.full_name}? This cannot be undone.`}
      />
    </AppShell>
  );
}
