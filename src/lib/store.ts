"use client";

import { format } from "date-fns";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { sectionOrder, type ReportItem, type ReportSections, type SectionKey } from "@/lib/types";

interface ReportStore {
  date: string;
  lastSyncedDate: string;
  sections: ReportSections;
  setDate: (date: string) => void;
  addItem: (section: SectionKey, item: Omit<ReportItem, "id">) => void;
  updateItem: (section: SectionKey, id: string, item: Omit<ReportItem, "id">) => void;
  removeItem: (section: SectionKey, id: string) => void;
  moveItem: (section: SectionKey, id: string, direction: "up" | "down") => void;
  resetAll: () => void;
}

const makeInitialSections = (): ReportSections => ({
  tasks: [],
  done: [],
  doing: [],
  pending: [],
  priority: [],
});

const makeId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const todayString = () => format(new Date(), "dd/MM/yyyy");
const isValidDisplayDate = (value: string) => {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    return false;
  }

  const [day, month, year] = value.split("/").map(Number);
  const parsed = new Date(year, month - 1, day);
  return parsed.getFullYear() === year && parsed.getMonth() === month - 1 && parsed.getDate() === day;
};

export const useReportStore = create<ReportStore>()(
  persist(
    (set) => ({
      date: todayString(),
      lastSyncedDate: todayString(),
      sections: makeInitialSections(),
      setDate: (date) => set({ date }),
      addItem: (section, item) =>
        set((state) => ({
          sections: {
            ...state.sections,
            [section]: [...state.sections[section], { ...item, id: makeId() }],
          },
        })),
      updateItem: (section, id, item) =>
        set((state) => ({
          sections: {
            ...state.sections,
            [section]: state.sections[section].map((existing) =>
              existing.id === id ? { ...item, id } : existing,
            ),
          },
        })),
      removeItem: (section, id) =>
        set((state) => ({
          sections: {
            ...state.sections,
            [section]: state.sections[section].filter((item) => item.id !== id),
          },
        })),
      moveItem: (section, id, direction) =>
        set((state) => {
          const list = [...state.sections[section]];
          const currentIndex = list.findIndex((item) => item.id === id);
          if (currentIndex === -1) {
            return state;
          }

          const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
          if (targetIndex < 0 || targetIndex >= list.length) {
            return state;
          }

          const [moved] = list.splice(currentIndex, 1);
          list.splice(targetIndex, 0, moved);

          return {
            sections: {
              ...state.sections,
              [section]: list,
            },
          };
        }),
      resetAll: () =>
        set({
          date: todayString(),
          lastSyncedDate: todayString(),
          sections: makeInitialSections(),
        }),
    }),
    {
      name: "daily-report-builder",
      partialize: (state) => ({
        date: state.date,
        lastSyncedDate: state.lastSyncedDate,
        sections: sectionOrder.reduce((acc, key) => {
          acc[key] = state.sections[key];
          return acc;
        }, {} as ReportSections),
      }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<ReportStore> | undefined;
        const today = todayString();
        const shouldSyncToday = !persisted?.lastSyncedDate || persisted.lastSyncedDate !== today;
        const persistedDate = persisted?.date?.trim();
        const safePersistedDate = persistedDate && isValidDisplayDate(persistedDate) ? persistedDate : undefined;

        return {
          ...currentState,
          ...persisted,
          date: shouldSyncToday ? today : (safePersistedDate ?? currentState.date),
          lastSyncedDate: today,
          sections: persisted?.sections ? { ...makeInitialSections(), ...persisted.sections } : currentState.sections,
        };
      },
    },
  ),
);
