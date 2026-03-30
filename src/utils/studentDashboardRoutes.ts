/** Student program shell (`StudentDashboardLayout`): sidebar + main. */
export const STUDENT_DASHBOARD_PREFIX = "/dashboard-program";

/** `/exams` (site) hoặc `/dashboard-program/exams` (trong dashboard học viên). */
export function getExamRoutesBase(pathname: string): "/exams" | "/dashboard-program/exams" {
  return pathname.startsWith(`${STUDENT_DASHBOARD_PREFIX}/exams`) ? `${STUDENT_DASHBOARD_PREFIX}/exams` : "/exams";
}

export function studentDashboardDocumentPath(sessionId: string): string {
  return `${STUDENT_DASHBOARD_PREFIX}/learn/document/${sessionId}`;
}

export function studentDashboardVideoPath(sessionId: string): string {
  return `${STUDENT_DASHBOARD_PREFIX}/learn/video/${sessionId}`;
}

export function isDashboardProgramLearnPath(pathname: string): boolean {
  return pathname.startsWith(`${STUDENT_DASHBOARD_PREFIX}/learn/`);
}

export function isDashboardProgramExamPath(pathname: string): boolean {
  return pathname.startsWith(`${STUDENT_DASHBOARD_PREFIX}/exams`);
}
