"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock4, Flag, ListTodo, LoaderCircle, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { sectionLabels, type ReportSections } from "@/lib/types";

interface StatItem {
  key: keyof ReportSections;
  icon: LucideIcon;
  tint: string;
}

const statItems: StatItem[] = [
  { key: "tasks", icon: ListTodo, tint: "text-sky-700" },
  { key: "done", icon: CheckCircle2, tint: "text-emerald-700" },
  { key: "doing", icon: LoaderCircle, tint: "text-amber-700" },
  { key: "pending", icon: Clock4, tint: "text-rose-700" },
  { key: "priority", icon: Flag, tint: "text-violet-700" },
];

export function StatsCards({ sections }: { sections: ReportSections }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {statItems.map((item, idx) => {
        const Icon = item.icon;
        const count = sections[item.key].length;

        return (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06 }}
          >
            <Card className="h-full bg-white/65">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  {sectionLabels[item.key]}
                </p>
                <Icon className={`h-4 w-4 ${item.tint}`} />
              </div>
              <p className="text-3xl font-black text-slate-800">{count}</p>
              <p className="text-xs text-slate-500">items in this lane</p>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
