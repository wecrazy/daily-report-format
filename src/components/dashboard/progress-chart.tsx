"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";
import { sectionLabels, sectionOrder, type ReportSections } from "@/lib/types";

export function ProgressChart({ sections }: { sections: ReportSections }) {
  const data = sectionOrder.map((key) => ({
    name: sectionLabels[key],
    total: sections[key].length,
  }));

  return (
    <Card>
      <div className="mb-2">
        <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">Flow Overview</h3>
        <p className="text-sm text-slate-600">Current distribution of daily report work items</p>
      </div>
      <div className="h-[220px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={220}>
          <BarChart data={data} margin={{ left: -14 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="#cbd5e1" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: "#334155", fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fill: "#334155", fontSize: 12 }} />
            <Tooltip
              cursor={{ fill: "rgba(14,165,233,0.12)" }}
              contentStyle={{ borderRadius: 12, borderColor: "#bae6fd" }}
            />
            <Bar dataKey="total" radius={[8, 8, 2, 2]} fill="#0284c7" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
