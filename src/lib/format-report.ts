import { sectionLabels, sectionOrder, type ReportState } from "@/lib/types";

const expandDetailLines = (detail: string) =>
  detail
    .split("\\n")
    .map((line) => line.trim())
    .filter(Boolean);

export const formatReport = (report: ReportState): string => {
  const lines: string[] = [`Report ${report.date}`, ""];

  sectionOrder.forEach((section, index) => {
    const items = report.sections[section];
    const label = sectionLabels[section];
    const groupedByProject = items.reduce<Record<string, typeof items>>((acc, item) => {
      const key = item.project.trim();
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {});
    const projectKeys = Object.keys(groupedByProject);
    const header =
      section === "priority"
        ? `${index + 1}. ${label}:`
        : `${index + 1}. ${label} (${projectKeys.length}):`;

    lines.push(header);

    if (projectKeys.length === 0) {
      lines.push("");
      return;
    }

    projectKeys.forEach((project) => {
      const projectItems = groupedByProject[project];

      if (projectItems.length === 1) {
        const [single] = projectItems;
        lines.push(`   - [${project}] ${single.title.trim()}`);
        single.details.forEach((detail) => {
          expandDetailLines(detail).forEach((line) => {
            lines.push(`     + ${line}`);
          });
        });
        return;
      }

      lines.push(`   - [${project}]`);
      projectItems.forEach((projectItem) => {
        lines.push(`     + ${projectItem.title.trim()}`);
        projectItem.details.forEach((detail) => {
          expandDetailLines(detail).forEach((line) => {
            lines.push(`       - ${line}`);
          });
        });
      });
    });

    lines.push("");
  });

  return lines.join("\n").trimEnd();
};
