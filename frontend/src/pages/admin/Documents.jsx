import { useEffect, useState } from "react";
import { FileText, Plus, Eye, Trash2 } from "lucide-react";
import AppShell from "../../components/AppShell";
import { PageLoader } from "../../components/Spinner";
import EmptyState from "../../components/EmptyState";
import Modal from "../../components/Modal";
import ConfirmDialog from "../../components/ConfirmDialog";
import { documentsApi, employeesApi } from "../../api/endpoints";
import { useToast } from "../../context/ToastContext";
import { extractErrorMessage } from "../../utils/errors";
import { formatDate, titleCase } from "../../utils/format";

const DOC_TYPES = [
  { value: "offer_letter", label: "Offer Letter" },
  { value: "experience_letter", label: "Experience Letter" },
  { value: "recommendation_letter", label: "Recommendation Letter" },
];

const TEMPLATES = {
  offer_letter: (emp) =>
    `Dear ${emp?.full_name || "[Employee Name]"},\n\nWe are pleased to offer you the position of ${emp?.designation || "[Designation]"} in the ${emp?.department || "[Department]"} department, effective ${emp?.date_of_joining || "[Joining Date]"}.\n\nWe look forward to having you on our team.\n\nSincerely,\nHR Department`,
  experience_letter: (emp) =>
    `This is to certify that ${emp?.full_name || "[Employee Name]"} (Employee ID: ${emp?.employee_id || "[ID]"}) worked with us as ${emp?.designation || "[Designation]"} in the ${emp?.department || "[Department]"} department.\n\nDuring this period, their conduct and performance were found to be satisfactory.\n\nWe wish them success in their future endeavors.\n\nSincerely,\nHR Department`,
  recommendation_letter: (emp) =>
    `I am pleased to recommend ${emp?.full_name || "[Employee Name]"} who worked with us as ${emp?.designation || "[Designation]"}.\n\nThroughout their tenure, they demonstrated strong professional skills, reliability, and a positive attitude. I am confident they will be a valuable addition to any team.\n\nPlease feel free to reach out for any further information.\n\nSincerely,\nHR Department`,
};

export default function AdminDocuments() {
  const toast = useToast();
  const [docs, setDocs] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewing, setViewing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ employee: "", doc_type: "offer_letter", title: "", content: "" });

  const load = () => {
    setLoading(true);
    documentsApi.list().then((res) => setDocs(res.data.results ?? res.data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    employeesApi.lookup().then((res) => setEmployees(res.data.results ?? res.data));
  }, []);

  const openCreate = () => {
    setForm({ employee: "", doc_type: "offer_letter", title: "", content: "" });
    setModalOpen(true);
  };

  const onEmployeeOrTypeChange = (next) => {
    const emp = employees.find((e) => e.id === Number(next.employee || form.employee));
    const docType = next.doc_type || form.doc_type;
    setForm({
      ...form,
      ...next,
      title: `${DOC_TYPES.find((d) => d.value === docType)?.label} — ${emp?.full_name || ""}`.trim(),
      content: TEMPLATES[docType]?.(emp) || "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await documentsApi.create(form);
      toast.success("Document issued successfully.");
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(extractErrorMessage(err, "Could not issue document."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await documentsApi.remove(deleteTarget.id);
      toast.success("Document removed.");
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(extractErrorMessage(err, "Could not remove document."));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AppShell title="Documents" subtitle="Issue offer, experience and recommendation letters.">
      <div className="mb-5 flex justify-end">
        <button className="btn-primary" onClick={openCreate}>
          <Plus className="h-4 w-4" /> Issue Document
        </button>
      </div>

      {loading ? (
        <PageLoader />
      ) : docs.length === 0 ? (
        <EmptyState icon={FileText} title="No documents issued yet" action={
          <button className="btn-primary" onClick={openCreate}><Plus className="h-4 w-4" /> Issue Document</button>
        } />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {docs.map((d) => (
            <div key={d.id} className="card flex flex-col p-5">
              <div className="mb-3 flex items-start justify-between gap-2">
                <span className="badge bg-brand-50 text-brand-700">{titleCase(d.doc_type)}</span>
                <span className="text-xs text-ink-400">{formatDate(d.issued_date)}</span>
              </div>
              <p className="mb-1 font-display text-sm font-bold text-ink-800">{d.title}</p>
              <p className="mb-4 text-xs text-ink-400">For {d.employee_detail.full_name} · {d.employee_detail.employee_id}</p>
              <div className="mt-auto flex gap-2">
                <button className="btn-secondary flex-1" onClick={() => setViewing(d)}>
                  <Eye className="h-4 w-4" /> View
                </button>
                <button className="rounded-xl border border-ink-200 p-2.5 text-ink-400 hover:bg-red-50 hover:text-red-600" onClick={() => setDeleteTarget(d)}>
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
        title="Issue New Document"
        size="lg"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button form="doc-form" type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Issuing..." : "Issue Document"}
            </button>
          </>
        }
      >
        <form id="doc-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Employee</label>
              <select
                className="input"
                required
                value={form.employee}
                onChange={(e) => onEmployeeOrTypeChange({ employee: e.target.value })}
              >
                <option value="">Select employee</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>{emp.full_name} — {emp.employee_id}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Document type</label>
              <select
                className="input"
                value={form.doc_type}
                onChange={(e) => onEmployeeOrTypeChange({ doc_type: e.target.value })}
              >
                {DOC_TYPES.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Title</label>
            <input className="input" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="label">Letter content</label>
            <textarea className="input min-h-[220px] font-mono text-xs leading-relaxed" required
              value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
          </div>
        </form>
      </Modal>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title={viewing?.title} size="lg">
        {viewing && (
          <div className="rounded-xl border border-ink-100 bg-ink-50/40 p-6">
            <div className="mb-4 flex items-center justify-between border-b border-dashed border-ink-200 pb-4">
              <span className="font-display text-lg font-bold text-ink-800">Orbit HRMS</span>
              <span className="text-xs text-ink-400">{formatDate(viewing.issued_date)}</span>
            </div>
            <pre className="whitespace-pre-wrap font-body text-sm leading-relaxed text-ink-700">{viewing.content}</pre>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Remove document"
        message={`Remove "${deleteTarget?.title}"?`}
      />
    </AppShell>
  );
}
