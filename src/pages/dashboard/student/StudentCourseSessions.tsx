import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../../components/common/Loading";
import { useTranslationWithRerender } from "../../../hooks/useLanguageChange";
import { getCourseById } from "../../../redux/slices/courses";
import { RootState, useDispatch, useSelector } from "../../../redux/store";
import { examService } from "../../../services/examService";
import { ExamSummary, ExamVisibility } from "../../../types/exam";
import { Session } from "../../home/courses/[id]";

/**
 * Chi tiết khóa học trong student dashboard: danh sách buổi học & tài liệu / video / bài kiểm tra.
 * Session `variant="dashboard"` mở tài liệu, video và làm bài trong layout `/dashboard-program/...`.
 */
const StudentCourseSessions: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslationWithRerender();
  const { course, loading } = useSelector((s: RootState) => s.courses);
  const [sessionExams, setSessionExams] = useState<Record<string, ExamSummary[]>>({});

  useEffect(() => {
    if (!courseId) return;
    (async () => {
      const result = await dispatch(getCourseById(courseId));
      if (getCourseById.rejected.match(result)) {
        navigate("/dashboard-program/courses", { replace: true });
      }
    })();
  }, [courseId, dispatch, navigate]);

  useEffect(() => {
    const loadExams = async () => {
      if (!course?._id) {
        setSessionExams({});
        return;
      }
      try {
        const exams = await examService.getExams({
          courseId: course._id,
          visibility: ExamVisibility.PUBLISHED,
        });
        const map: Record<string, ExamSummary[]> = {};
        exams.forEach((exam) => {
          exam.sessionIds?.forEach((sessionId) => {
            if (!map[sessionId]) map[sessionId] = [];
            map[sessionId].push(exam);
          });
        });
        setSessionExams(map);
      } catch {
        setSessionExams({});
      }
    };
    loadExams();
  }, [course?._id]);

  if (loading || !courseId) {
    return <Loading />;
  }

  if (!course || String(course._id) !== String(courseId)) {
    return <Loading />;
  }

  return (
    <div className="w-full space-y-8 pb-4">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <button
            type="button"
            onClick={() => navigate("/dashboard-program/courses")}
            className="shrink-0 mt-0.5 h-10 w-10 inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-primary/50 transition-colors"
            aria-label="Quay lại danh sách khóa học"
          >
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
          </button>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-1">Khóa học</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-tight break-words">
              {course.name}
            </h1>
          </div>
        </div>
      </div>

      {course.cover && (
        <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/80 max-h-52">
          <img src={course.cover} alt="" className="w-full h-full object-cover max-h-52" />
        </div>
      )}

      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl">library_books</span>
          {t("courseDetail.sessions") || "Buổi học"}
        </h2>
        <div className="space-y-6">
          {course.sessions && course.sessions.length > 0 ? (
            course.sessions.map((item: any, index: number) => (
              <Session
                key={item._id || index}
                item={item}
                exams={sessionExams[item._id]}
                hideAdminActions
                variant="dashboard"
              />
            ))
          ) : (
            <p className="text-slate-500 dark:text-slate-400 text-center py-12 rounded-2xl border border-dashed border-slate-300 dark:border-slate-600">
              Chưa có buổi học nào.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default StudentCourseSessions;
