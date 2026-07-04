import { useEffect, useState, useRef } from "react";
import { Eye, FileText } from "lucide-react";
import AppShell from "../../components/AppShell";
import { PageLoader } from "../../components/Spinner";
import EmptyState from "../../components/EmptyState";
import Modal from "../../components/Modal";
import { documentsApi } from "../../api/endpoints";
import { formatDate, titleCase } from "../../utils/format";
import { useReactToPrint } from "react-to-print";

export default function EmployeeDocuments() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState(null);

  useEffect(() => {
    documentsApi
      .list()
      .then((res) => setDocs(res.data.results ?? res.data))
      .finally(() => setLoading(false));
  }, []);

  const printRef = useRef();
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: viewing?.title,
  });

  return (
    <AppShell
      title="My Documents"
      subtitle="Offer, experience and recommendation letters issued to you."
    >
      {loading ? (
        <PageLoader />
      ) : docs.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No documents yet"
          description="Letters issued by HR will appear here."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {docs.map((d) => (
            <div key={d.id} className="card flex flex-col p-5">
              <div className="mb-3 flex items-start justify-between gap-2">
                <span className="badge bg-brand-50 text-brand-700">
                  {titleCase(d.doc_type)}
                </span>
                <span className="text-xs text-ink-400">
                  {formatDate(d.issued_date)}
                </span>
              </div>
              <p className="mb-4 font-display text-sm font-bold text-ink-800">
                {d.title}
              </p>
              <button
                className="btn-secondary mt-auto"
                onClick={() => setViewing(d)}
              >
                <Eye className="h-4 w-4" /> View Document
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={!!viewing}
        onClose={() => setViewing(null)}
        title={viewing?.title}
        size="lg"
        footer={
          <button className="btn-primary no-print" onClick={handlePrint}>
            Print / Save as PDF
          </button>
        }
      >
        {viewing && (
          <div ref={printRef}>
            <div className="rounded-xl border border-ink-100 bg-white p-8">
              <div className="mb-4 flex items-center justify-between border-b border-dashed border-ink-200 pb-4">
                <span className="font-display text-lg font-bold text-ink-800">
                  Orbit HRMS
                </span>
                <span className="text-xs text-ink-400">
                  {formatDate(viewing.issued_date)}
                </span>
              </div>
              <pre className="whitespace-pre-wrap font-body text-sm leading-relaxed text-ink-700">
                {viewing.content}
              </pre>
            </div>
          </div>
        )}
      </Modal>
    </AppShell>
  );
}
