import React, { useEffect, useMemo, useState } from "react";
import { studentClassService } from "../../../services/studentClassService";
import type { ScheduleEvent } from "../../../types/class";

type ViewMode = "calendar" | "list";

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}
function addMonths(d: Date, delta: number) {
  return new Date(d.getFullYear(), d.getMonth() + delta, 1);
}
function startOfWeek(d: Date) {
  // Sunday-based week to match screenshot
  const out = new Date(d);
  out.setDate(d.getDate() - d.getDay());
  out.setHours(0, 0, 0, 0);
  return out;
}
function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function ymd(d: Date) {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}
function fmtTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const StudentSchedulePage: React.FC = () => {
  const [mode, setMode] = useState<ViewMode>("calendar");
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const [cursorMonth, setCursorMonth] = useState(() => startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        // fetch next ~90 days (enough for schedule views)
        const from = new Date();
        const to = new Date();
        to.setDate(to.getDate() + 90);
        const list = await studentClassService.getMySchedule({ from: from.toISOString(), to: to.toISOString() });
        setEvents(Array.isArray(list) ? list : []);
      } catch {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, []);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, ScheduleEvent[]>();
    for (const e of events) {
      const key = ymd(new Date(e.start));
      const arr = map.get(key) || [];
      arr.push(e);
      map.set(key, arr);
    }
    map.forEach((arr, k) => {
      arr.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
      map.set(k, arr);
    });
    return map;
  }, [events]);

  const selectedEvents = useMemo(() => eventsByDay.get(ymd(selectedDate)) || [], [eventsByDay, selectedDate]);

  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursorMonth));
    const end = endOfMonth(cursorMonth);
    const days: Date[] = [];
    const cur = new Date(start);
    // show 6 weeks grid (like common calendars)
    for (let i = 0; i < 42; i++) {
      days.push(new Date(cur));
      cur.setDate(cur.getDate() + 1);
    }
    // ensure end is covered; 42 already covers
    void end;
    return days;
  }, [cursorMonth]);

  const monthLabel = useMemo(
    () =>
      cursorMonth.toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      }),
    [cursorMonth],
  );

  const upcomingList = useMemo(() => {
    const now = Date.now();
    return events
      .filter((e) => new Date(e.end).getTime() >= now)
      .slice()
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
      .slice(0, 50);
  }, [events]);

  return (
    <div className="text-slate-900 dark:text-slate-100">
      <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">Lịch học</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Xem các buổi học sắp tới theo lịch hoặc danh sách.</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-1 rounded-xl bg-white/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 backdrop-blur">
            <button
              type="button"
              onClick={() => setMode("calendar")}
              className={[
                "px-4 py-2 rounded-lg text-sm font-bold transition-colors",
                mode === "calendar" ? "bg-primary text-white shadow-sm" : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white",
              ].join(" ")}
            >
              Lịch
            </button>
            <button
              type="button"
              onClick={() => setMode("list")}
              className={[
                "px-4 py-2 rounded-lg text-sm font-bold transition-colors",
                mode === "list" ? "bg-primary text-white shadow-sm" : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white",
              ].join(" ")}
            >
              Danh sách
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl p-8 bg-white/70 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 animate-pulse">
          <div className="h-5 w-40 bg-slate-200 dark:bg-slate-700 rounded mb-6" />
          <div className="grid grid-cols-7 gap-3">
            {Array.from({ length: 28 }).map((_, i) => (
              <div key={i} className="h-16 rounded bg-slate-200 dark:bg-slate-700" />
            ))}
          </div>
        </div>
      ) : mode === "calendar" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-[#0f1923] border border-slate-200/60 dark:border-slate-800/30 overflow-hidden">
            {/* Calendar header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/60 dark:border-slate-800/30">
              <button
                type="button"
                onClick={() => {
                  const today = new Date();
                  setCursorMonth(startOfMonth(today));
                  setSelectedDate(today);
                }}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors"
              >
                TODAY
              </button>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCursorMonth((m) => addMonths(m, -1))}
                  className="h-9 w-9 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors"
                  aria-label="Prev month"
                >
                  <span className="material-symbols-outlined text-[20px] text-slate-600 dark:text-slate-300">chevron_left</span>
                </button>
                <div className="text-lg font-black text-slate-900 dark:text-white">{monthLabel}</div>
                <button
                  type="button"
                  onClick={() => setCursorMonth((m) => addMonths(m, 1))}
                  className="h-9 w-9 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors"
                  aria-label="Next month"
                >
                  <span className="material-symbols-outlined text-[20px] text-slate-600 dark:text-slate-300">chevron_right</span>
                </button>
              </div>
              <div className="w-[70px]" />
            </div>

            {/* Weekday header */}
            <div className="grid grid-cols-7 border-b border-slate-200/60 dark:border-slate-800/30 bg-slate-50 dark:bg-slate-900/30">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d} className="px-3 py-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                  {d}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7">
              {calendarDays.map((d, idx) => {
                const inMonth = d.getMonth() === cursorMonth.getMonth();
                const key = ymd(d);
                const count = (eventsByDay.get(key) || []).length;
                const selected = sameDay(d, selectedDate);
                const today = sameDay(d, new Date());
                return (
                  <button
                    key={`${key}-${idx}`}
                    type="button"
                    onClick={() => setSelectedDate(new Date(d))}
                    className={[
                      "relative h-20 border-r border-b border-slate-200/60 dark:border-slate-800/30 px-3 py-2 text-left transition-colors",
                      !inMonth ? "bg-slate-50/60 dark:bg-slate-900/20 text-slate-400 dark:text-slate-600" : "bg-white dark:bg-[#0f1923]",
                      selected ? "bg-primary/10 dark:bg-primary/10" : "hover:bg-slate-50 dark:hover:bg-slate-900/40",
                    ].join(" ")}
                  >
                    <div
                      className={[
                        "text-sm font-bold",
                        selected ? "text-primary" : today ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-200",
                      ].join(" ")}
                    >
                      {d.getDate()}
                    </div>
                    {count > 0 && (
                      <div className="absolute bottom-2 left-3 flex items-center gap-1">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                        <span className="text-[10px] font-bold text-primary">{count}</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected day list */}
          <div className="rounded-2xl bg-white dark:bg-[#0f1923] border border-slate-200/60 dark:border-slate-800/30 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-black text-slate-900 dark:text-white">
                {selectedDate.toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" })}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Upcoming</span>
            </div>
            {selectedEvents.length === 0 ? (
              <div className="text-sm text-slate-500 dark:text-slate-400">Không có buổi học trong ngày này.</div>
            ) : (
              <div className="space-y-3">
                {selectedEvents.map((e) => (
                  <div
                    key={`${e.classId}-${e.start}`}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30"
                  >
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[14px] text-primary">schedule</span>
                      {fmtTime(e.start)} - {fmtTime(e.end)}
                    </div>
                    <div className="mt-1 font-black text-slate-900 dark:text-white line-clamp-2">{e.className}</div>
                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{e.courseName || "—"}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-white dark:bg-[#0f1923] border border-slate-200/60 dark:border-slate-800/30 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200/60 dark:border-slate-800/30 flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Buổi học sắp tới</h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">{upcomingList.length} items</span>
          </div>
          {upcomingList.length === 0 ? (
            <div className="p-6 text-sm text-slate-500 dark:text-slate-400">Chưa có lịch học sắp tới.</div>
          ) : (
            <div className="divide-y divide-slate-200/60 dark:divide-slate-800/30">
              {upcomingList.map((e) => (
                <div key={`${e.classId}-${e.start}`} className="p-5 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-primary uppercase tracking-widest">
                      {new Date(e.start).toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit" })}
                    </div>
                    <div className="mt-1 text-lg font-black text-slate-900 dark:text-white line-clamp-1">{e.className}</div>
                    <div className="mt-1 text-sm text-slate-500 dark:text-slate-400 line-clamp-1">{e.courseName || "—"}</div>
                    <div className="mt-2 inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <span className="material-symbols-outlined text-[18px] text-primary">schedule</span>
                      {fmtTime(e.start)} - {fmtTime(e.end)}
                      <span className="mx-2 h-4 w-px bg-slate-200 dark:bg-slate-800" />
                      <span className="inline-flex items-center gap-1">
                        <span className="material-symbols-outlined text-[18px] text-emerald-500">videocam</span>
                        {e.platform || "Online"}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const d = new Date(e.start);
                      setMode("calendar");
                      setCursorMonth(startOfMonth(d));
                      setSelectedDate(d);
                    }}
                    className="shrink-0 px-4 py-2 rounded-xl bg-primary text-white text-sm font-black shadow-md shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all"
                  >
                    Xem trên lịch
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentSchedulePage;

