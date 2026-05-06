"use client";

import { motion } from "framer-motion";
import { CalendarCheck2, ClipboardPenLine } from "lucide-react";
import dynamic from "next/dynamic";
import { Toaster } from "sonner";
import { ReportForm } from "@/components/dashboard/report-form";
import { ReportPreview } from "@/components/dashboard/report-preview";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { useReportStore } from "@/lib/store";

const ProgressChart = dynamic(
  () => import("@/components/dashboard/progress-chart").then((mod) => mod.ProgressChart),
  {
    ssr: false,
    loading: () => <div className="h-[300px] animate-pulse rounded-2xl bg-white/70" />,
  },
);

export default function Home() {
  const { date, sections, addItem, moveItem, removeItem, resetAll, setDate, updateItem } = useReportStore();

  return (
    <div className="relative flex-1">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(14,165,233,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(14,165,233,0.06)_1px,transparent_1px)] bg-[size:28px_28px]" />

      <main className="relative mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 rounded-3xl border border-white/30 bg-gradient-to-r from-sky-600 via-cyan-500 to-emerald-500 p-[1px] shadow-[0_12px_40px_rgba(14,116,144,0.3)]"
        >
          <div className="rounded-3xl bg-slate-950/95 p-6 text-white">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-100">
                  <CalendarCheck2 className="h-4 w-4" />
                  Daily Report Studio
                </p>
                <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Build clear, consistent daily reports in seconds</h1>
                <p className="mt-2 max-w-2xl text-sm text-cyan-100/90">
                  Add tasks across workflow lanes, monitor progress, and generate export-ready output in your exact format.
                </p>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur">
                <p className="mb-1 text-xs uppercase tracking-[0.16em] text-cyan-100">Report Date</p>
                <p className="flex items-center gap-2 text-xl font-black text-white">
                  <ClipboardPenLine className="h-5 w-5" />
                  {date}
                </p>
              </div>
            </div>
          </div>
        </motion.header>

        <section className="mb-4">
          <StatsCards sections={sections} />
        </section>

        <section className="mb-4">
          <ProgressChart sections={sections} />
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.1fr_1fr]">
          <ReportForm
            date={date}
            setDate={setDate}
            sections={sections}
            addItem={addItem}
            updateItem={updateItem}
            moveItem={moveItem}
            removeItem={removeItem}
            resetAll={resetAll}
          />
          <ReportPreview report={{ date, sections }} />
        </section>
      </main>
      <Toaster richColors closeButton position="top-right" />
    </div>
  );
}
