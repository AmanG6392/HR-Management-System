import { useEffect, useState } from "react";
import { Plus, Trash2, Edit2, PartyPopper } from "lucide-react";
import AppShell from "../../components/AppShell";
import { PageLoader } from "../../components/Spinner";
import EmptyState from "../../components/EmptyState";
import Modal from "../../components/Modal";
import ConfirmDialog from "../../components/ConfirmDialog";
import { holidaysApi } from "../../api/endpoints";
import { useToast } from "../../context/ToastContext";
import { extractErrorMessage } from "../../utils/errors";
import { formatDate } from "../../utils/format";

const emptyForm = { name: "", date: "", description: "" };

export default function AdminHolidays() {
  const toast = useToast();
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    holidaysApi.list().then((res) => setHolidays(res.data.results ?? res.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (h) => { setEditing(h); setForm(h); setModalOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await holidaysApi.update(editing.id, form);
        toast.success("Holiday updated.");
      } else {
        await holidaysApi.create(form);
        toast.success("Holiday added.");
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(extractErrorMessage(err, "Could not save holiday."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await holidaysApi.remove(deleteTarget.id);
      toast.success("Holiday removed.");
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(extractErrorMessage(err, "Could not remove holiday."));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AppShell title="Holidays" subtitle="Manage the official holiday calendar.">
      <div className="mb-5 flex justify-end">
        <button className="btn-primary" onClick={openCreate}>
          <Plus className="h-4 w-4" /> Add Holiday
        </button>
      </div>

      {loading ? (
        <PageLoader />
      ) : holidays.length === 0 ? (
        <EmptyState icon={PartyPopper} title="No holidays added yet" action={
          <button className="btn-primary" onClick={openCreate}><Plus className="h-4 w-4" /> Add Holiday</button>
        } />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {holidays.map((h) => (
            <div key={h.id} className="card flex items-center gap-4 p-5">
              <div className="flex h-14 w-14 flex-col items-center justify-center rounded-xl bg-gold-50 text-gold-700">
                <span className="text-[10px] font-bold uppercase leading-none">
                  {formatDate(h.date, { month: "short" }).split(" ")[1]}
                </span>
                <span className="text-xl font-bold leading-none">{new Date(h.date).getDate()}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display font-bold text-ink-800">{h.name}</p>
                <p className="truncate text-xs text-ink-400">{h.description || "—"}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(h)} className="rounded-lg p-2 text-ink-400 hover:bg-brand-50 hover:text-brand-600">
                  <Edit2 className="h-4 w-4" />
                </button>
                <button onClick={() => setDeleteTarget(h)} className="rounded-lg p-2 text-ink-400 hover:bg-red-50 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Holiday" : "Add Holiday"}
        footer={
          <>
            <button className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button form="holiday-form" type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
          </>
        }
      >
        <form id="holiday-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Holiday name</label>
            <input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="label">Date</label>
            <input type="date" className="input" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
          <div>
            <label className="label">Description (optional)</label>
            <input className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Remove holiday"
        message={`Remove "${deleteTarget?.name}" from the holiday calendar?`}
      />
    </AppShell>
  );
}
