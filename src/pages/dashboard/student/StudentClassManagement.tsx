import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { localStorageConfig } from "../../../config";
import { RootState, useSelector } from "../../../redux/store";
import { studentClassService } from "../../../services/studentClassService";
import type { ClassScheduleSlot, ClassSummary } from "../../../types/class";

type StatCard = {
  label: string;
  value: string;
  tone: "primary" | "emerald" | "amber" | "purple";
  icon: string;
};

function safeParseDateTime(slot: ClassScheduleSlot) {
  // Expecting slot.date (yyyy-mm-dd or ISO) + timeStart/timeEnd (hh:mm).
  const start = new Date(`${slot.date}T${slot.timeStart || "00:00"}:00`);
  const end = new Date(`${slot.date}T${slot.timeEnd || "00:00"}:00`);
  return { start, end };
}

function formatMonthShort(d: Date) {
  return d.toLocaleString("en-US", { month: "short" });
}
function formatDay2(d: Date) {
  return String(d.getDate()).padStart(2, "0");
}
function formatTime(d: Date) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

type UpcomingItem = {
  classId: string;
  className: string;
  courseName?: string;
  start: Date;
  end: Date;
  tone: "primary" | "muted" | "amber";
};

const StudentClassManagement: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((s: RootState) => s.auth);
  const [classes, setClasses] = useState<ClassSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hasToken =
      typeof window !== "undefined"
        ? !!localStorage.getItem(localStorageConfig.accessToken)
        : false;
    if (!hasToken) return; // dashboard layout will gate with modal
    if (!user?._id) return;

    const run = async () => {
      setLoading(true);
      try {
        const list = await studentClassService.getMyClasses();
        setClasses(Array.isArray(list) ? list : []);
      } catch {
        setClasses([]);
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [user?._id]);

  const { total, active, finished } = useMemo(() => {
    const total = classes.length;
    const active = classes.filter((c) => c.status === "ACTIVE").length;
    const finished = classes.filter((c) => c.status === "FINISHED").length;
    const pending = classes.filter((c) => c.status === "PENDING").length;
    void pending;
    return { total, active, finished };
  }, [classes]);

  const stats = useMemo<StatCard[]>(
    () => [
      { label: "Total Classes", value: String(total).padStart(2, "0"), tone: "primary", icon: "layers" },
      { label: "Active", value: String(active).padStart(2, "0"), tone: "emerald", icon: "bolt" },
      { label: "Completed", value: String(finished).padStart(2, "0"), tone: "amber", icon: "task_alt" },
      {
        label: "Attendance",
        value: total > 0 ? `${Math.round((active / Math.max(1, total)) * 100)}%` : "0%",
        tone: "purple",
        icon: "how_to_reg",
      },
    ],
    [total, active, finished],
  );

  const upcoming = useMemo<UpcomingItem[]>(() => {
    const now = new Date();
    const items: UpcomingItem[] = [];
    for (const cls of classes) {
      const slots = cls.scheduleSlots || [];
      for (const slot of slots) {
        const { start, end } = safeParseDateTime(slot);
        if (Number.isNaN(start.getTime())) continue;
        if (start.getTime() < now.getTime()) continue;
        items.push({
          classId: cls._id,
          className: cls.name,
          courseName: cls.course?.name,
          start,
          end,
          tone: cls.status === "PENDING" ? "amber" : cls.status === "ACTIVE" ? "primary" : "muted",
        });
      }
    }
    items.sort((a, b) => a.start.getTime() - b.start.getTime());
    return items.slice(0, 4);
  }, [classes]);

  return (
    <div className="text-slate-900 dark:text-slate-100">
      {/* Page Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Lớp học của tôi</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Tổng quan học kỳ và danh sách lớp</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 bg-white/70 dark:bg-slate-900/40 backdrop-blur rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-800">
          <span className="material-symbols-outlined text-sm">filter_list</span>
          <span>Sort by: Recently Accessed</span>
        </div>
      </div>

      {/* Top Summary Statistics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {stats.map((s) => {
          const tone =
            s.tone === "primary"
              ? "border-primary text-primary"
              : s.tone === "emerald"
                ? "border-emerald-500 text-emerald-500"
                : s.tone === "amber"
                  ? "border-amber-500 text-amber-500"
                  : "border-purple-500 text-purple-500";
          return (
            <div
              key={s.label}
              className={[
                "rounded-2xl p-6 border-l-4 glass-card",
                "bg-white/60 dark:bg-slate-800/30 backdrop-blur-xl border border-slate-200/60 dark:border-white/5",
                tone,
              ].join(" ")}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-black tracking-widest uppercase ${tone.split(" ")[1]}`}>{s.label}</span>
                <span className={`material-symbols-outlined opacity-60 ${tone.split(" ")[1]}`}>{s.icon}</span>
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white">{s.value}</div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2">Updated just now</p>
            </div>
          );
        })}
      </div>

      {/* Main Grid with Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Course Grid */}
        <div className="lg:col-span-3 space-y-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl p-6 bg-white/70 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 animate-pulse"
                >
                  <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-700 mb-6" />
                  <div className="h-6 w-3/4 rounded bg-slate-200 dark:bg-slate-700 mb-4" />
                  <div className="h-4 w-44 rounded bg-slate-200 dark:bg-slate-700 mb-6" />
                  <div className="h-2 w-full rounded bg-slate-200 dark:bg-slate-700 mb-2" />
                  <div className="h-2 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
                </div>
              ))}
            </div>
          ) : classes.length === 0 ? (
            <div className="rounded-2xl p-10 text-center bg-white/70 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800">
              <div className="text-lg font-bold text-slate-900 dark:text-white">Bạn chưa tham gia lớp nào</div>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Hãy khám phá và đăng ký khóa học để bắt đầu.</p>
              <button
                type="button"
                onClick={() => navigate("/dashboard-program/courses")}
                className="mt-5 inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-black text-white shadow-md shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all"
              >
                Khám phá khoá học
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {classes.map((cls) => {
                const statusTone =
                  cls.status === "ACTIVE"
                    ? { pillBg: "bg-primary/10 text-primary border-primary/20", accent: "text-primary", deco: "terminal" }
                    : cls.status === "FINISHED"
                      ? { pillBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", accent: "text-emerald-400", deco: "verified" }
                      : { pillBg: "bg-amber-400/10 text-amber-400 border-amber-400/20", accent: "text-amber-400", deco: "event" };

                const totalSessions = cls.totalSessions ?? 0;
                const completedSessions =
                  cls.status === "FINISHED"
                    ? totalSessions || 0
                    : cls.status === "ACTIVE"
                      ? Math.min(Math.max(1, Math.floor(totalSessions * 0.4)), totalSessions || 0)
                      : 0;
                const progress = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

                const nextSlot = (cls.scheduleSlots || [])
                  .map((s) => safeParseDateTime(s).start)
                  .filter((d) => !Number.isNaN(d.getTime()) && d.getTime() > Date.now())
                  .sort((a, b) => a.getTime() - b.getTime())[0];

                return (
                  <div
                    key={cls._id}
                    className="rounded-2xl p-6 relative overflow-hidden group bg-white/70 dark:bg-slate-800/30 backdrop-blur-xl border border-slate-200/60 dark:border-white/5 hover:bg-white dark:hover:bg-slate-800/40 transition-all duration-300"
                  >
                    <span
                      className={`material-symbols-outlined absolute -right-4 -bottom-4 text-9xl text-slate-200/60 dark:text-white/5 select-none pointer-events-none group-hover:${statusTone.accent.replace(
                        "text-",
                        "text-",
                      )}/10 transition-colors duration-500`}
                    >
                      {statusTone.deco}
                    </span>

                    <div className="flex justify-between items-start mb-6">
                      <div className="px-2.5 py-1 bg-primary/20 text-primary text-[10px] font-black rounded uppercase tracking-wider border border-primary/20">
                        {cls.course?.name?.slice(0, 6).toUpperCase() || "CLASS"}
                      </div>
                      <span className={`px-2.5 py-1 text-[10px] font-black rounded-full border ${statusTone.pillBg}`}>
                        {cls.status === "ACTIVE" ? "Ongoing" : cls.status === "FINISHED" ? "Completed" : "Upcoming"}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 line-clamp-1">{cls.name}</h3>

                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-500 dark:text-slate-400">
                        {(cls.teacher?.fullName || "GV").split(" ").slice(0, 2).map((p) => p[0]).join("")}
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-300">{cls.teacher?.fullName || "Giảng viên"}</span>
                    </div>

                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500 dark:text-slate-400">Progress</span>
                        <span className={`${statusTone.accent} font-black`}>{progress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${cls.status === "FINISHED" ? "bg-emerald-400" : cls.status === "PENDING" ? "bg-amber-400/40" : "bg-primary"}`} style={{ width: `${progress}%` }} />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <span className="material-symbols-outlined text-sm">
                          {cls.status === "FINISHED" ? "verified" : "schedule"}
                        </span>
                        <span>
                          {nextSlot
                            ? `Next: ${nextSlot.toLocaleDateString()} ${formatTime(nextSlot)}`
                            : cls.status === "FINISHED"
                              ? "Certified"
                              : "No schedule"}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => navigate(`/dashboard-program/classes/${cls._id}`)}
                        className={`${statusTone.accent} text-xs font-bold hover:underline transition-colors`}
                      >
                        {cls.status === "PENDING" ? "Prep Kit" : cls.status === "FINISHED" ? "View" : "Continue"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-2xl p-6 h-fit sticky top-24 bg-white/70 dark:bg-slate-800/30 backdrop-blur-xl border border-slate-200/60 dark:border-white/5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">event_upcoming</span>
                Sắp tới
              </h3>
              <button
                type="button"
                onClick={() => navigate("/dashboard-program/schedule")}
                className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline"
              >
                Full View
              </button>
            </div>

            <div className="space-y-3">
              {upcoming.length === 0 ? (
                <div className="text-sm text-slate-500 dark:text-slate-400">Chưa có lịch học sắp tới.</div>
              ) : (
                upcoming.map((u) => {
                  const tone =
                    u.tone === "primary"
                      ? "bg-primary/10 text-primary"
                      : u.tone === "amber"
                        ? "bg-amber-400/10 text-amber-500"
                        : "bg-slate-100 dark:bg-white/5 text-slate-400";
                  return (
                    <button
                      key={`${u.classId}-${u.start.toISOString()}`}
                      type="button"
                      onClick={() => navigate(`/dashboard-program/classes/${u.classId}`)}
                      className="w-full flex gap-4 p-3 rounded-xl hover:bg-slate-100/70 dark:hover:bg-white/5 transition-colors text-left group"
                    >
                      <div className={`flex flex-col items-center justify-center min-w-[50px] h-[50px] rounded-lg ${tone}`}>
                        <span className="text-xs font-black leading-none uppercase">{formatMonthShort(u.start)}</span>
                        <span className="text-xl font-black leading-none">{formatDay2(u.start)}</span>
                      </div>
                      <div className="flex flex-col justify-center overflow-hidden">
                        <span className="text-sm font-black text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors">
                          {u.className}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">schedule</span>
                          {formatTime(u.start)} - {formatTime(u.end)}
                          {u.courseName ? ` · ${u.courseName}` : ""}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentClassManagement;

