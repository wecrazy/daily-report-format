"use client";

import { Download, Files, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatReport } from "@/lib/format-report";
import { sectionLabels, sectionOrder, type ReportState } from "@/lib/types";

export function ReportPreview({ report }: { report: ReportState }) {
  const text = formatReport(report);
  const missingSections = sectionOrder.filter((section) => report.sections[section].length === 0);

  const showIncompleteWarning = () => {
    const missingLabels = missingSections.map((section) => sectionLabels[section]).join(", ");
    toast.warning("Cannot export report yet", {
      description: `Please add at least one item for: ${missingLabels}.`,
      duration: 9000,
      closeButton: true,
    });
  };

  const onCopy = async () => {
    if (missingSections.length > 0) {
      showIncompleteWarning();
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      toast.success("Report copied to clipboard");
    } catch {
      toast.error("Copy failed. Please copy manually.");
    }
  };

  const onDownload = () => {
    if (missingSections.length > 0) {
      showIncompleteWarning();
      return;
    }

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `report-${report.date.replaceAll("/", "-")}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success("Report file downloaded");
  };

  return (
    <Card className="h-full bg-slate-950 text-slate-100">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-sky-300">
            <Sparkles className="h-4 w-4" />
            Generated Output
          </h3>
          <p className="text-xs text-slate-400">Aligned to your required daily report format</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" className="bg-slate-700 text-white hover:bg-slate-600" onClick={onCopy}>
            <Files className="h-4 w-4" />
            Copy
          </Button>
          <Button variant="secondary" onClick={onDownload}>
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
      </div>
      <pre className="max-h-[560px] overflow-auto rounded-xl border border-slate-700 bg-slate-900/80 p-4 text-sm leading-7 whitespace-pre-wrap">
        {text}
      </pre>
    </Card>
  );
}
