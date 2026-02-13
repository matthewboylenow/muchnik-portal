"use client";

import { motion } from "framer-motion";
import { Activity, Search, Code, Zap, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { MetricCard } from "@/components/shared/MetricCard";
import { DateRangePicker } from "@/components/shared/DateRangePicker";
import { useDateRange } from "@/hooks/useDateRange";
import { cn } from "@/lib/utils";

const cwvMetrics = [
  { label: "LCP", value: 2.1, unit: "s", threshold: [2.5, 4], status: "good" as const },
  { label: "INP", value: 180, unit: "ms", threshold: [200, 500], status: "good" as const },
  { label: "CLS", value: 0.08, unit: "", threshold: [0.1, 0.25], status: "good" as const },
];

const cwvStatusColor = { good: "text-[var(--color-positive)]", warning: "text-[var(--color-warning)]", poor: "text-[var(--color-negative)]" };
const cwvBgColor = { good: "bg-[var(--color-positive)]/10", warning: "bg-[var(--color-warning)]/10", poor: "bg-[var(--color-negative)]/10" };

const indexingData = { indexed: 87, submitted: 92, errors: 3 };

const schemaIssues = [
  { page: "/manhattan/elder-law-attorney/", type: "LocalBusiness", status: "valid" as const },
  { page: "/manhattan/medicaid-planning/", type: "LegalService", status: "valid" as const },
  { page: "/staten-island/estate-planning/", type: "LegalService", status: "warning" as const },
  { page: "/new-jersey/elder-law/", type: "LocalBusiness", status: "valid" as const },
  { page: "/blog/medicaid-look-back/", type: "Article", status: "error" as const },
];

const slowPages = [
  { url: "/blog/estate-planning-guide/", loadTime: 4.2, size: "2.1 MB" },
  { url: "/manhattan/medicaid-planning/", loadTime: 3.1, size: "1.4 MB" },
  { url: "/resources/guardianship-faq/", loadTime: 2.8, size: "1.2 MB" },
];

const statusIcons = {
  valid: <CheckCircle size={14} className="text-[var(--color-positive)]" />,
  warning: <AlertTriangle size={14} className="text-[var(--color-warning)]" />,
  error: <XCircle size={14} className="text-[var(--color-negative)]" />,
};

export default function TechnicalPage() {
  const { dateRange, setDateRange } = useDateRange();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Technical SEO</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">Core Web Vitals, indexing, and site health</p>
        </div>
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      {/* Core Web Vitals */}
      <div className="glass-card-static p-6">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-6 flex items-center gap-2">
          <Activity size={16} />
          Core Web Vitals
        </h3>
        <div className="grid grid-cols-3 gap-8">
          {cwvMetrics.map((metric) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className={cn("inline-flex items-center justify-center w-24 h-24 rounded-full", cwvBgColor[metric.status])}>
                <div>
                  <p className={cn("font-mono text-2xl font-bold", cwvStatusColor[metric.status])}>
                    {metric.value}{metric.unit}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm font-semibold text-[var(--text-primary)]">{metric.label}</p>
              <p className={cn("text-xs capitalize", cwvStatusColor[metric.status])}>{metric.status}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Indexing Status */}
        <div className="glass-card-static p-6">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Search size={16} />
            Indexing Status
          </h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 rounded-lg bg-[var(--bg-surface)]">
              <p className="font-mono text-2xl font-bold text-[var(--color-positive)]">{indexingData.indexed}</p>
              <p className="text-xs text-[var(--text-muted)]">Indexed</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-[var(--bg-surface)]">
              <p className="font-mono text-2xl font-bold text-[var(--text-primary)]">{indexingData.submitted}</p>
              <p className="text-xs text-[var(--text-muted)]">Submitted</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-[var(--bg-surface)]">
              <p className="font-mono text-2xl font-bold text-[var(--color-negative)]">{indexingData.errors}</p>
              <p className="text-xs text-[var(--text-muted)]">Errors</p>
            </div>
          </div>
          <div className="h-2 rounded-full bg-[var(--bg-surface)] overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--color-positive)]"
              style={{ width: `${(indexingData.indexed / indexingData.submitted) * 100}%` }}
            />
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-2">
            {((indexingData.indexed / indexingData.submitted) * 100).toFixed(0)}% of pages indexed
          </p>
        </div>

        {/* Schema Validation */}
        <div className="glass-card-static p-6">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Code size={16} />
            Schema Validation
          </h3>
          <div className="space-y-2">
            {schemaIssues.map((item) => (
              <div key={item.page} className="flex items-center justify-between text-sm rounded-lg p-2 hover:bg-[var(--bg-surface)] transition-colors">
                <div className="flex items-center gap-2">
                  {statusIcons[item.status]}
                  <span className="text-[var(--text-secondary)] truncate max-w-[200px]">{item.page}</span>
                </div>
                <span className="text-xs text-[var(--text-muted)]">{item.type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Slowest Pages */}
      <div className="glass-card-static p-6">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <Zap size={16} />
          Slowest Pages
        </h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border-subtle)]">
              <th className="text-left py-2 px-3 text-xs font-medium text-[var(--text-muted)]">URL</th>
              <th className="text-right py-2 px-3 text-xs font-medium text-[var(--text-muted)]">Load Time</th>
              <th className="text-right py-2 px-3 text-xs font-medium text-[var(--text-muted)]">Page Size</th>
            </tr>
          </thead>
          <tbody>
            {slowPages.map((page) => (
              <tr key={page.url} className="border-b border-[var(--border-subtle)]">
                <td className="py-2 px-3 text-[var(--text-secondary)]">{page.url}</td>
                <td className={cn("py-2 px-3 text-right font-mono", page.loadTime > 3 ? "text-[var(--color-negative)]" : "text-[var(--color-warning)]")}>
                  {page.loadTime}s
                </td>
                <td className="py-2 px-3 text-right font-mono text-[var(--text-muted)]">{page.size}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
