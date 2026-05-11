"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, CalendarDays, Pencil, Plus, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ReportItem } from "@/lib/types";
import { sectionLabels, sectionOrder, type ReportSections, type SectionKey } from "@/lib/types";

const itemSchema = z.object({
  section: z.enum(sectionOrder),
  project: z.string().min(1, "Project tag is required"),
  title: z.string().min(1, "Main task title is required"),
  details: z.string().optional(),
});

type ItemForm = z.infer<typeof itemSchema>;

interface ReportFormProps {
  date: string;
  setDate: (value: string) => void;
  sections: ReportSections;
  addItem: (section: SectionKey, item: { project: string; title: string; details: string[] }) => void;
  updateItem: (section: SectionKey, id: string, item: { project: string; title: string; details: string[] }) => void;
  removeItem: (section: SectionKey, id: string) => void;
  moveItem: (section: SectionKey, id: string, direction: "up" | "down") => void;
  resetAll: () => void;
}

interface EditingState {
  section: SectionKey;
  item: ReportItem;
}

const displayDateToIso = (displayDate: string) => {
  const parts = displayDate.split("/");
  if (parts.length !== 3) {
    return "";
  }

  const [day, month, year] = parts;
  if (!day || !month || !year) {
    return "";
  }

  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

const isoDateToDisplay = (isoDate: string) => {
  const parts = isoDate.split("-");
  if (parts.length !== 3) {
    return "";
  }

  const [year, month, day] = parts;
  if (!year || !month || !day) {
    return "";
  }

  return `${day}/${month}/${year}`;
};

const parseDetailsInput = (input: string) =>
  input
    .split(/\\n|\r?\n/g)
    .map((line) => line.trim())
    .filter(Boolean);

export function ReportForm({
  date,
  setDate,
  sections,
  addItem,
  updateItem,
  removeItem,
  moveItem,
  resetAll,
}: ReportFormProps) {
  const dateInputValue = displayDateToIso(date);
  const [editing, setEditing] = useState<EditingState | null>(null);
  const [editProject, setEditProject] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editDetails, setEditDetails] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ItemForm>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      section: "tasks",
      project: "",
      title: "",
      details: "",
    },
  });

  const onSubmit = (values: ItemForm) => {
    const details = parseDetailsInput(values.details ?? "");

    addItem(values.section, {
      project: values.project,
      title: values.title,
      details,
    });

    reset({
      section: values.section,
      project: values.project,
      title: "",
      details: "",
    });
  };

  const openEditModal = (section: SectionKey, item: ReportItem) => {
    setEditing({ section, item });
    setEditProject(item.project);
    setEditTitle(item.title);
    setEditDetails(item.details.join("\\n"));
  };

  const closeEditModal = () => {
    setEditing(null);
    setEditProject("");
    setEditTitle("");
    setEditDetails("");
  };

  const saveEdit = () => {
    if (!editing) {
      return;
    }

    const project = editProject.trim();
    const title = editTitle.trim();
    if (!project || !title) {
      return;
    }

    updateItem(editing.section, editing.item.id, {
      project,
      title,
      details: parseDetailsInput(editDetails),
    });
    closeEditModal();
  };

  return (
    <div className="space-y-4">
      <Card>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-700">Report Builder</h2>
          <Button variant="ghost" onClick={resetAll} type="button">
            Reset All
          </Button>
        </div>

        <label className="mb-1 block text-xs font-semibold text-slate-600">Report Date</label>
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 ring-sky-500 focus-within:ring">
          <CalendarDays className="h-4 w-4 text-slate-500" />
          <input
            type="date"
            className="w-full bg-transparent text-sm outline-none"
            value={dateInputValue}
            onChange={(e) => setDate(isoDateToDisplay(e.target.value))}
          />
        </div>

        <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">Section</label>
            <select
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-sky-500 focus:ring"
              {...register("section")}
            >
              {sectionOrder.map((section) => (
                <option key={section} value={section}>
                  {sectionLabels[section]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">Project Tag</label>
            <input
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-sky-500 focus:ring"
              placeholder="seaweed"
              {...register("project")}
            />
            {errors.project ? <p className="mt-1 text-xs text-rose-600">{errors.project.message}</p> : null}
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">Main Task</label>
            <input
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-sky-500 focus:ring"
              placeholder="Try to understand the S3 upload flow"
              {...register("title")}
            />
            {errors.title ? <p className="mt-1 text-xs text-rose-600">{errors.title.message}</p> : null}
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">
              Details (use <code>\n</code> to separate bullets)
            </label>
            <textarea
              rows={4}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-sky-500 focus:ring"
              placeholder="Get and read the S3 documentation\\nSummarize upload route and payload"
              {...register("details")}
            />
          </div>

          <Button type="submit" className="w-full">
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </form>
      </Card>

      <div className="space-y-3">
        {sectionOrder.map((section, sIndex) => (
          <motion.div
            key={section}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sIndex * 0.04 }}
          >
            <Card>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.12em] text-slate-600">
                {sectionLabels[section]} ({sections[section].length})
              </h3>

              {sections[section].length === 0 ? (
                <p className="text-sm text-slate-400">No items yet.</p>
              ) : (
                <div className="space-y-2">
                  {sections[section].map((item, index) => (
                    <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-3">
                      <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="text-xs font-semibold text-sky-700">[{item.project}]</p>
                          <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            type="button"
                            className="px-2 py-1"
                            disabled={index === 0}
                            onClick={() => moveItem(section, item.id, "up")}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            type="button"
                            className="px-2 py-1"
                            disabled={index === sections[section].length - 1}
                            onClick={() => moveItem(section, item.id, "down")}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="secondary"
                            type="button"
                            className="px-2 py-1"
                            onClick={() => openEditModal(section, item)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="danger" type="button" className="px-2 py-1" onClick={() => removeItem(section, item.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <ul className="space-y-1 text-xs text-slate-600">
                        {item.details.map((detail, idx) => (
                          <li key={`${item.id}-${idx}`}>+ {detail}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      {editing ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-[0.14em] text-slate-700">Edit Item</h3>
              <Button variant="ghost" type="button" className="px-2 py-1" onClick={closeEditModal}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Project Tag</label>
                <input
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-sky-500 focus:ring"
                  value={editProject}
                  onChange={(e) => setEditProject(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Main Task</label>
                <input
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-sky-500 focus:ring"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  Details (use <code>\n</code> to separate bullets)
                </label>
                <textarea
                  rows={5}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-sky-500 focus:ring"
                  value={editDetails}
                  onChange={(e) => setEditDetails(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="ghost" type="button" onClick={closeEditModal}>
                  Cancel
                </Button>
                <Button type="button" onClick={saveEdit} disabled={!editProject.trim() || !editTitle.trim()}>
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
