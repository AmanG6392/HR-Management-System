import { useEffect, useState } from "react";
import { CalendarDays, Check, X } from "lucide-react";
import AppShell from "../../components/AppShell";
import { PageLoader } from "../../components/Spinner";
import EmptyState from "../../components/EmptyState";
import StatusBadge from "../../components/StatusBadge";
import Modal from "../../components/Modal";
import { leavesApi } from "../../api/endpoints";
import { useToast } from "../../context/ToastContext";
import { extractErrorMessage } from "../../utils/errors";
import { formatDate, formatDateTime, titleCase } from "../../utils/format";

const TABS = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "", label: "All" },
];

export default function AdminLeaves() {
  const toast = useToast();
  const [tab, setTab] = useState("pending");
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewTarget, setReviewTarget] = useState(null);
  const [decision, setDecision] = useState("approved");
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    leavesApi
      .list(tab ? { status: tab } : {})
      .then((res) => setLeaves(res.data.results ?? res.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, [tab]);

  const openReview = (leave, dec) => {
    setReviewTarget(leave);
    setDecision(dec);
    setRemarks("");
  };

  const submitReview = async () => {
    setSubmitting(true);
    try {
      await leavesApi.review(reviewTarget.id, { status: decision, admin_remarks: remarks });
      toast.success(`Leave request ${decision}.`);
      setReviewTarget(null);
      load();
    } catch (err) {
      toast.error(extractErrorMessage(err, "Could not update leave request."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell title="Leave Requests" subtitle="Review and respond to employee leave applications.">
      <div className="mb-5 flex gap-2 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`shrink-0 rounded-xl px-4 py-2 text-sm font-semibold transition ${
              tab === t.value ? "bg-brand-600 text-white shadow-card" : "bg-white text-ink-500 border border-ink-100 hover:bg-ink-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <PageLoader />
      ) : leaves.length === 0 ? (
        <EmptyState icon={CalendarDays} title="No leave requests here" description="Nothing to review for this filter." />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {leaves.map((lv) => (
            <div key={lv.id} className="card flex flex-col p-5">
              <div className="mb-3 flex items-start justify-between gap-2">
                <div>
                  <p className="font-display text-sm font-bold text-ink-800">{lv.employee_detail.full_name}</p>
                  <p className="text-xs text-ink-400">{lv.employee_detail.employee_id} · {lv.employee_detail.department}</p>
                </div>
                <StatusBadge status={lv.status} />
              </div>
              <div className="mb-2 flex items-center gap-2 text-sm">
                <span className="badge bg-ink-100 text-ink-600">{titleCase(lv.leave_type)}</span>
                <span className="text-ink-400">·</span>
                <span className="text-ink-600">{lv.total_days} day(s)</span>
              </div>
              <p className="mb-3 text-sm text-ink-500">
                {formatDate(lv.start_date)} — {formatDate(lv.end_date)}
              </p>
              <p className="mb-4 line-clamp-3 flex-1 text-sm text-ink-600">{lv.reason}</p>
              <p className="mb-3 text-xs text-ink-400">Applied {formatDateTime(lv.applied_on)}</p>

              {lv.status === "pending" ? (
                <div className="flex gap-2">
                  <button className="btn-secondary flex-1" onClick={() => openReview(lv, "rejected")}>
                    <X className="h-4 w-4" /> Reject
                  </button>
                  <button className="btn-primary flex-1" onClick={() => openReview(lv, "approved")}>
                    <Check className="h-4 w-4" /> Approve
                  </button>
                </div>
              ) : (
                lv.admin_remarks && (
                  <p className="rounded-lg bg-ink-50 p-2.5 text-xs text-ink-500">
                    <span className="font-semibold text-ink-600">Remarks:</span> {lv.admin_remarks}
                  </p>
                )
              )}
            </div>
          ))}
        </div>
      )}

      <Modal
        open={!!reviewTarget}
        onClose={() => setReviewTarget(null)}
        title={decision === "approved" ? "Approve leave request" : "Reject leave request"}
        size="sm"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setReviewTarget(null)}>Cancel</button>
            <button
              className={decision === "approved" ? "btn-primary" : "btn-danger"}
              onClick={submitReview}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : `Confirm ${titleCase(decision)}`}
            </button>
          </>
        }
      >
        <p className="mb-3 text-sm text-ink-600">
          {decision === "approved" ? "Approve" : "Reject"} leave for{" "}
          <span className="font-semibold">{reviewTarget?.employee_detail.full_name}</span>?
        </p>
        <label className="label">Remarks (optional)</label>
        <textarea
          className="input min-h-[90px]"
          placeholder="Add a note for the employee..."
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />
      </Modal>
    </AppShell>
  );
}
