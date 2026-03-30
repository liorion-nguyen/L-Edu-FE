import React from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  label?: string;
  className?: string;
};

/** Nút quay lại trang trước — dùng trong shell /dashboard-program (học bài, thi). */
const DashboardProgramBackButton: React.FC<Props> = ({ label = "Quay lại", className = "" }) => {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className={`inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/90 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:border-primary/50 hover:text-primary transition-colors shadow-sm ${className}`}
    >
      <span className="material-symbols-outlined text-[20px] leading-none">arrow_back</span>
      {label}
    </button>
  );
};

export default DashboardProgramBackButton;
