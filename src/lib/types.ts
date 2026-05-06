export const sectionOrder = ["tasks", "done", "doing", "pending", "priority"] as const;

export type SectionKey = (typeof sectionOrder)[number];

export interface ReportItem {
  id: string;
  project: string;
  title: string;
  details: string[];
}

export type ReportSections = Record<SectionKey, ReportItem[]>;

export interface ReportState {
  date: string;
  sections: ReportSections;
}

export const sectionLabels: Record<SectionKey, string> = {
  tasks: "Tasks",
  done: "Done",
  doing: "Doing",
  pending: "Pending",
  priority: "Priority",
};
