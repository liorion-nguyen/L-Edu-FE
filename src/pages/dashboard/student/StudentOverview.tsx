import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { localStorageConfig } from "../../../config";
import { RootState, useSelector } from "../../../redux/store";
import { studentClassService } from "../../../services/studentClassService";
import type { ClassSummary } from "../../../types/class";

const INSTRUCTOR_IMG_1 =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBIiSrbTWXOCnL4EYjqeFQOXLd8V-rNWnRyxfg9rUHRxZvVYwm6TPkfURYcfBXtR71Bfuo9Y0SQYaX79pbHwMM-4wrxPZQYqAXbmZ45KGexnSWx3FgocFuwKrr_aHXB7Mgnz_1y3szbh49AWTZp1CmaVtbK3Z3Da_UqFFVdlwFuR_PxNpw1pP4C3GK5KZp3bJjwpZ-iRXpzierpRlrlbib-DlUfz1PaW_a0gHw4BPAc4NyrI7xVkgZTbtMX6gxaA3pDjiUEJ2_Zvsw";
const INSTRUCTOR_IMG_2 =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD-LwHOnqti3Y6uWP9PYikLOxmI8GP28qoFOIyg_Wkeg6vbw6hljUlBCBxZHSZeE5ic4hvatKKmWW_suZo_KWV3cq1gmfzR4Ifj9Ek4f1foPpQhQDeco5BUCKhJvcbwIZNrzXmNjSK8puZFocRxicmSXEavi3F3S21XyHkT0LK3BW27ACaV2fPBg9VEHaljHwOkKy3gIsP9qrhJLO_U581VLDIWYdNZw7_5dHREpjq-OEbQq2T55zsmrS97oX_9V7Op5GD-U2vpbdE";

const StudentOverview: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((s: RootState) => s.auth);
  const displayName = user?.fullName || "bạn";
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

  const { totalClasses, activeClasses, finishedClasses, pendingClasses, totalCourses } = useMemo(() => {
    const totalClasses = classes.length;
    const activeClasses = classes.filter((c) => c.status === "ACTIVE").length;
    const finishedClasses = classes.filter((c) => c.status === "FINISHED").length;
    const pendingClasses = classes.filter((c) => c.status === "PENDING").length;
    const courseIds = new Set<string>();
    classes.forEach((c) => {
      if (c.courseId) courseIds.add(String(c.courseId));
      else if (c.course?._id) courseIds.add(String(c.course._id));
    });
    return {
      totalClasses,
      activeClasses,
      finishedClasses,
      pendingClasses,
      totalCourses: courseIds.size,
    };
  }, [classes]);

  const stats = useMemo(
    () => [
      { label: "Tổng số lớp", value: String(totalClasses), icon: "groups", muted: totalClasses === 0 },
      { label: "Đang học", value: String(activeClasses), icon: "auto_stories", muted: activeClasses === 0 },
      { label: "Hoàn thành", value: String(finishedClasses), icon: "verified", muted: finishedClasses === 0 },
      { label: "Chờ khai giảng", value: String(pendingClasses), icon: "event_upcoming", muted: pendingClasses === 0 },
    ],
    [activeClasses, finishedClasses, pendingClasses, totalClasses],
  );

  const courseCards = useMemo(() => {
    const sorted = classes.slice().sort((a, b) => {
      const at = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bt = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bt - at;
    });
    return sorted.slice(0, 2).map((cls, idx) => {
      const isActive = cls.status === "ACTIVE";
      const isPending = cls.status === "PENDING";
      const gradient = isActive
        ? "linear-gradient(135deg, #2383e2 0%, #4338ca 100%)"
        : isPending
          ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
          : "linear-gradient(135deg, #10b981 0%, #0ea5e9 100%)";
      const decoIcon = idx % 2 === 0 ? "code" : "terminal";
      const instructorImg = idx % 2 === 0 ? INSTRUCTOR_IMG_1 : INSTRUCTOR_IMG_2;
      const sessions = cls.totalSessions ? `${cls.totalSessions} buổi học` : "— buổi học";
      const code = cls.course?.name ? cls.course.name : "IT-PRO";
      return {
        classId: cls._id,
        code,
        title: cls.name,
        sessions,
        gradient,
        decoIcon,
        instructorImg,
        teacherName: cls.teacher?.fullName ? `GV: ${cls.teacher.fullName}` : "GV: —",
        status: cls.status,
      };
    });
  }, [classes]);

  const allocation = useMemo(() => {
    const total = Math.max(1, totalClasses);
    return {
      activePct: Math.round((activeClasses / total) * 100),
      finishedPct: Math.round((finishedClasses / total) * 100),
      pendingPct: Math.max(0, 100 - Math.round((activeClasses / total) * 100) - Math.round((finishedClasses / total) * 100)),
    };
  }, [activeClasses, finishedClasses, totalClasses]);

  return (
    <div className="text-slate-900 dark:text-slate-100">
      {/* Welcome */}
      <section className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold dark:text-white md:text-3xl">
            Xin chào, {displayName} 👋
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">
            {loading ? (
              "Đang tải dữ liệu..."
            ) : (
              <>
                Bạn đang tham gia{" "}
                <span className="text-primary font-semibold">{totalCourses} khoá học</span> với{" "}
                <span className="text-primary font-semibold">{activeClasses} lớp</span> đang học.
              </>
            )}
          </p>
          <div className="flex flex-wrap gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard-program/classes")}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-primary/30 active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-base">play_circle</span>
              Vào lớp học
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard-program/courses")}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 px-6 py-2.5 rounded-xl font-bold transition-all dark:text-white"
            >
              Khám phá khoá học
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white dark:bg-slate-800/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm"
          >
            <div className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{s.label}</div>
            <div className="flex items-end justify-between">
              <span
                className={`text-3xl font-bold ${s.muted ? "text-slate-400 dark:text-slate-500" : "text-slate-900 dark:text-white"}`}
              >
                {s.value}
              </span>
              <div
                className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                  s.icon === "groups"
                    ? "bg-primary/10 text-primary"
                    : s.icon === "auto_stories"
                      ? "bg-emerald-500/10 text-emerald-500"
                      : s.icon === "verified"
                        ? "bg-amber-500/10 text-amber-500"
                        : "bg-indigo-500/10 text-indigo-500"
                }`}
              >
                <span className="material-symbols-outlined">{s.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Phân bổ */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h3 className="text-lg font-bold dark:text-white">Phân bổ khóa học</h3>
          <div className="flex gap-4 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500" /> Đang học
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500" /> Đã xong
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700" /> Chờ
            </div>
          </div>
        </div>
        <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full flex overflow-hidden">
          <div className="h-full bg-emerald-500" style={{ width: `${allocation.activePct}%` }} />
          <div className="h-full bg-amber-500" style={{ width: `${allocation.finishedPct}%` }} />
          <div className="h-full bg-slate-300 dark:bg-slate-700" style={{ width: `${allocation.pendingPct}%` }} />
        </div>
      </section>

      {/* Course cards */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {courseCards.map((c) => (
          <div
            key={c.title}
            className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl overflow-hidden hover:shadow-xl transition-all group"
          >
            <div
              className="h-32 p-6 relative"
              style={{ background: c.gradient }}
            >
              <div
                className={`absolute top-4 right-4 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
                  c.status === "ACTIVE" ? "bg-emerald-500" : c.status === "FINISHED" ? "bg-amber-500" : "bg-slate-700"
                }`}
              >
                {c.status === "ACTIVE" ? "Đang hoạt động" : c.status === "FINISHED" ? "Đã xong" : "Sắp khai giảng"}
              </div>
              <span
                className="material-symbols-outlined text-white/20 dark:text-white/10 text-7xl absolute -bottom-4 -right-4 select-none pointer-events-none"
                aria-hidden
              >
                {c.decoIcon}
              </span>
              <div className="h-full flex flex-col justify-end relative z-[1]">
                <span className="text-white/80 text-xs font-medium uppercase tracking-widest">{c.code}</span>
                <h4 className="text-white text-xl font-bold leading-tight mt-1">{c.title}</h4>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                  <img alt="" className="w-full h-full object-cover" src={c.instructorImg} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Giảng viên hướng dẫn</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{c.teacherName}</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-4 border-t border-slate-100 dark:border-slate-700/50">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <span className="material-symbols-outlined text-base">schedule</span>
                  <span className="text-sm font-medium">{c.sessions}</span>
                </div>
                <button
                  type="button"
                  onClick={() => navigate(`/dashboard-program/classes/${c.classId}`)}
                  className="text-primary font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all"
                >
                  Xem chi tiết
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default StudentOverview;
