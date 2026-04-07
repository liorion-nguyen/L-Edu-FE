import { useEffect, useMemo, useRef, useState } from "react";
import {
  CODELAB_BRAND_NAME,
  CODELAB_FACEBOOK_URL,
  CODELAB_IMG,
  CODELAB_SIGNUP_URL,
  CODELAB_SITE_URL,
  CODELAB_TIKTOK_URL,
} from "../../constants/codelabSite";
import { RootState, useSelector } from "../../redux/store";
import { Category, categoryService } from "../../services/categoryService";
import { Footer, FooterLink, footerService } from "../../services/footerService";
import { LinkedApp, linkedAppService } from "../../services/linkedAppService";

const LandingPage = () => {
  const { user } = useSelector((s: RootState) => s.auth);
  const [linkedApps, setLinkedApps] = useState<LinkedApp[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [companySection, setCompanySection] = useState<Footer | null>(null);
  const companyTrackRef = useRef<HTMLDivElement | null>(null);
  const categoryTrackRef = useRef<HTMLDivElement | null>(null);
  const programTrackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await linkedAppService.getLinkedApps();
        if (!mounted) return;
        if (res?.success) setLinkedApps(res.data || []);
      } catch {
        // Keep silent on landing page; section will fallback to defaults.
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await footerService.getFooters();
        if (!mounted) return;
        if (!res?.success) return;
        const section = (res.data || []).find((s) => s.section === "company" || s.section === "partners");
        setCompanySection(section || null);
      } catch {
        // optional; fallback UI below
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await categoryService.getPublicCategories();
        if (!mounted) return;
        setCategories((res?.data || []).filter((c) => c?.isActive !== false));
      } catch {
        // optional; section will fallback
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const scrollTrackBy = (ref: React.RefObject<HTMLDivElement | null>, dir: -1 | 1) => {
    const el = ref.current;
    if (!el) return;
    const amount = Math.max(280, Math.floor(el.clientWidth * 0.8));
    el.scrollBy({ left: amount * dir, behavior: "smooth" });
  };

  const ecosystemApps = useMemo(() => {
    const apps = (linkedApps || []).filter((a) => a?.isActive);
    apps.sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0));
    return apps;
  }, [linkedApps]);

  const fallbackEcosystemApps = useMemo<LinkedApp[]>(
    () => [
      {
        _id: "photobooth",
        name: "Photobooth",
        url: "/photobooth",
        description: "Công cụ chỉnh sửa ảnh chuyên nghiệp cho các lập trình viên muốn build Portfolio đẹp mắt.",
        icon: "camera",
        image: "",
        category: "utility",
        isActive: true,
        order: 0,
        openInNewTab: false,
        createdAt: "",
        updatedAt: "",
      },
      {
        _id: "dashboard",
        name: "Dashboard Học tập",
        url: "/dashboard-program",
        description: "Theo dõi tiến độ, nộp bài tập và tương tác với mentor một cách dễ dàng.",
        icon: "dashboard_customize",
        image: "",
        category: "education",
        isActive: true,
        order: 1,
        openInNewTab: false,
        createdAt: "",
        updatedAt: "",
      },
    ],
    [],
  );

  const ecosystemAppsToRender = ecosystemApps.length ? ecosystemApps : fallbackEcosystemApps;

  const companyLinks = useMemo<FooterLink[]>(
    () =>
      (companySection?.links?.length
        ? companySection.links
        : [
            { label: "Facebook — CodeLab", url: CODELAB_FACEBOOK_URL, isExternal: true },
            { label: "TikTok — @codelab.pro.vn", url: CODELAB_TIKTOK_URL, isExternal: true },
            { label: "Website", url: CODELAB_SITE_URL, isExternal: true },
          ]) as FooterLink[],
    [companySection],
  );

  const categoriesToRender = useMemo<Category[]>(
    () =>
      (categories?.length ? categories : [
        {
          _id: "frontend",
          name: "Frontend",
          description: "React, UI/UX và các kỹ năng xây dựng giao diện hiện đại.",
          icon: "language",
          color: "#2383e2",
          courseCount: 0,
          isActive: true,
          order: 0,
          createdAt: "",
          updatedAt: "",
        },
        {
          _id: "backend",
          name: "Backend",
          description: "API, Database, Auth và kiến trúc hệ thống.",
          icon: "dns",
          color: "#10b981",
          courseCount: 0,
          isActive: true,
          order: 1,
          createdAt: "",
          updatedAt: "",
        },
        {
          _id: "devops",
          name: "DevOps",
          description: "CI/CD, Docker, Cloud và vận hành sản phẩm.",
          icon: "settings_suggest",
          color: "#f59e0b",
          courseCount: 0,
          isActive: true,
          order: 2,
          createdAt: "",
          updatedAt: "",
        },
        {
          _id: "mobile",
          name: "Mobile",
          description: "React Native và phát triển ứng dụng di động.",
          icon: "smartphone",
          color: "#8b5cf6",
          courseCount: 0,
          isActive: true,
          order: 3,
          createdAt: "",
          updatedAt: "",
        },
      ]).slice(0, 12),
    [categories],
  );

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased">
      {/* Hero Section (match stitch) */}
      <header className="relative overflow-hidden pb-24 pt-12">
        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-full w-full max-w-7xl -translate-x-1/2 opacity-20">
          <div className="absolute left-10 top-10 h-72 w-72 rounded-full bg-primary blur-[120px]" />
          <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-purple-500 blur-[150px]" />
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              {CODELAB_BRAND_NAME} — Học lập trình thực chiến
            </div>

            <h1 className="text-5xl font-black leading-tight tracking-tight dark:text-white lg:text-7xl">
              Lập trình{" "}
              <span className="bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">thực chiến</span> cho học
              sinh cấp 2–3 tại{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-primary bg-clip-text text-transparent">TP. Vinh, Nghệ An</span>
            </h1>

            <p className="max-w-lg text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              Không chỉ dừng lại ở lý thuyết suông. Chúng tôi đào tạo thế hệ học sinh làm chủ công nghệ thông qua các dự án thực tế
              và tư duy giải quyết vấn đề.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href={CODELAB_SIGNUP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-2xl bg-primary px-8 py-4 text-lg font-bold text-white shadow-xl shadow-primary/30 transition-all hover:bg-primary/90"
              >
                Nhận tư vấn lộ trình
                <span className="material-symbols-outlined">arrow_forward</span>
              </a>
              <a
                href={user ? "/dashboard-program" : CODELAB_SIGNUP_URL}
                {...(user ? {} : { target: "_blank" as const, rel: "noopener noreferrer" })}
                className="rounded-2xl border border-slate-200 bg-white px-8 py-4 text-lg font-bold transition-all hover:border-primary dark:border-slate-700 dark:bg-slate-800"
              >
                Tìm hiểu chương trình
              </a>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                <img
                  alt="Học viên CodeLab — Phú Minh"
                  className="h-10 w-10 rounded-full border-4 border-background-light object-cover dark:border-background-dark"
                  src={CODELAB_IMG.studentPhuMinh}
                />
                <img
                  alt="Học viên CodeLab — Lê Mạnh"
                  className="h-10 w-10 rounded-full border-4 border-background-light object-cover dark:border-background-dark"
                  src={CODELAB_IMG.studentLeManh}
                />
                <img
                  alt="Học viên CodeLab — Ngọc Phương"
                  className="h-10 w-10 rounded-full border-4 border-background-light object-cover dark:border-background-dark"
                  src={CODELAB_IMG.studentNgocPhuong}
                />
                <img
                  alt="Học viên CodeLab — Quang Vinh"
                  className="h-10 w-10 rounded-full border-4 border-background-light object-cover dark:border-background-dark"
                  src={CODELAB_IMG.studentQuangVinh}
                />
              </div>
              <p className="text-sm font-medium text-slate-500">Học viên TP. Vinh đồng hành cùng {CODELAB_BRAND_NAME}</p>
            </div>
          </div>

          <div className="relative grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl">
                <img
                  alt="CodeLab — Hoạt động tại lớp"
                  className="h-full w-full object-cover"
                  src={CODELAB_IMG.classMain}
                />
              </div>
              <div className="aspect-square overflow-hidden rounded-3xl shadow-2xl">
                <img
                  alt="CodeLab — Thảo luận nhóm"
                  className="h-full w-full object-cover"
                  src={CODELAB_IMG.classGroup}
                />
              </div>
            </div>
            <div className="space-y-4 pt-12">
              <div className="aspect-square overflow-hidden rounded-3xl shadow-2xl">
                <img
                  alt="CodeLab — Mentor hỗ trợ"
                  className="h-full w-full object-cover"
                  src={CODELAB_IMG.classMentor}
                />
              </div>
              <div className="aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl">
                <img
                  alt="CodeLab — Toàn cảnh lớp học"
                  className="h-full w-full object-cover"
                  src={CODELAB_IMG.classWide}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats */}
      <section className="bg-white py-12 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-8 border-y border-slate-100 py-10 dark:border-slate-800 md:grid-cols-4">
            <div className="space-y-2 text-center">
              <div className="text-4xl font-black text-primary">12–18</div>
              <div className="text-sm font-medium uppercase tracking-widest text-slate-500">Độ tuổi học viên</div>
            </div>
            <div className="space-y-2 text-center">
              <div className="text-4xl font-black text-primary">5-10</div>
              <div className="text-sm font-medium uppercase tracking-widest text-slate-500">Học sinh / lớp</div>
            </div>
            <div className="space-y-2 text-center">
              <div className="text-4xl font-black text-primary">Vinh</div>
              <div className="text-sm font-medium uppercase tracking-widest text-slate-500">TP. Vinh, Nghệ An</div>
            </div>
            <div className="space-y-2 text-center">
              <div className="text-4xl font-black text-primary">0đ</div>
              <div className="text-sm font-medium uppercase tracking-widest text-slate-500">Buổi học thử miễn phí</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-16 space-y-4 text-center">
          <h2 className="text-3xl font-black dark:text-white md:text-4xl">Vì sao không chỉ là khóa code?</h2>
          <p className="mx-auto max-w-2xl text-slate-500">
            {CODELAB_BRAND_NAME} định hướng sản phẩm, tư duy và lộ trình thi đấu khi phù hợp — không chỉ dạy cú pháp.
          </p>
          <div className="mx-auto h-1.5 w-20 rounded-full bg-primary" />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="group rounded-2xl border border-slate-100 bg-white p-8 transition-all hover:border-primary dark:border-slate-700/50 dark:bg-slate-800/50">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-primary transition-transform group-hover:scale-110 dark:bg-blue-500/10">
              <span className="material-symbols-outlined text-3xl">hub</span>
            </div>
            <h3 className="mb-3 text-xl font-bold">Tư duy logic hệ thống</h3>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Học cách chia nhỏ vấn đề phức tạp thành các module giải quyết được ngay lập tức.
            </p>
          </div>

          <div className="group rounded-2xl border border-slate-100 bg-white p-8 transition-all hover:border-primary dark:border-slate-700/50 dark:bg-slate-800/50">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-500 transition-transform group-hover:scale-110 dark:bg-amber-500/10">
              <span className="material-symbols-outlined text-3xl">rocket_launch</span>
            </div>
            <h3 className="mb-3 text-xl font-bold">Dự án thực chiến 100%</h3>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Kết thúc khóa học, mỗi học sinh đều sở hữu ít nhất 2 sản phẩm website hoặc ứng dụng cá nhân.
            </p>
          </div>

          <div className="group rounded-2xl border border-slate-100 bg-white p-8 transition-all hover:border-primary dark:border-slate-700/50 dark:bg-slate-800/50">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-500 transition-transform group-hover:scale-110 dark:bg-indigo-500/10">
              <span className="material-symbols-outlined text-3xl">workspace_premium</span>
            </div>
            <h3 className="mb-3 text-xl font-bold">Chứng chỉ &amp; giải thưởng</h3>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Lộ trình ôn luyện bài bản cho các kỳ thi Tin học trẻ và chứng chỉ lập trình quốc tế.
            </p>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 dark:border-slate-700/50 dark:bg-slate-800/50">
            <h3 className="mb-2 text-lg font-bold">Lớp tối đa 10 em</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Mentor theo sát từng dòng code.</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-6 dark:border-slate-700/50 dark:bg-slate-800/50">
            <h3 className="mb-2 text-lg font-bold">Thiết bị hiện đại</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Máy tính cấu hình cao tại lớp cho học sinh chưa có laptop.</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-6 dark:border-slate-700/50 dark:bg-slate-800/50">
            <h3 className="mb-2 text-lg font-bold">Lịch học linh hoạt</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Ca tối hoặc cuối tuần, phù hợp lịch văn hóa.</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-6 dark:border-slate-700/50 dark:bg-slate-800/50">
            <h3 className="mb-2 text-lg font-bold">Support 24/7</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Kênh hỗ trợ online kể cả khi không ở lớp.</p>
          </div>
        </div>
      </section>

      {/* Company */}
      {/* <section className="bg-slate-50 py-20 dark:bg-[#0b1219]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div className="space-y-3">
              <span className="text-sm font-bold uppercase tracking-widest text-primary">Company</span>
              <h2 className="text-3xl font-black dark:text-white md:text-4xl">
                {companySection?.title || "Theo dõi & kết nối CodeLab"}
              </h2>
              <p className="max-w-2xl text-slate-500">
                Cập nhật lịch khai giảng, buổi học thử và hoạt động tại TP. Vinh qua website và mạng xã hội chính thức của {CODELAB_BRAND_NAME}.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Cuộn trái"
                onClick={() => scrollTrackBy(companyTrackRef, -1)}
                className="h-10 w-10 rounded-xl border"
                style={{ borderColor: "var(--border-color)", background: "var(--hover-bg)", color: "var(--text-secondary)" }}
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button
                type="button"
                aria-label="Cuộn phải"
                onClick={() => scrollTrackBy(companyTrackRef, 1)}
                className="h-10 w-10 rounded-xl border"
                style={{ borderColor: "var(--border-color)", background: "var(--hover-bg)", color: "var(--text-secondary)" }}
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>

          <div
            ref={companyTrackRef}
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none]"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {companyLinks.map((c) => {
              const href = c.url || "#";
              const hasLogo = !!c.icon && /^https?:\/\//.test(c.icon);
              return (
                <a
                  key={`${c.label}-${c.url}`}
                  href={href}
                  target={c.isExternal ? "_blank" : undefined}
                  rel={c.isExternal ? "noopener noreferrer" : undefined}
                  className="group snap-start min-w-[240px] rounded-3xl border bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-xl dark:bg-slate-800/60"
                  style={{ borderColor: "var(--border-color)" }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl"
                      style={{ background: "var(--hover-bg)" }}
                    >
                      {hasLogo ? (
                        <img alt={c.label} className="h-full w-full object-contain p-2" src={c.icon} />
                      ) : (
                        <span className="text-lg font-black" style={{ color: "var(--text-primary)" }}>
                          {c.label?.slice(0, 1) || "C"}
                        </span>
                      )}
                      <div className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-primary/10 blur-2xl" />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-base font-black" style={{ color: "var(--text-primary)" }}>
                        {c.label}
                      </div>
                      <div className="line-clamp-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                        {c.description || "Trusted partner"}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-widest text-primary">Partner</span>
                    <span
                      className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-0.5"
                      style={{ color: "var(--primary-color)" }}
                    >
                      east
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section> */}

      {/* Khám phá danh mục */}
      {/* <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div className="space-y-3">
            <span className="text-sm font-bold uppercase tracking-widest text-primary">Danh mục</span>
            <h2 className="text-3xl font-black dark:text-white md:text-4xl">Khám phá danh mục</h2>
            <p className="max-w-2xl text-slate-500">
              Python &amp; logic · Web/Frontend · Ôn thi HSG — chọn hướng phù hợp lứa tuổi và mục tiêu tại {CODELAB_BRAND_NAME}.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Cuộn trái"
              onClick={() => scrollTrackBy(categoryTrackRef, -1)}
              className="h-10 w-10 rounded-xl border"
              style={{ borderColor: "var(--border-color)", background: "var(--hover-bg)", color: "var(--text-secondary)" }}
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button
              type="button"
              aria-label="Cuộn phải"
              onClick={() => scrollTrackBy(categoryTrackRef, 1)}
              className="h-10 w-10 rounded-xl border"
              style={{ borderColor: "var(--border-color)", background: "var(--hover-bg)", color: "var(--text-secondary)" }}
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>

        <div
          ref={categoryTrackRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none]"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {categoriesToRender
            .slice()
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .map((cat) => (
              <a
                key={cat._id}
                href={`/course?category=${encodeURIComponent(cat._id)}`}
                className="group min-w-[280px] rounded-3xl border bg-white p-6 shadow-sm transition-all hover:shadow-xl dark:bg-slate-800/60"
                style={{ borderColor: "var(--border-color)" }}
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-2xl"
                    style={{
                      background: cat.color ? `${cat.color}22` : "var(--hover-bg)",
                      color: cat.color || "var(--primary-color)",
                    }}
                  >
                    {cat.icon && /^https?:\/\//.test(cat.icon) ? (
                      <img alt="" className="h-6 w-6 object-contain" src={cat.icon} />
                    ) : (
                      <span className="material-symbols-outlined">{cat.icon || "category"}</span>
                    )}
                  </div>
                  <span
                    className="rounded-full px-3 py-1 text-xs font-bold"
                    style={{
                      background: "var(--hover-bg)",
                      color: "var(--text-secondary)",
                      border: "1px solid var(--border-color)",
                    }}
                  >
                    {cat.courseCount ? `${cat.courseCount} khóa` : "Danh mục"}
                  </span>
                </div>
                <h3 className="mb-2 text-xl font-black transition-colors group-hover:text-primary" style={{ color: "var(--text-primary)" }}>
                  {cat.name}
                </h3>
                <p className="line-clamp-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {cat.description || "Khám phá các khóa học được thiết kế theo lộ trình rõ ràng và thực chiến."}
                </p>
                <div className="mt-5 inline-flex items-center gap-2 font-bold text-primary">
                  Xem khóa học
                  <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-0.5">east</span>
                </div>
              </a>
            ))}
        </div>
      </section> */}

      {/* Chương trình & lộ trình — cuộn ngang, tối đa 3 card / desktop */}
      <section className="mb-32 scroll-mt-24" id="chuong-trinh">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div className="space-y-4">
              <h2 className="text-4xl font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>
                Chương trình &amp; lộ trình
              </h2>
              <p className="max-w-md text-sm leading-relaxed md:text-base" style={{ color: "var(--text-secondary)" }}>
                Thiết kế riêng cho từng độ tuổi và trình độ, từ cơ bản đến chuyên sâu.
              </p>
            </div>
            <div className="flex w-full flex-wrap items-center justify-between gap-4 md:w-auto md:justify-end">
              <div className="flex flex-wrap gap-2">
                <span
                  className="rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest"
                  style={{
                    background: "rgba(35, 131, 226, 0.12)",
                    color: "var(--primary-color)",
                    border: "1px solid rgba(35, 131, 226, 0.25)",
                  }}
                >
                  Phát triển tư duy
                </span>
                <span
                  className="rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest"
                  style={{
                    background: "var(--hover-bg)",
                    color: "var(--text-secondary)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  Kỹ năng số
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Cuộn trái"
                  onClick={() => scrollTrackBy(programTrackRef, -1)}
                  className="h-10 w-10 rounded-xl border transition-colors hover:opacity-90"
                  style={{ borderColor: "var(--border-color)", background: "var(--hover-bg)", color: "var(--text-secondary)" }}
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button
                  type="button"
                  aria-label="Cuộn phải"
                  onClick={() => scrollTrackBy(programTrackRef, 1)}
                  className="h-10 w-10 rounded-xl border transition-colors hover:opacity-90"
                  style={{ borderColor: "var(--border-color)", background: "var(--hover-bg)", color: "var(--text-secondary)" }}
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          <div
            ref={programTrackRef}
            className="flex snap-x snap-mandatory gap-8 overflow-x-auto scroll-smooth py-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {/* Python */}
            <div
              id="khoa-python"
              className="group w-[min(100%,calc(100vw-3rem))] shrink-0 snap-start rounded-3xl border bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-0.5 hover:shadow-2xl dark:bg-slate-900/40 md:w-[calc((100%-4rem)/3)] md:min-w-[calc((100%-4rem)/3)]"
              style={{ borderColor: "var(--border-color)" }}
            >
              <p className="mb-2 text-sm font-bold text-primary">CẤP 2 (Khối 6-9)</p>
              <h3 className="mb-6 text-2xl font-black" style={{ color: "var(--text-primary)" }}>
                Khám phá Python &amp; Logic
              </h3>
              <ul className="mb-8 space-y-4">
                {["Làm quen cú pháp Python", "Giải quyết bài toán logic", "Lập trình Game cơ bản"].map((t) => (
                  <li key={t} className="flex items-center gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <span
                      className="material-symbols-outlined shrink-0 text-base"
                      style={{ color: "var(--primary-color)" }}
                    >
                      check_circle
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
              <a
                href={CODELAB_SIGNUP_URL}
                className="block w-full rounded-full border-2 py-3 text-center text-sm font-extrabold transition-colors hover:text-white"
                style={{ borderColor: "var(--primary-color)", color: "var(--primary-color)" }}
                onMouseEnter={(e) => ((e.currentTarget.style.background = "var(--primary-color)"))}
                onMouseLeave={(e) => ((e.currentTarget.style.background = "transparent"))}
              >
                Xem chi tiết
              </a>
            </div>

            {/* Web — featured */}
            <div
              id="khoa-web"
              className="group relative w-[min(100%,calc(100vw-3rem))] shrink-0 snap-start overflow-hidden rounded-3xl p-8 shadow-2xl transition-all duration-500 md:scale-[1.03] md:w-[calc((100%-4rem)/3)] md:min-w-[calc((100%-4rem)/3)]"
              style={{
                background:
                  "linear-gradient(180deg, rgba(35,131,226,1) 0%, rgba(32,122,210,1) 70%, rgba(26,108,196,1) 100%)",
              }}
            >
              <div className="absolute right-4 top-4 rounded-full bg-amber-300 px-3 py-1 text-[10px] font-black uppercase tracking-tighter text-slate-900">
                CHỦ LỰC
              </div>
              <p className="mb-2 text-sm font-bold text-blue-100">CẤP 3 (Khối 10-12)</p>
              <h3 className="mb-6 text-2xl font-black text-white">Web/Frontend Toàn diện</h3>
              <ul className="mb-8 space-y-4">
                {["HTML5, CSS3, JavaScript", "ReactJS Framework", "UX/UI Design cơ bản", "Hosting & Deployment"].map((t) => (
                  <li key={t} className="flex items-center gap-3 text-sm text-blue-50">
                    <span className="material-symbols-outlined shrink-0 text-base text-amber-200">star</span>
                    {t}
                  </li>
                ))}
              </ul>
              <a
                href={CODELAB_SIGNUP_URL}
                className="block w-full rounded-full bg-white py-3 text-center text-sm font-black text-slate-900 transition-colors hover:bg-blue-50"
              >
                Đăng ký học ngay
              </a>
            </div>

            {/* HSG */}
            <div
              id="khoa-on-thi"
              className="group w-[min(100%,calc(100vw-3rem))] shrink-0 snap-start rounded-3xl border bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-0.5 hover:shadow-2xl dark:bg-slate-900/40 md:w-[calc((100%-4rem)/3)] md:min-w-[calc((100%-4rem)/3)]"
              style={{ borderColor: "var(--border-color)" }}
            >
              <p className="mb-2 text-sm font-bold text-primary">NÂNG CAO</p>
              <h3 className="mb-6 text-2xl font-black" style={{ color: "var(--text-primary)" }}>
                Luyện thi Học sinh giỏi
              </h3>
              <ul className="mb-8 space-y-4">
                {["Thuật toán & Cấu trúc dữ liệu", "Ôn luyện C++ chuyên sâu", "Giải đề HKICO, SEACSO"].map((t) => (
                  <li key={t} className="flex items-center gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <span
                      className="material-symbols-outlined shrink-0 text-base"
                      style={{ color: "var(--primary-color)" }}
                    >
                      check_circle
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
              <a
                href={CODELAB_SIGNUP_URL}
                className="block w-full rounded-full border-2 py-3 text-center text-sm font-extrabold transition-colors hover:text-white"
                style={{ borderColor: "var(--primary-color)", color: "var(--primary-color)" }}
                onMouseEnter={(e) => ((e.currentTarget.style.background = "var(--primary-color)"))}
                onMouseLeave={(e) => ((e.currentTarget.style.background = "transparent"))}
              >
                Xem chi tiết
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Mentors */}
      <section className="bg-slate-50 py-24 dark:bg-[#0b1219]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 space-y-4 text-center">
            <h2 className="text-3xl font-black dark:text-white md:text-4xl">Đội ngũ mentor</h2>
            <p className="mx-auto max-w-2xl text-slate-500">
              Học từ những người làm nghề thực sự — kỹ sư phần mềm và giảng viên đồng hành học sinh Vinh trên lộ trình thực chiến.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Nguyễn Quốc Chung",
                role: "Kỹ sư phần mềm · Đào tạo Tin học trẻ",
                headline: "Học từ người làm nghề thực sự, không chỉ lý thuyết.",
                img: CODELAB_IMG.mentorChung,
              },
              {
                name: "Nguyễn Văn Duy",
                role: "Web, API & luyện thi HSG",
                headline: "Thuật toán, backend và tư duy giải bài có hệ thống.",
                img: CODELAB_IMG.mentorDuy,
              },
              {
                name: "Phạm Lê Minh",
                role: "Fullstack & sản phẩm số",
                headline: "Từ UI đến triển khai — portfolio và thuyết trình sản phẩm.",
                img: CODELAB_IMG.mentorMinh,
              },
            ].map((m) => (
              <div
                key={m.name}
                className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-xl dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="relative aspect-square overflow-hidden bg-slate-200 dark:bg-slate-700">
                  <img
                    alt={`Mentor ${m.name}`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    src={m.img}
                  />
                  <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-background-dark/80 to-transparent p-6 opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="flex gap-4">
                      <a
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-colors hover:bg-primary"
                        href={CODELAB_SITE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="material-symbols-outlined text-xl">language</span>
                      </a>
                      <a
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-colors hover:bg-primary"
                        href={CODELAB_FACEBOOK_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="material-symbols-outlined text-xl">share</span>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h4 className="text-xl font-bold">{m.name}</h4>
                  <p className="mt-1 text-sm font-medium text-primary">{m.role}</p>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{m.headline}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 space-y-4 text-center">
            <h2 className="text-3xl font-black dark:text-white md:text-4xl">Học viên tiêu điểm</h2>
            <p className="text-slate-500">Một vài gương mặt học sinh TP. Vinh đồng hành cùng {CODELAB_BRAND_NAME}.</p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="relative rounded-3xl border border-slate-100 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="mb-6 flex items-center gap-4">
                <img
                  alt="Phú Minh"
                  className="h-14 w-14 rounded-full border-2 border-primary object-cover"
                  src={CODELAB_IMG.studentPhuMinh}
                />
                <div>
                  <h5 className="font-bold">Phú Minh</h5>
                  <p className="text-xs text-slate-500">Học viên tiêu biểu · TP. Vinh</p>
                </div>
              </div>
              <p className="italic leading-relaxed text-slate-600 dark:text-slate-400">
                “Em tập trung thực hành dự án nhiều hơn lý thuyết — mentor kèm từng bước nên em tự tin hơn khi làm bài nâng cao.”
              </p>
              <p className="mt-3 text-xs font-bold text-primary">95% — Thực hành dự án</p>
              <div className="mt-6 flex text-amber-400">
                <span className="material-symbols-outlined fill-1">star</span>
                <span className="material-symbols-outlined fill-1">star</span>
                <span className="material-symbols-outlined fill-1">star</span>
                <span className="material-symbols-outlined fill-1">star</span>
                <span className="material-symbols-outlined fill-1">star</span>
              </div>
            </div>

            <div className="relative rounded-3xl bg-primary p-8 text-white shadow-xl shadow-primary/20">
              <span className="material-symbols-outlined absolute right-8 top-8 select-none text-6xl text-white/10">format_quote</span>
              <div className="mb-6 flex items-center gap-4">
                <img
                  alt="Lê Mạnh"
                  className="h-14 w-14 rounded-full border-2 border-white object-cover"
                  src={CODELAB_IMG.studentLeManh}
                />
                <div>
                  <h5 className="font-bold">Lê Mạnh</h5>
                  <p className="text-xs text-white/70">Vinh · Lộ trình Web &amp; Python</p>
                </div>
              </div>
              <p className="italic leading-relaxed">
                “Lộ trình rõ ràng từ web đến Python; em hoàn thành phần lớn bài tập nâng cao nhờ được review code thường xuyên.”
              </p>
              <p className="mt-3 text-xs font-bold text-white/90">92% — Hoàn thành bài tập nâng cao</p>
              <div className="mt-6 flex text-white">
                <span className="material-symbols-outlined fill-1">star</span>
                <span className="material-symbols-outlined fill-1">star</span>
                <span className="material-symbols-outlined fill-1">star</span>
                <span className="material-symbols-outlined fill-1">star</span>
                <span className="material-symbols-outlined fill-1">star</span>
              </div>
            </div>

            <div className="relative rounded-3xl border border-slate-100 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="mb-6 flex items-center gap-4">
                <img
                  alt="Ngọc Phương"
                  className="h-14 w-14 rounded-full border-2 border-primary object-cover"
                  src={CODELAB_IMG.studentNgocPhuong}
                />
                <div>
                  <h5 className="font-bold">Ngọc Phương</h5>
                  <p className="text-xs text-slate-500">Học viên tiên tiến · Dự án cá nhân</p>
                </div>
              </div>
              <p className="italic leading-relaxed text-slate-600 dark:text-slate-400">
                “Em tự làm được một dự án web riêng và thuyết trình trước lớp — trước đó em chỉ nghĩ code là trên sách giáo khoa.”
              </p>
              <p className="mt-3 text-xs font-bold text-primary">88% — Tự chủ sản phẩm riêng</p>
              <div className="mt-6 flex text-amber-400">
                <span className="material-symbols-outlined fill-1">star</span>
                <span className="material-symbols-outlined fill-1">star</span>
                <span className="material-symbols-outlined fill-1">star</span>
                <span className="material-symbols-outlined fill-1">star</span>
                <span className="material-symbols-outlined fill-1">star</span>
              </div>
            </div>

            <div className="relative rounded-3xl border border-slate-100 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="mb-6 flex items-center gap-4">
                <img
                  alt="Nguyễn Quang Vinh"
                  className="h-14 w-14 rounded-full border-2 border-primary object-cover"
                  src={CODELAB_IMG.studentQuangVinh}
                />
                <div>
                  <h5 className="font-bold">Nguyễn Quang Vinh</h5>
                  <p className="text-xs text-slate-500">Vinh · Lộ trình Web &amp; Python</p>
                </div>
              </div>
              <p className="italic leading-relaxed text-slate-600 dark:text-slate-400">
                “Buổi học nhóm và debug cùng mentor giúp em hiểu sâu bài khó; em làm được gần hết bài nâng cao trong khóa.”
              </p>
              <p className="mt-3 text-xs font-bold text-primary">93% — Hoàn thành bài tập nâng cao</p>
              <div className="mt-6 flex text-amber-400">
                <span className="material-symbols-outlined fill-1">star</span>
                <span className="material-symbols-outlined fill-1">star</span>
                <span className="material-symbols-outlined fill-1">star</span>
                <span className="material-symbols-outlined fill-1">star</span>
                <span className="material-symbols-outlined fill-1">star</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Links */}
      {/* <section className="bg-slate-50 py-24 dark:bg-[#0b1219]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 space-y-4 text-center">
            <h2 className="text-3xl font-black dark:text-white md:text-4xl">Hệ sinh thái &amp; công cụ</h2>
            <p className="text-slate-500">
              Công cụ nội bộ và nền tảng đồng hành học viên {CODELAB_BRAND_NAME} — từ portfolio đến theo dõi tiến độ.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            {ecosystemAppsToRender.map((app, idx) => {
              const isHttpIcon = !!app.icon && /^https?:\/\//.test(app.icon);
              const isHttpImage = !!app.image && /^https?:\/\//.test(app.image);
              const href = app.url || "#";
              const bgClass = idx % 2 === 0 ? "bg-indigo-50 dark:bg-slate-900" : "bg-blue-50 dark:bg-slate-900";
              const iconBgClass = idx % 2 === 0 ? "bg-indigo-100 dark:bg-indigo-500/20" : "bg-primary/10";

              return (
                <div
                  key={app._id || app.name}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800 md:flex-row"
                >
                  <div className="flex flex-col justify-center gap-6 p-8 md:w-1/2">
                    <div>
                      <h4 className="mb-2 text-2xl font-bold">{app.name}</h4>
                      <p className="line-clamp-2 text-sm leading-relaxed text-slate-500">{app.description || ""}</p>
                    </div>
                    <a
                      className="inline-flex items-center gap-2 font-bold text-primary transition-all group-hover:gap-3"
                      href={href}
                      target={app.openInNewTab ? "_blank" : undefined}
                      rel={app.openInNewTab ? "noopener noreferrer" : undefined}
                    >
                      Truy cập ứng dụng
                      <span className="material-symbols-outlined text-sm">open_in_new</span>
                    </a>
                  </div>

                  <div className={`flex items-center justify-center p-8 md:w-1/2 ${bgClass}`}>
                    <div className="flex w-full flex-col gap-2 overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-700 dark:bg-slate-800">
                      <div className="flex gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-red-400" />
                        <div className="h-2 w-2 rounded-full bg-amber-400" />
                        <div className="h-2 w-2 rounded-full bg-emerald-400" />
                      </div>
                      <div className="flex flex-1 items-center justify-center overflow-hidden rounded bg-slate-50 dark:bg-slate-900/50">
                        {isHttpImage ? (
                          <img alt={app.name} className="h-full w-full object-cover" src={app.image} />
                        ) : (
                          <span className="material-symbols-outlined text-4xl text-slate-300">image</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section> */}

      {/* Blog */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-16 flex flex-col items-end justify-between gap-6 md:flex-row">
          <div className="space-y-4">
            <span className="text-sm font-bold uppercase tracking-widest text-primary">Tin tức &amp; Bài viết</span>
            <h2 className="text-3xl font-black dark:text-white md:text-4xl">Blog công nghệ mới nhất</h2>
          </div>
          <button className="flex items-center gap-2 font-bold text-slate-500 transition-colors hover:text-primary">
            Xem tất cả bài viết
            <span className="material-symbols-outlined">east</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              tag: "Kết quả",
              tagClass: "bg-primary/10 text-primary",
              date: "CodeLab",
              title: "Website cá nhân sau khóa học",
              desc: "Học viên tự thiết kế và lập trình trang web giới thiệu bản thân chuyên nghiệp — minh họa từ lớp thực chiến.",
              img: CODELAB_IMG.resultPortfolio,
            },
            {
              tag: "Dự án",
              tagClass: "bg-amber-500/10 text-amber-500",
              date: "CodeLab",
              title: "App web thực tế: quản lý, to-do, blog",
              desc: "Ứng dụng hữu ích như quản lý chi tiêu, to-do list hay blog tin tức — đúng tinh thần dự án thật tại Vinh.",
              img: CODELAB_IMG.resultAppWeb,
            },
            {
              tag: "Tư duy",
              tagClass: "bg-emerald-500/10 text-emerald-500",
              date: "CodeLab",
              title: "Thói quen tự học &amp; tài liệu quốc tế",
              desc: "Rèn kiên trì, tự tìm tài liệu và làm chủ quy trình giải quyết vấn đề — nền tảng lâu dài cho học sinh.",
              img: CODELAB_IMG.resultMindset,
            },
          ].map((b) => (
            <article key={b.title} className="group">
              <div className="mb-6 aspect-video overflow-hidden rounded-3xl">
                <img
                  alt="Blog"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src={b.img}
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${b.tagClass}`}>{b.tag}</span>
                  <span className="text-xs text-slate-500">{b.date}</span>
                </div>
                <h3 className="text-xl font-bold leading-tight transition-colors group-hover:text-primary">{b.title}</h3>
                <p className="line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{b.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="mx-auto mb-24 max-w-7xl px-6">
        <div className="relative flex flex-col items-center overflow-hidden rounded-[2.5rem] bg-primary p-12 text-center text-white md:p-20">
          <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-48 w-48 -translate-x-1/2 translate-y-1/2 rounded-full bg-black/10 blur-2xl" />
          <h2 className="mb-6 max-w-2xl text-3xl font-black md:text-5xl">Theo dõi {CODELAB_BRAND_NAME} Vinh</h2>
          <p className="mb-10 max-w-xl text-lg text-white/80">
            Nhận lịch khai giảng, ưu đãi khóa mới và mẹo học lập trình cho phụ huynh &amp; học sinh — tại TP. Vinh, Nghệ An.
          </p>
          <a
            href={CODELAB_SIGNUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="max-w-md w-full inline-flex items-center justify-center rounded-2xl bg-white px-10 py-4 font-black text-primary shadow-xl transition-all hover:bg-slate-100 hover:text-primary"
          >
            Đăng ký
          </a>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;