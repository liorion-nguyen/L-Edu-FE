import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RootState, useSelector } from "../../../redux/store";
import { studentClassService } from "../../../services/studentClassService";
import type { ClassDetail, ClassSummary, MyAttendanceRecord, SessionItem } from "../../../types/class";

const INSTRUCTOR_IMG_1 =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBIiSrbTWXOCnL4EYjqeFQOXLd8V-rNWnRyxfg9rUHRxZvVYwm6TPkfURYcfBXtR71Bfuo9Y0SQYaX79pbHwMM-4wrxPZQYqAXbmZ45KGexnSWx3FgocFuwKrr_aHXB7Mgnz_1y3szbh49AWTZp1CmaVtbK3Z3Da_UqFFVdlwFuR_PxNpw1pP4C3GK5KZp3bJjwpZ-iRXpzierpRlrlbib-DlUfz1PaW_a0gHw4BPAc4NyrI7xVkgZTbtMX6gxaA3pDjiUEJ2_Zvsw";
const INSTRUCTOR_IMG_2 =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD-LwHOnqti3Y6uWP9PYikLOxmI8GP28qoFOIyg_Wkeg6vbw6hljUlBCBxZHSZeE5ic4hvatKKmWW_suZo_KWV3cq1gmfzR4Ifj9Ek4f1foPpQhQDeco5BUCKhJvcbwIZNrzXmNjSK8puZFocRxicmSXEavi3F3S21XyHkT0LK3BW27ACaV2fPBg9VEHaljHwOkKy3gIsP9qrhJLO_U581VLDIWYdNZw7_5dHREpjq-OEbQq2T55zsmrS97oX_9V7Op5GD-U2vpbdE";

type OverviewTabKey = "overview" | "schedule" | "sessions" | "homework";

const ClassDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((s: RootState) => s.auth);
  const [tab, setTab] = useState<OverviewTabKey>("overview");
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);
  const [classes, setClasses] = useState<ClassSummary[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [detail, setDetail] = useState<ClassDetail | null>(null);
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [att, setAtt] = useState<MyAttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionNotes, setSessionNotes] = useState<Record<string, { note: any; loading: boolean; error?: string }>>({});

  useEffect(() => {
    if (!user?._id) return;
    const run = async () => {
      setLoading(true);
      try {
        const list = await studentClassService.getMyClasses();
        const safe = Array.isArray(list) ? list : [];
        setClasses(safe);
        const preferred = safe.find((c) => c.status === "ACTIVE")?._id ?? safe[0]?._id ?? null;
        setSelectedClassId(preferred);
      } catch {
        setClasses([]);
        setSelectedClassId(null);
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [user?._id]);

  useEffect(() => {
    if (!selectedClassId || !user?._id) return;
    const run = async () => {
      setLoading(true);
      try {
        const [d, s, a] = await Promise.all([
          studentClassService.getClassDetail(selectedClassId),
          studentClassService.getClassSessions(selectedClassId),
          studentClassService.getMyAttendances(selectedClassId),
        ]);
        setDetail(d);
        setSessions(Array.isArray(s) ? s : []);
        setAtt(Array.isArray(a) ? a : []);
      } catch {
        setDetail(null);
        setSessions([]);
        setAtt([]);
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [selectedClassId, user?._id]);

  const activeClass = useMemo(() => {
    if (selectedClassId) return classes.find((c) => c._id === selectedClassId) ?? null;
    return classes[0] ?? null;
  }, [classes, selectedClassId]);

  const attendancePercent = useMemo(() => {
    if (!att.length) return 0;
    const marked = att.filter((r) => r.status !== "NOT_MARKED");
    if (!marked.length) return 0;
    const presentLike = marked.filter((r) => ["PRESENT", "LATE", "EXCUSED"].includes(r.status)).length;
    return Math.round((presentLike / marked.length) * 100);
  }, [att]);

  const overallProgressPercent = useMemo(() => {
    const total = detail?.totalSessions ?? sessions.length ?? 0;
    if (!total) return 0;
    const done = detail?.status === "FINISHED" ? total : Math.min(att.length, total);
    return Math.max(0, Math.min(100, Math.round((done / total) * 100)));
  }, [detail?.status, detail?.totalSessions, sessions.length, att.length]);

  const nextSessionText = useMemo(() => {
    const slot = activeClass?.scheduleSlots?.[0];
    if (!slot?.date || !slot?.timeStart) return "Next session: --";
    return `Next session: ${slot.date} ${slot.timeStart}`;
  }, [activeClass?.scheduleSlots]);

  const attendanceBySessionId = useMemo(() => {
    const map = new Map<string, MyAttendanceRecord>();
    for (const r of att) map.set(r.sessionId, r);
    return map;
  }, [att]);

  const loadSessionNote = async (sessionId: string) => {
    const classId = selectedClassId;
    if (!classId) return;
    setSessionNotes((prev) => ({
      ...prev,
      [sessionId]: { note: prev[sessionId]?.note, loading: true },
    }));
    try {
      const note = await studentClassService.getDashboardSessionNote(classId, sessionId);
      setSessionNotes((prev) => ({ ...prev, [sessionId]: { note, loading: false } }));
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || "Không thể tải nhận xét";
      setSessionNotes((prev) => ({ ...prev, [sessionId]: { note: null, loading: false, error: msg } }));
    }
  };

  const parseTeacherComment = (raw: string | undefined) => {
    if (!raw || !raw.trim()) return null;
    const s = raw.trim();
    if (!s.startsWith("{")) return null;
    try {
      return JSON.parse(s);
    } catch {
      return null;
    }
  };

  const renderRatingRow = (label: string, value?: number, comment?: string) => {
    const v = typeof value === "number" ? Math.max(1, Math.min(5, value)) : 0;
    return (
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 py-4 border-t border-slate-200/60 dark:border-slate-800/30">
        <div className="md:col-span-5">
          <div className="text-sm font-bold text-slate-900 dark:text-white">{label}</div>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {comment && comment.trim() ? comment : "Nhận xét thêm..."}
          </div>
        </div>
        <div className="md:col-span-7 flex items-center justify-between gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="flex flex-col items-center gap-2">
              <div className="text-xs font-bold text-slate-600 dark:text-slate-300">{n}</div>
              <div
                className={[
                  "h-4 w-4 rounded-full border",
                  v === n ? "border-primary bg-primary" : "border-slate-300 dark:border-slate-600 bg-transparent",
                ].join(" ")}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="text-slate-900 dark:text-slate-100">
      {/* Hero Header (overview_classes) */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/20 to-indigo-900/20 rounded-3xl p-8 mb-8 border border-slate-200/60 dark:border-white/5">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="bg-blue-500 text-[10px] font-bold px-2 py-0.5 rounded text-white uppercase">
                {detail?.status === "FINISHED" ? "Completed" : detail?.status === "PENDING" ? "Upcoming" : "Active"}
              </span>
              <span className="text-slate-500 dark:text-slate-400 text-sm">
                {detail?.course?.name ? `Course: ${detail.course.name}` : "Course: --"}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {detail?.name || (loading ? "Đang tải lớp..." : "Chưa có lớp")}
            </h2>
            <div className="flex items-center gap-4 pt-2 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800">
                  <img alt="" className="w-full h-full object-cover" src={INSTRUCTOR_IMG_1} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Instructor</p>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {detail?.teacher?.fullName || "Giảng viên"}
                  </p>
                </div>
              </div>
              <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Duration</p>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {detail?.totalSessions ? `${detail.totalSessions} buổi` : `${sessions.length} buổi`}
                </p>
              </div>
            </div>
          </div>

          <div className="w-full md:w-64 bg-white/50 dark:bg-slate-900/30 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/60 dark:border-white/5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Overall Progress</span>
              <span className="text-xs font-bold text-primary">{overallProgressPercent}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full shadow-[0_0_8px_rgba(0,127,255,0.5)]"
                style={{ width: `${overallProgressPercent}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2">{nextSessionText}</p>
          </div>
        </div>

        <span className="material-symbols-outlined absolute -bottom-10 -right-10 text-[200px] opacity-10 text-primary pointer-events-none">
          terminal
        </span>
      </div>

      {/* Tab Navigation (changed usage) */}
      <nav className="flex items-center gap-8 mb-8 border-b border-slate-200 dark:border-slate-800/50 overflow-x-auto">
        {(
          [
            { key: "overview", label: "Overview" },
            { key: "schedule", label: "Schedule" },
            { key: "sessions", label: "Sessions" },
            { key: "homework", label: "Homework" },
          ] as const
        ).map((it) => (
          <button
            key={it.key}
            type="button"
            onClick={() => setTab(it.key)}
            className={
              tab === it.key
                ? "px-2 py-4 text-primary font-bold border-b-2 border-primary transition-all whitespace-nowrap"
                : "px-2 py-4 text-slate-500 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-slate-200 transition-all whitespace-nowrap"
            }
          >
            {it.label}
          </button>
        ))}
      </nav>

      {tab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Instructor */}
          <div className="md:col-span-4 bg-white dark:bg-[#0f1923] p-6 rounded-2xl border border-slate-200/60 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-all group">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">person</span>
              Giảng viên hướng dẫn
            </h3>
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-primary to-indigo-500 mb-4">
                <img alt="" className="w-full h-full object-cover rounded-full border-2 border-white dark:border-[#0f1923]" src={INSTRUCTOR_IMG_2} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{detail?.teacher?.fullName || "Giảng viên"}</h4>
              <p className="text-primary text-xs font-medium mb-4">{detail?.teacher?.email || "—"}</p>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
                Theo dõi tiến độ học tập và xem thông tin khóa học của bạn trong từng tuần.
              </p>
              <div className="flex gap-2 w-full">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard-program/settings")}
                  className="flex-1 bg-slate-100 dark:bg-slate-800 py-2 rounded-lg text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Profile
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/dashboard-program/classes")}
                  className="flex-1 border border-slate-200 dark:border-slate-700 py-2 rounded-lg text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  My Classes
                </button>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Course info */}
            <div className="bg-white dark:bg-[#0f1923] p-6 rounded-2xl border border-slate-200/60 dark:border-white/5 flex flex-col">
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">info</span>
                Thông tin khóa học
              </h3>
              <ul className="space-y-4 flex-1">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary">schedule</span>
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Thời lượng &amp; Lịch học</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {detail?.totalSessions ? `${detail.totalSessions} buổi` : `${sessions.length} buổi`}{" "}
                      {activeClass?.scheduleFrequency ? `| ${activeClass.scheduleFrequency}` : ""}
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary">menu_book</span>
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Curriculum</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {sessions.slice(0, 4).map((s) => (
                        <span key={s._id} className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] px-2 py-1 rounded">
                          Session {s.sessionNumber || s.order || 0}
                        </span>
                      ))}
                      {sessions.length === 0 && (
                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] px-2 py-1 rounded">
                          —
                        </span>
                      )}
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary">verified_user</span>
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Chứng chỉ</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Professional Certificate of Completion</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Progress & Attendance */}
            <div className="bg-white dark:bg-[#0f1923] p-6 rounded-2xl border border-slate-200/60 dark:border-white/5">
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">bar_chart</span>
                Tiến độ &amp; Chuyên cần
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-xs text-slate-600 dark:text-slate-300">Chuyên cần (Attendance)</span>
                    <span className="text-xs font-bold text-emerald-500">{attendancePercent}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full" style={{ width: `${attendancePercent}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-xs text-slate-600 dark:text-slate-300">Buổi đã học</span>
                    <span className="text-xs font-bold text-primary">
                      {Math.min(att.length, detail?.totalSessions ?? sessions.length)}/{detail?.totalSessions ?? sessions.length}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-full" style={{ width: `${overallProgressPercent}%` }} />
                  </div>
                </div>
                <div className="pt-4 grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl text-center">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Xếp loại</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">A-</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl text-center">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Xếp hạng</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">#04</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Teacher feedback */}
            <div className="md:col-span-2 bg-gradient-to-r from-white to-slate-50 dark:from-[#0f1923] dark:to-slate-900/50 p-6 rounded-2xl border border-slate-200/60 dark:border-white/5 relative">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">forum</span>
                    Nhận xét từ giảng viên
                  </h3>
                </div>
                <div className="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full">
                  <span className="material-symbols-outlined text-primary text-sm">star</span>
                  <span className="text-primary font-bold text-sm">4.8</span>
                </div>
              </div>
              <div className="bg-slate-100/70 dark:bg-slate-900/40 p-4 rounded-xl border-l-4 border-primary">
                <p className="text-slate-700 dark:text-slate-200 italic text-sm leading-relaxed">
                  "Bạn đang tiến bộ tốt. Hãy duy trì nhịp học và hoàn thành bài tập đúng hạn để tối ưu kết quả."
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-[10px] text-slate-500 dark:text-slate-500">Cập nhật lúc: --</div>
                <button type="button" className="text-primary text-xs font-bold hover:underline">
                  Xem tất cả nhận xét
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "schedule" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Schedule List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-2 gap-3 flex-wrap">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Danh sách buổi học tuần này</h2>
              <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full border border-primary/20">
                TRỰC TUYẾN
              </span>
            </div>

            {(() => {
              const raw = activeClass?.scheduleSlots ?? [];
              const items = raw
                .map((s, idx) => {
                  const start = new Date(`${s.date}T${s.timeStart || "00:00"}:00`);
                  const end = new Date(`${s.date}T${s.timeEnd || "00:00"}:00`);
                  return {
                    key: `${s.date}-${s.timeStart}-${idx}`,
                    slot: s,
                    start,
                    end,
                    title: sessions[idx]?.title || `Buổi học ${idx + 1}`,
                    done: Number.isFinite(start.getTime()) ? start.getTime() < Date.now() : false,
                  };
                })
                .filter((it) => Number.isFinite(it.start.getTime()))
                .sort((a, b) => a.start.getTime() - b.start.getTime());

              const nextIndex = items.findIndex((it) => it.start.getTime() >= Date.now());
              const next = nextIndex >= 0 ? items[nextIndex] : null;
              const rest = items.filter((it) => it !== next).slice(0, 6);

              const viWeekday = (d: Date) => {
                const day = d.getDay();
                if (day === 0) return "CN";
                return `T${day + 1}`;
              };
              const dd = (d: Date) => String(d.getDate()).padStart(2, "0");
              const hhmm = (d: Date) => d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

              if (!items.length) {
                return (
                  <div className="bg-white dark:bg-[#0f1923] rounded-xl p-6 border border-slate-200/60 dark:border-slate-800/30">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Lớp hiện tại chưa có lịch học. Vui lòng liên hệ giảng viên hoặc chờ cập nhật.
                    </p>
                  </div>
                );
              }

              return (
                <>
                  {/* Highlighted Nearest Session */}
                  {next && (
                    <div className="group bg-white dark:bg-slate-900/40 border-2 border-primary/40 rounded-xl p-6 relative overflow-hidden shadow-lg transition-all hover:border-primary">
                      <div className="absolute top-0 right-0 px-4 py-1 bg-primary text-white text-[10px] font-bold rounded-bl-xl uppercase tracking-widest">
                        Sắp diễn ra
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-14 bg-primary/10 rounded-xl flex flex-col items-center justify-center text-primary">
                            <span className="text-xs font-bold uppercase">{viWeekday(next.start)}</span>
                            <span className="text-xl font-bold">{dd(next.start)}</span>
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{next.title}</h4>
                            <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                              <div className="flex items-center">
                                <span className="material-symbols-outlined text-sm mr-1">schedule</span>
                                {hhmm(next.start)} - {hhmm(next.end)}
                              </div>
                              <div className="flex items-center text-emerald-500">
                                <span className="material-symbols-outlined text-sm mr-1">videocam</span>
                                Zoom Meeting
                              </div>
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => navigate(`/dashboard-program/classes/${selectedClassId || ""}`)}
                          className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm shadow-md transition-all hover:shadow-primary/20 hover:scale-105 active:scale-95"
                        >
                          Tham gia ngay
                          <span className="material-symbols-outlined ml-2 text-sm">open_in_new</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Regular Sessions */}
                  {rest.map((it) => (
                    <div
                      key={it.key}
                      className="bg-white dark:bg-[#0f1923] rounded-xl p-6 border border-slate-200/60 dark:border-slate-800/30 transition-all hover:bg-slate-50 dark:hover:bg-slate-900/40"
                    >
                      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 ${it.done ? "opacity-70" : ""}`}>
                        <div className="flex items-center space-x-4">
                          <div
                            className={[
                              "w-14 h-14 rounded-xl flex flex-col items-center justify-center",
                              it.done
                                ? "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300",
                            ].join(" ")}
                          >
                            <span className="text-xs font-bold uppercase">{viWeekday(it.start)}</span>
                            <span className="text-xl font-bold">{dd(it.start)}</span>
                          </div>
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="text-lg font-bold text-slate-900 dark:text-white">{it.title}</h4>
                              {it.done && (
                                <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded font-bold">
                                  HOÀN THÀNH
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                              <div className="flex items-center">
                                <span className="material-symbols-outlined text-sm mr-1">schedule</span>
                                {hhmm(it.start)} - {hhmm(it.end)}
                              </div>
                              <div className="flex items-center">
                                <span className="material-symbols-outlined text-sm mr-1">{it.done ? "history" : "link"}</span>
                                {it.done ? "Xem lại bản ghi" : "Đã có link Zoom"}
                              </div>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => navigate(`/dashboard-program/classes/${selectedClassId || ""}`)}
                          className={[
                            "px-6 py-3 rounded-xl font-bold text-sm transition-all",
                            it.done
                              ? "border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                              : "border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed",
                          ].join(" ")}
                          disabled={!it.done}
                        >
                          {it.done ? "Tài liệu buổi học" : "Chưa mở"}
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              );
            })()}
          </div>

          {/* Sidebar Info / Overview */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#0f1923] p-6 rounded-xl border border-slate-200/60 dark:border-slate-800/30">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Chi tiết giảng dạy</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm gap-3">
                  <span className="text-slate-500 dark:text-slate-400">Thời gian học</span>
                  <span className="text-slate-900 dark:text-slate-100 font-semibold text-right">
                    {activeClass?.scheduleFrequency || "—"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm gap-3">
                  <span className="text-slate-500 dark:text-slate-400">Khung giờ</span>
                  <span className="text-slate-900 dark:text-slate-100 font-semibold text-right">
                    {activeClass?.scheduleSlots?.[0]?.timeStart && activeClass?.scheduleSlots?.[0]?.timeEnd
                      ? `${activeClass.scheduleSlots[0].timeStart} - ${activeClass.scheduleSlots[0].timeEnd}`
                      : "—"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm gap-3">
                  <span className="text-slate-500 dark:text-slate-400">Nền tảng</span>
                  <span className="text-emerald-500 font-semibold text-right">Zoom</span>
                </div>
                <div className="flex justify-between items-center text-sm gap-3">
                  <span className="text-slate-500 dark:text-slate-400">Chứng chỉ</span>
                  <span className="text-primary font-semibold text-right">Certificate</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#0f1923] p-6 rounded-xl border border-slate-200/60 dark:border-slate-800/30">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Hạn chót bài tập</h3>
              <div className="space-y-4">
                <div className="p-3 bg-red-500/10 border-l-4 border-red-500 rounded-r-lg">
                  <p className="text-xs text-red-500 font-bold uppercase mb-1">2 ngày nữa</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Bài tập (demo)</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-lg">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase mb-1">Tuần sau</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Báo cáo (demo)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "sessions" && (
        <div>
          {/* Sessions Accordion List (tab_buoi_hoc) */}
          <div className="max-w-4xl space-y-4">
            {sessions.length === 0 ? (
              <div className="bg-white dark:bg-[#0f1923] rounded-xl p-6 border border-slate-200/60 dark:border-slate-800/30">
                <p className="text-sm text-slate-500 dark:text-slate-400">Chưa có buổi học.</p>
              </div>
            ) : (
              sessions.map((s, idx) => {
                const slot = activeClass?.scheduleSlots?.[idx];
                const start = slot?.date ? new Date(`${slot.date}T${slot.timeStart || "00:00"}:00`) : null;
                const isFuture = start ? start.getTime() > Date.now() : false;
                const record = attendanceBySessionId.get(s._id);
                const presentLike = record ? ["PRESENT", "LATE", "EXCUSED"].includes(record.status) : false;
                const missed = record?.status === "ABSENT";
                const completed = !isFuture && (presentLike || (!record && start ? start.getTime() < Date.now() : false));

                const tone = completed
                  ? {
                      borderHover: "hover:border-emerald-500/30",
                      iconWrap: "bg-emerald-500/10 text-emerald-500",
                      icon: "check_circle",
                      badge: "bg-emerald-500/10 text-emerald-500",
                      badgeText: "Hoàn thành",
                    }
                  : isFuture
                    ? {
                        borderHover: "hover:border-amber-500/30",
                        iconWrap: "bg-amber-500/10 text-amber-500",
                        icon: "schedule",
                        badge: "bg-amber-500/10 text-amber-500",
                        badgeText: "Sắp diễn ra",
                      }
                    : missed
                      ? {
                          borderHover: "hover:border-red-500/30",
                          iconWrap: "bg-red-500/10 text-red-500",
                          icon: "event_busy",
                          badge: "bg-red-500/10 text-red-500",
                          badgeText: "Vắng mặt",
                        }
                      : {
                          borderHover: "hover:border-primary/30",
                          iconWrap: "bg-primary/10 text-primary",
                          icon: "menu_book",
                          badge: "bg-primary/10 text-primary",
                          badgeText: "Đã diễn ra",
                        };

                const dateLabel = start
                  ? start.toLocaleDateString("vi-VN", { day: "2-digit", month: "long", year: "numeric" })
                  : "—";

                const expanded = expandedSessionId === s._id;

                return (
                  <div
                    key={s._id}
                    className={[
                      "bg-white dark:bg-[#0f1923] rounded-xl border border-slate-200/60 dark:border-slate-800/30 overflow-hidden group transition-all duration-300",
                      tone.borderHover,
                    ].join(" ")}
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedSessionId((cur) => (cur === s._id ? null : s._id))}
                      className="w-full p-5 flex items-center justify-between text-left"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${tone.iconWrap}`}>
                          <span className="material-symbols-outlined">{tone.icon}</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 dark:text-white">{s.title}</h3>
                          <div className="flex items-center space-x-3 mt-1">
                            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                              <span className="material-symbols-outlined text-xs mr-1">calendar_month</span> {dateLabel}
                            </span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight ${tone.badge}`}>
                              {tone.badgeText}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span
                        className={[
                          "material-symbols-outlined text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-transform duration-300",
                          expanded ? "rotate-180" : "",
                        ].join(" ")}
                      >
                        expand_more
                      </span>
                    </button>

                    {expanded && (
                      <div className="px-5 pb-5 pt-0 border-t border-slate-200/60 dark:border-slate-800/30">
                        {(() => {
                          const state = sessionNotes[s._id];
                          const note = state?.note as any;
                          const isLoading = state?.loading;
                          const error = state?.error;

                          if (!state && selectedClassId) {
                            void loadSessionNote(s._id);
                          }

                          const teacherPayload =
                            note?.studentComments?.map((c: any) => parseTeacherComment(c?.comment)).find(Boolean) ?? null;

                          const generalReview: string | undefined = teacherPayload?.generalReview;
                          const criteria = teacherPayload?.criteria || {};

                          const contentHtml = note?.sessionContent || "";
                          const homeworkHtml = note?.homework || "";

                          return (
                            <div className="mt-4 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-lg relative overflow-hidden">
                          <div className="absolute right-[-20px] top-[-20px] opacity-[0.06] pointer-events-none">
                            <span className="material-symbols-outlined text-8xl">forum</span>
                          </div>
                          <h4 className="text-xs font-bold text-primary mb-2 uppercase tracking-widest">Nhận xét của giảng viên</h4>
                          {isLoading ? (
                            <p className="text-sm text-slate-500 dark:text-slate-400">Đang tải nhận xét...</p>
                          ) : error ? (
                            <p className="text-sm text-red-500">{error}</p>
                          ) : (
                            <>
                              {!!generalReview && (
                                <div
                                  className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed italic"
                                  dangerouslySetInnerHTML={{ __html: generalReview }}
                                />
                              )}

                              {(contentHtml || homeworkHtml) && (
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {contentHtml && (
                                    <div className="rounded-xl border border-slate-200/60 dark:border-slate-800/30 bg-white/70 dark:bg-slate-950/20 p-4">
                                      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                                        Tổng kết bài học
                                      </div>
                                      <div
                                        className="mt-2 text-sm text-slate-700 dark:text-slate-200"
                                        dangerouslySetInnerHTML={{ __html: contentHtml }}
                                      />
                                    </div>
                                  )}
                                  {homeworkHtml && (
                                    <div className="rounded-xl border border-slate-200/60 dark:border-slate-800/30 bg-white/70 dark:bg-slate-950/20 p-4">
                                      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                                        Bài tập về nhà
                                      </div>
                                      <div
                                        className="mt-2 text-sm text-slate-700 dark:text-slate-200"
                                        dangerouslySetInnerHTML={{ __html: homeworkHtml }}
                                      />
                                    </div>
                                  )}
                                </div>
                              )}

                              {teacherPayload?.criteria && (
                                <div className="mt-4 rounded-xl border border-slate-200/60 dark:border-slate-800/30 bg-white/70 dark:bg-slate-950/20">
                                  <div className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                                    Đánh giá
                                  </div>
                                  <div className="px-4">
                                    {renderRatingRow("Kiến thức trên lớp", criteria?.knowledge?.rating, criteria?.knowledge?.comment)}
                                    {renderRatingRow("Thái độ học tập trên lớp", criteria?.attitude?.rating, criteria?.attitude?.comment)}
                                    {renderRatingRow("Kỹ năng giao tiếp, hợp tác", criteria?.communication?.rating, criteria?.communication?.comment)}
                                    {renderRatingRow("Kỹ năng giải quyết vấn đề", criteria?.problemSolving?.rating, criteria?.problemSolving?.comment)}
                                    {renderRatingRow("Kỹ năng sáng tạo", criteria?.creativity?.rating, criteria?.creativity?.comment)}
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                          <div className="mt-4 flex space-x-4">
                            <button
                              type="button"
                              className="text-xs font-bold text-primary hover:underline flex items-center"
                              onClick={() => navigate(`/dashboard-program/learn/document/${s._id}`)}
                            >
                              <span className="material-symbols-outlined text-sm mr-1">menu_book</span> Xem bài giảng
                            </button>
                            <button
                              type="button"
                              className="text-xs font-bold text-primary hover:underline flex items-center"
                              onClick={() => navigate(`/dashboard-program/classes/${selectedClassId || ""}`)}
                            >
                              <span className="material-symbols-outlined text-sm mr-1">play_circle</span> Xem lại video
                            </button>
                          </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Stats Bento Card (tab_buoi_hoc) */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
            <div className="bg-white dark:bg-[#0f1923] p-6 rounded-xl border border-slate-200/60 dark:border-slate-800/30 relative overflow-hidden group">
              <div className="absolute right-[-10px] bottom-[-10px] text-primary/10 group-hover:text-primary/20 transition-colors">
                <span className="material-symbols-outlined text-6xl">grade</span>
              </div>
              <div className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Chuyên cần</div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{attendancePercent}%</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-2">Dựa trên {att.length} buổi có điểm danh</div>
            </div>
            <div className="bg-white dark:bg-[#0f1923] p-6 rounded-xl border border-slate-200/60 dark:border-slate-800/30 relative overflow-hidden group">
              <div className="absolute right-[-10px] bottom-[-10px] text-emerald-500/10 group-hover:text-emerald-500/20 transition-colors">
                <span className="material-symbols-outlined text-6xl">verified</span>
              </div>
              <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1">Hoàn thành</div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">
                {Math.min(att.length, detail?.totalSessions ?? sessions.length)}/{detail?.totalSessions ?? sessions.length}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-2">Buổi học đã kết thúc</div>
            </div>
            <div className="bg-primary/5 p-6 rounded-xl border border-primary/20 relative overflow-hidden group">
              <div className="absolute right-[-10px] bottom-[-10px] text-primary/10 group-hover:text-primary/20 transition-colors">
                <span className="material-symbols-outlined text-6xl">bolt</span>
              </div>
              <div className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Cấp độ tiếp theo</div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">L4</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-2">+120 XP sau khi hoàn thành khóa</div>
            </div>
          </div>
        </div>
      )}

      {tab === "homework" && (
        <div className="rounded-2xl p-6 bg-white dark:bg-[#0f1923] border border-slate-200/60 dark:border-white/5">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Homework</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Chưa có dữ liệu bài tập (sẽ nối API sau).</p>
        </div>
      )}
    </div>
  );
};

export default ClassDetailPage;
