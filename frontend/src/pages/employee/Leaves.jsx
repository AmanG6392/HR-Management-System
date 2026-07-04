import { useEffect, useState } from "react";
import { CalendarDays, Plus, Trash2 } from "lucide-react";
import AppShell from "../../components/AppShell";
import { PageLoader } from "../../components/Spinner";
import EmptyState from "../../components/EmptyState";
import StatusBadge from "../../components/StatusBadge";
import Modal from "../../components/Modal";
import ConfirmDialog from "../../components/ConfirmDialog";
import { leavesApi } from "../../api/endpoints";
import { useToast } from "../../context/ToastContext";
import { extractErrorMessage } from "../../utils/errors";
import { formatDate, formatDateTime, titleCase } from "../../utils/format";

const LEAVE_TYPES = [
  { value: "casual", label: "Casual Leave" },
  { value: "sick", label: "Sick Leave" },
  { value: "earned", label: "Earned Leave" },
  { value: "unpaid", label: "Unpaid Leave" },
];

const emptyForm = { leave_type: "casual", start_date: "", end_date: "", reason: "" };

export default function EmployeeLeaves() {
  const toast = useToast();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const load = () => {
    setLoading(true);
    leavesApi.list().then((res) => setLeaves(res.data.results ?? res.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await leavesApi.apply(form);
      toast.success("Leave request submitted to admin.");
      setModalOpen(false);
      setForm(emptyForm);
      load();
    } catch (err) {
      toast.error(extractErrorMessage(err, "Could not submit leave request."));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await leavesApi.cancel(cancelTarget.id);
      toast.success("Leave request withdrawn.");
      setCancelTarget(null);
      load();
    } catch (err) {
      toast.error(extractErrorMessage(err, "Could not withdraw request."));
    } finally {
      setCancelling(false);
    }
  };

  return (
    <AppShell title="My Leaves" subtitle="Apply for leave and track approval status.">
      <div className="mb-5 flex justify-end">
        <button className="btn-primary" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" /> Apply for Leave
        </button>
      </div>

      {loading ? (
        <PageLoader />
      ) : leaves.length === 0 ? (
        <EmptyState icon={CalendarDays} title="No leave requests yet" description="Apply for your first leave above." />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {leaves.map((lv) => (
            <div key={lv.id} className="card flex flex-col p-5">
              <div className="mb-3 flex items-start justify-between gap-2">
                <span className="badge bg-ink-100 text-ink-600">{titleCase(lv.leave_type)}</span>
                <StatusBadge status={lv.status} />
              </div>
              <p className="mb-1 text-sm font-semibold text-ink-700">
                {formatDate(lv.start_date)} — {formatDate(lv.end_date)}
              </p>
              <p className="mb-3 text-xs text-ink-400">{lv.total_days} day(s) · Applied {formatDateTime(lv.applied_on)}</p>
              <p className="mb-4 flex-1 text-sm text-ink-600">{lv.reason}</p>
              {lv.admin_remarks && (
                <p className="mb-3 rounded-lg bg-ink-50 p-2.5 text-xs text-ink-500">
                  <span className="font-semibold text-ink-600">Admin remarks:</span> {lv.admin_remarks}
                </p>
              )}
              {lv.status === "pending" && (
                <button className="btn-secondary mt-auto" onClick={() => setCancelTarget(lv)}>
                  <Trash2 className="h-4 w-4" /> Withdraw Request
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Apply for Leave"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button form="leave-form" type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Submitting..." : "Submit Request"}
            </button>
          </>
        }
      >
        <form id="leave-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Leave type</label>
            <select className="input" value={form.leave_type} onChange={(e) => setForm({ ...form, leave_type: e.target.value })}>
              {LEAVE_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Start date</label>
              <input type="date" className="input" required value={form.start_date}
                onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
            </div>
            <div>
              <label className="label">End date</label>
              <input type="date" className="input" required value={form.end_date}
                min={form.start_date}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Reason</label>
            <textarea className="input min-h-[100px]" required value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Briefly describe your reason for leave..." />
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancel}
        loading={cancelling}
        title="Withdraw leave request"
        message="Are you sure you want to withdraw this pending leave request?"
      />
    </AppShell>
  );
}
