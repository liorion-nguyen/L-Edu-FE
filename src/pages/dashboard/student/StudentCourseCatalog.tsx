import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseRegistrationModal from "../../../components/course/CourseRegistrationModal";
import { Mode } from "../../../enum/course.enum";
import { useTranslationWithRerender } from "../../../hooks/useLanguageChange";
import { getCourses } from "../../../redux/slices/courses";
import { RootState, useDispatch, useSelector } from "../../../redux/store";
import { Category, categoryService } from "../../../services/categoryService";
import courseRegistrationService, { CourseRegistration } from "../../../services/courseRegistrationService";
import { CourseType } from "../../../types/course";
import { useIsAdmin } from "../../../utils/auth";

const PAGE_SIZE = 9;

const thumbnailFallback = "/images/landing/sections/fakeImages/thumbnailCourse.png";

/** Badge số buổi — glass, chữ primary, khớp nền slate của dashboard */
const lessonBadgeClassName =
  "inline-flex items-center gap-1.5 rounded-xl border border-primary/30 bg-white/90 dark:bg-slate-900/85 backdrop-blur-md px-3 py-1.5 text-xs font-semibold text-primary shadow-sm ring-1 ring-black/[0.04] dark:ring-white/10";

const ctaPrimaryClassName =
  "w-full rounded-xl py-2.5 px-4 text-sm font-semibold text-white bg-primary shadow-md shadow-primary/25 ring-1 ring-white/15 dark:ring-white/10 hover:bg-[#006fe6] hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50 disabled:active:scale-100";

const ctaRegisterClassName =
  "w-full rounded-xl py-2.5 px-4 text-sm font-semibold text-primary border-2 border-primary/40 bg-primary/[0.06] dark:bg-primary/[0.12] hover:bg-primary/[0.12] dark:hover:bg-primary/20 hover:border-primary/60 transition-all flex items-center justify-center gap-2";

const ctaPendingClassName =
  "w-full rounded-xl py-2.5 px-4 text-sm font-semibold text-amber-800 dark:text-amber-200/95 border border-amber-200/90 dark:border-amber-500/35 bg-amber-50/95 dark:bg-amber-950/45 cursor-not-allowed flex items-center justify-center gap-2";

const ctaLockedClassName =
  "w-full rounded-xl py-2.5 px-4 text-sm font-semibold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600 bg-slate-50/90 dark:bg-slate-800/70 cursor-not-allowed flex items-center justify-center gap-2";

function RatingStars({ rating, reviewCount, reviewsLabel }: { rating: number; reviewCount: number; reviewsLabel: string }) {
  const filled = Math.min(5, Math.max(0, Math.round(rating || 0)));
  return (
    <div className="flex items-center gap-0.5 mb-4 flex-wrap">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`material-symbols-outlined text-sm leading-none ${i <= filled ? "text-amber-400 fill-current" : "text-slate-300 dark:text-slate-600"
            }`}
        >
          star
        </span>
      ))}
      <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
        ({reviewCount} {reviewsLabel})
      </span>
    </div>
  );
}

const StudentCourseCard: React.FC<{
  course: CourseType;
  myRegistrations: CourseRegistration[];
}> = ({ course, myRegistrations }) => {
  const navigate = useNavigate();
  const { t } = useTranslationWithRerender();
  const { user } = useSelector((s: RootState) => s.auth);
  const isAdmin = useIsAdmin();
  const [registrationModalVisible, setRegistrationModalVisible] = useState(false);
  const [localPendingAfterSubmit, setLocalPendingAfterSubmit] = useState(false);

  const registrationStatusFromData = useMemo(() => {
    if (!myRegistrations.length) return "none" as const;
    const reg = myRegistrations.find((r) => r.courseId === course._id);
    return reg ? (reg.status.toLowerCase() as "pending" | "approved" | "rejected") : "none";
  }, [myRegistrations, course._id]);

  const registrationStatus = localPendingAfterSubmit ? "pending" : registrationStatusFromData;
  const isUserEnrolled = Boolean(user && course.students?.includes(user._id));

  const goCourse = () => navigate(`/dashboard-program/courses/${course._id}`);

  /** Admin vào khóa học trực tiếp, không cần đăng ký / enroll */
  const showAdminAccessButton = !isUserEnrolled && isAdmin;
  const showRegistrationButton =
    !isUserEnrolled && !isAdmin && (registrationStatus === "none" || registrationStatus === "rejected");
  const showPendingButton = !isUserEnrolled && !isAdmin && registrationStatus === "pending";

  return (
    <div className="group bg-white dark:bg-slate-800/30 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img
          alt=""
          src={course.cover || thumbnailFallback}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className={`absolute top-4 left-4 max-w-[calc(100%-2rem)] ${lessonBadgeClassName}`}>
          <span className="material-symbols-outlined text-[16px] leading-none shrink-0 opacity-90" aria-hidden>
            menu_book
          </span>
          <span className="truncate">
            {course.duration} {t("course.sessions")}
          </span>
        </div>
        {
          course.mode === Mode.CLOSE ? (
            <button
              type="button"
              className="absolute inset-0 bg-gradient-to-t from-[#0b0f1a]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer border-0 p-0"
            >
              <span className="material-symbols-outlined text-white text-5xl pointer-events-none">block</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={goCourse}
              className="absolute inset-0 bg-gradient-to-t from-[#0b0f1a]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer border-0 p-0"
            >
              <span className="material-symbols-outlined text-white text-5xl pointer-events-none">play_circle</span>
            </button>
          )
        }
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors text-slate-900 dark:text-white line-clamp-2">
          {course.name}
        </h3>
        <RatingStars
          rating={course.averageRating ?? 0}
          reviewCount={course.totalReviews ?? 0}
          reviewsLabel={t("reviews.reviews")}
        />
        <div className="mt-auto space-y-3">
          {isUserEnrolled ? (
            <button type="button" onClick={goCourse} className={ctaPrimaryClassName}>
              <span className="material-symbols-outlined text-lg leading-none">play_circle</span>
              {t("course.joinCourse")}
            </button>
          ) : showAdminAccessButton ? (
            <button type="button" onClick={goCourse} className={ctaPrimaryClassName}>
              <span className="material-symbols-outlined text-lg leading-none">admin_panel_settings</span>
              Truy cập khóa học (Admin)
            </button>
          ) : showPendingButton ? (
            <button type="button" disabled title="Đơn đăng ký đang chờ duyệt." className={ctaPendingClassName}>
              <span className="material-symbols-outlined text-lg leading-none">hourglass_top</span>
              Chờ duyệt
            </button>
          ) : showRegistrationButton ? (
            course.mode === Mode.CLOSE ? (
              <button type="button" onClick={() => setRegistrationModalVisible(true)} className={ctaRegisterClassName}>
                <span className="material-symbols-outlined text-lg leading-none">person_add</span>
                Đăng ký khóa học (Chờ duyệt)
              </button>) : (
              <button type="button" onClick={goCourse} className={ctaPrimaryClassName}>
                <span className="material-symbols-outlined text-lg leading-none">play_circle</span>
                Tham gia khóa học
              </button>
            )
          ) : (
            <button type="button" disabled className={ctaLockedClassName}>
              <span className="material-symbols-outlined text-lg leading-none">lock</span>
              {t("course.locked")}
            </button>
          )}
        </div>
      </div>
      <CourseRegistrationModal
        visible={registrationModalVisible}
        onCancel={() => setRegistrationModalVisible(false)}
        onSuccess={() => {
          setRegistrationModalVisible(false);
          setLocalPendingAfterSubmit(true);
        }}
        courseId={course._id}
        courseTitle={course.name}
        isLocked={course.mode === Mode.CLOSE}
        isRejected={registrationStatus === "rejected"}
      />
    </div>
  );
};

const StudentCourseCatalog: React.FC = () => {
  const { t } = useTranslationWithRerender();
  const dispatch = useDispatch();
  const { courses, totalCourse, loading } = useSelector((s: RootState) => s.courses);
  const { user } = useSelector((s: RootState) => s.auth);

  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [searchTrigger, setSearchTrigger] = useState(0);
  const [categoryId, setCategoryId] = useState<string>("");
  const [page, setPage] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [myRegistrations, setMyRegistrations] = useState<CourseRegistration[]>([]);

  const fetchList = useCallback(() => {
    dispatch(
      getCourses({
        page,
        limit: PAGE_SIZE,
        name: appliedSearch,
        categoryId: categoryId || undefined,
      }),
    );
  }, [dispatch, page, appliedSearch, categoryId]);

  useEffect(() => {
    fetchList();
  }, [fetchList, searchTrigger]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await categoryService.getPublicCategories();
        if (!mounted) return;
        const list = (res?.data || []).filter((c) => c?.isActive !== false);
        setCategories(list);
      } catch {
        setCategories([]);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!user) {
      setMyRegistrations([]);
      return;
    }
    (async () => {
      try {
        const list = await courseRegistrationService.getMyRegistrations();
        setMyRegistrations(Array.isArray(list) ? list : []);
      } catch {
        setMyRegistrations([]);
      }
    })();
  }, [user]);

  const totalPages = Math.max(1, Math.ceil((totalCourse || 0) / PAGE_SIZE));

  const visiblePageNumbers = useMemo(() => {
    const current1 = page + 1;
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    let start = Math.max(1, current1 - 2);
    let end = Math.min(totalPages, start + 4);
    start = Math.max(1, end - 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [page, totalPages]);

  const runSearch = () => {
    setPage(0);
    setAppliedSearch(searchInput.trim());
    setSearchTrigger((n) => n + 1);
  };

  const onCategoryChange = (value: string) => {
    setCategoryId(value);
    setPage(0);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-2xl">
            <span className="material-symbols-outlined text-primary text-3xl">menu_book</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Khóa học của chúng tôi</h1>
        </div>
      </div>

      <section className="mb-10 flex flex-wrap items-center gap-4 bg-white dark:bg-slate-800/20 backdrop-blur-xl p-4 rounded-2xl border border-slate-200 dark:border-slate-700/50">
        <div className="flex-1 min-w-[240px] relative">
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && runSearch()}
            placeholder={t("course.searchPlaceholder")}
            className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={categoryId}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary text-slate-600 dark:text-slate-300 min-w-[180px]"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={runSearch}
            className="bg-primary px-6 py-2.5 rounded-xl text-white font-semibold text-sm flex items-center gap-2 shadow-md shadow-primary/25 ring-1 ring-white/15 dark:ring-white/10 hover:bg-[#006fe6] hover:shadow-lg hover:shadow-primary/30 transition-all"
          >
            <span className="material-symbols-outlined text-sm">search</span>
            {t("common.search")}
          </button>
        </div>
      </section>

      {loading && !courses?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-pulse">
              <div className="h-48 bg-slate-200 dark:bg-slate-800" />
              <div className="p-6 space-y-3">
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : !courses?.length ? (
        <div className="text-center py-20 px-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/20">
          <span className="material-symbols-outlined text-5xl text-slate-400 mb-4 block">menu_book</span>
          <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">Không tìm thấy khóa học nào</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Thử từ khóa hoặc danh mục khác.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <StudentCourseCard key={course._id} course={course} myRegistrations={myRegistrations} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page <= 0 || loading}
                className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-primary hover:text-white hover:border-primary disabled:opacity-40 disabled:pointer-events-none transition-colors"
                aria-label="Trang trước"
              >
                <span className="material-symbols-outlined text-xl">chevron_left</span>
              </button>
              {visiblePageNumbers.map((n) => {
                const active = n === page + 1;
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setPage(n - 1)}
                    disabled={loading}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-colors ${active
                      ? "bg-primary text-white shadow-lg shadow-primary/30"
                      : "border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-primary hover:text-white hover:border-primary"
                      }`}
                  >
                    {n}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1 || loading}
                className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-primary hover:text-white hover:border-primary disabled:opacity-40 disabled:pointer-events-none transition-colors"
                aria-label="Trang sau"
              >
                <span className="material-symbols-outlined text-xl">chevron_right</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StudentCourseCatalog;
