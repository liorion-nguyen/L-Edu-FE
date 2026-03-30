import { useEffect, useMemo, useRef, useState } from "react";
import { Category, categoryService } from "../../services/categoryService";
import { Footer, FooterLink, footerService } from "../../services/footerService";
import { LinkedApp, linkedAppService } from "../../services/linkedAppService";

const LandingPage = () => {
  const [linkedApps, setLinkedApps] = useState<LinkedApp[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [companySection, setCompanySection] = useState<Footer | null>(null);
  const companyTrackRef = useRef<HTMLDivElement | null>(null);
  const categoryTrackRef = useRef<HTMLDivElement | null>(null);

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
            { label: "Google", url: "#", isExternal: true },
            { label: "Meta", url: "#", isExternal: true },
            { label: "Microsoft", url: "#", isExternal: true },
            { label: "Amazon", url: "#", isExternal: true },
            { label: "Netflix", url: "#", isExternal: true },
            { label: "Apple", url: "#", isExternal: true },
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
              Tương lai của giáo dục IT
            </div>

            <h1 className="text-5xl font-black leading-tight tracking-tight dark:text-white lg:text-7xl">
              Học lập trình từ{" "}
              <span className="bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">cơ bản</span> đến{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-primary bg-clip-text text-transparent">nâng cao</span>
            </h1>

            <p className="max-w-lg text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              Khám phá thế giới lập trình với các khóa học chất lượng cao, được thiết kế bởi các chuyên gia hàng đầu từ Google, Meta và Microsoft.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <button className="flex items-center gap-3 rounded-2xl bg-primary px-8 py-4 text-lg font-bold text-white shadow-xl shadow-primary/30 transition-all hover:bg-primary/90">
                Bắt đầu ngay
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <button className="rounded-2xl border border-slate-200 bg-white px-8 py-4 text-lg font-bold transition-all hover:border-primary dark:border-slate-700 dark:bg-slate-800">
                Xem khóa học
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                <img
                  alt="Student"
                  className="h-10 w-10 rounded-full border-4 border-background-light object-cover dark:border-background-dark"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNT3xKdcYhwvIZredtwcdj0-pOdpK6r3Vf6yiAwinlm5Krz07u3gIU2BeDI_m2mL_Tg4Fu1LlKydZzLn5DtgJxP1DNvojyp08bmJDGYU4G7yVyQbbnryT-zI5GDTNV7UjvjmM9-M5qUgJ2qT2VZ2-IWeOSfbMAVrVee9E1JGc2iwQ4Q613NinxI1gF92v8duHD7p6TBXY5rN_DoEgUdbxWyQSv-SZYTS-Gse3Pnpw-nwJeOsVbidTqk3DJQeFbEcClO5_V_5PdYIE"
                />
                <img
                  alt="Student"
                  className="h-10 w-10 rounded-full border-4 border-background-light object-cover dark:border-background-dark"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBW9M-oh-ICon_jBfdYgnOvv_7v8TajD2TaXPAVSgKlKJm9F5izuKIZfgPrMGKRRwNseQHaki6jRA3L4Ppkf0IbJpIBt8QlfSkeptBOrdKCaxnvUtnavd6FFotFD9KV1TQK0bpw-lYWh2h_uDUHIwsIfvEEtxQw16AuYIdgnlk8c_gMMVsSyER_tBiS4MkRBp3WryHXRyZM5YR4zc5q_USlSPKGCTPCX3IKwABBdg9BBeHxqYAZJbGxszIaVdMhieFbORFIiAuRrk"
                />
                <img
                  alt="Student"
                  className="h-10 w-10 rounded-full border-4 border-background-light object-cover dark:border-background-dark"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMrGogxPV81RkS4Ntw85vgOqtLx-JDsadCh1UZgSkVjJ9qYUXsj4qkbK91X_ojFIfmnxmpDbyVEt7sST_Jhgw5OE9FSqfQljWvGePYA-BjRPLAnDVEjB56gA2OR5dGI7RwZzPwxAvYlkA-Smh2s2MFCAIvDowKhXv2qSpaAlKWwy_RbSfVtsN4hBKRLVySKy0FfYr-G-uBdfhcoh2eeH1PYFffyx71t_vmqxdmD09WyUF8_OXb8QypNArGJUwPsol8ADu0xmzkdcs"
                />
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-4 border-background-light bg-slate-200 text-[10px] font-bold dark:border-background-dark dark:bg-slate-700">
                  +200k
                </div>
              </div>
              <p className="text-sm font-medium text-slate-500">200k+ học viên đã đăng ký học</p>
            </div>
          </div>

          <div className="relative grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl">
                <img
                  alt="Coding"
                  className="h-full w-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbgBp9IzW8iGA90lnVDernAd90X6HOkSPa7mbxBsQriNVcBwnT7uhpUmiPafJpQ_c4tsFMcGKqTU-mDtmwDUuKQDZg1AQO69LYHBupD88vEmcWpW55Q16fGNj1K0kRQsdBX05C7Vtz3rxkWG3ircmg7QPnBM9KmybjJWNHSpXQxEBRZXSp4JSCpRlZc-Bpmhwt3bie-68WScOwzm5zao-usIcg7ordJBd_sBZsZgScwl-9cxVAIhhTBU9C1MMwmGoORW7liEKBQgU"
                />
              </div>
              <div className="aspect-square overflow-hidden rounded-3xl shadow-2xl">
                <img
                  alt="Collaboration"
                  className="h-full w-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDh214laZ7oHU0H_sABl11d2vRAE_JCnxUn7pmJjKNGVUJfg4ojYAcH6Fm8sRiTEQfHQjewOF6nwXkekoKjpdAG-MVymC6RKCuSFfkrpTv1dHc2OSvrivdUB3iShlFJcrSs8yQnIoRi5bHj9AZOFoS70-72VKywkCXGTNeXqiT4QwYqO0Xggwp6Soly9FXwxq3ZBsWWzMq7w8CXvaSnHUevh68Q1llrPwJrg1OkpeZUmf0CgEM_l_2EOLGzm4-Igi3aLf8dvNe1IWk"
                />
              </div>
            </div>
            <div className="space-y-4 pt-12">
              <div className="aspect-square overflow-hidden rounded-3xl shadow-2xl">
                <img
                  alt="Learning"
                  className="h-full w-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGq5htMivjMkQjyT5Y6rWNl-Bk3Hlk6T4qo6_a1QVv97OmMTXF2ciBgYqK3gq5c7cbkgozLxpMC10jjm5TOZHu0-xNopn9py8ctz4W28d0DqhIvaO-zPAVhXCIiX2P7-eBrNKflUAkww2S14IXm0gIsJvZFmfT34-XJCsnSPOAZp3am3c9t_wQwUfP-McdRgC6BwqnrCG4GzCcbnQMLlFpEITx82vn-oB5mRhKxSMxZPth2KbX5pZ_UoZONpNQjl-jDFf9lw5RrPk"
                />
              </div>
              <div className="aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl">
                <img
                  alt="Workshop"
                  className="h-full w-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfiSE7pQI1RAeG3l9cf7iuyvefqN-TBxrKVPiiFo-f-FMPDLeYMNsHKEs8bLPRYG3iK1iOr9D5zQugZNMJk8EhH40CwYPxnZIheZCB0pbmZi9iouk2m1EVRyYvtcPToBUHDT5UmUFjLo8v8AABe1TwIQxa0g8yu6jWJUu1WyiIp9wAA3ddPLGgIGLMEZ8kiPvTwzIa6lFj9xCHvICo-eer0zSGLb4KxsVcfrTaPloLw5YvlNhVI6X5OL47z0woqnX5X8LKKNTRK48"
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
              <div className="text-4xl font-black text-primary">200.1K+</div>
              <div className="text-sm font-medium uppercase tracking-widest text-slate-500">Học viên đăng ký</div>
            </div>
            <div className="space-y-2 text-center">
              <div className="text-4xl font-black text-primary">253</div>
              <div className="text-sm font-medium uppercase tracking-widest text-slate-500">Mentor chuyên gia</div>
            </div>
            <div className="space-y-2 text-center">
              <div className="text-4xl font-black text-primary">500.0K+</div>
              <div className="text-sm font-medium uppercase tracking-widest text-slate-500">Đánh giá học viên</div>
            </div>
            <div className="space-y-2 text-center">
              <div className="text-4xl font-black text-primary">180.0K+</div>
              <div className="text-sm font-medium uppercase tracking-widest text-slate-500">Hoàn thành</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-16 space-y-4 text-center">
          <h2 className="text-3xl font-black dark:text-white md:text-4xl">Tại sao chọn L-Edu?</h2>
          <div className="mx-auto h-1.5 w-20 rounded-full bg-primary" />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="group rounded-2xl border border-slate-100 bg-white p-8 transition-all hover:border-primary dark:border-slate-700/50 dark:bg-slate-800/50">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-primary transition-transform group-hover:scale-110 dark:bg-blue-500/10">
              <span className="material-symbols-outlined text-3xl">school</span>
            </div>
            <h3 className="mb-3 text-xl font-bold">Khóa học chất lượng</h3>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Nội dung bài giảng được cập nhật liên tục theo xu hướng công nghệ mới nhất.
            </p>
          </div>

          <div className="group rounded-2xl border border-slate-100 bg-white p-8 transition-all hover:border-primary dark:border-slate-700/50 dark:bg-slate-800/50">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-500 transition-transform group-hover:scale-110 dark:bg-emerald-500/10">
              <span className="material-symbols-outlined text-3xl">support_agent</span>
            </div>
            <h3 className="mb-3 text-xl font-bold">Hỗ trợ 24/7</h3>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Đội ngũ mentor luôn sẵn sàng giải đáp thắc mắc và hỗ trợ bạn trong suốt quá trình.
            </p>
          </div>

          <div className="group rounded-2xl border border-slate-100 bg-white p-8 transition-all hover:border-primary dark:border-slate-700/50 dark:bg-slate-800/50">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-500 transition-transform group-hover:scale-110 dark:bg-amber-500/10">
              <span className="material-symbols-outlined text-3xl">rocket_launch</span>
            </div>
            <h3 className="mb-3 text-xl font-bold">Dự án thực tế</h3>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Thực hành với các dự án thực tế để xây dựng Portfolio chuyên nghiệp.
            </p>
          </div>

          <div className="group rounded-2xl border border-slate-100 bg-white p-8 transition-all hover:border-primary dark:border-slate-700/50 dark:bg-slate-800/50">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-500 transition-transform group-hover:scale-110 dark:bg-indigo-500/10">
              <span className="material-symbols-outlined text-3xl">workspace_premium</span>
            </div>
            <h3 className="mb-3 text-xl font-bold">Chứng chỉ uy tín</h3>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Nhận chứng chỉ hoàn thành khóa học có giá trị cao khi ứng tuyển việc làm.
            </p>
          </div>
        </div>
      </section>

      {/* Company */}
      <section className="bg-slate-50 py-20 dark:bg-[#0b1219]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div className="space-y-3">
              <span className="text-sm font-bold uppercase tracking-widest text-primary">Company</span>
              <h2 className="text-3xl font-black dark:text-white md:text-4xl">
                {companySection?.title || "Được tin tưởng bởi các đội ngũ hàng đầu"}
              </h2>
              <p className="max-w-2xl text-slate-500">
                Những công nghệ và tư duy xây dựng sản phẩm mà bạn học tại L-Edu tương thích với tiêu chuẩn của các công ty hiện đại.
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
      </section>

      {/* Khám phá danh mục */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div className="space-y-3">
            <span className="text-sm font-bold uppercase tracking-widest text-primary">Danh mục</span>
            <h2 className="text-3xl font-black dark:text-white md:text-4xl">Khám phá danh mục</h2>
            <p className="max-w-2xl text-slate-500">Chọn lộ trình phù hợp và bắt đầu học theo mục tiêu của bạn.</p>
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
      </section>

      {/* Mentors */}
      <section className="bg-slate-50 py-24 dark:bg-[#0b1219]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 space-y-4 text-center">
            <h2 className="text-3xl font-black dark:text-white md:text-4xl">Mentor khóa học của chúng tôi</h2>
            <p className="mx-auto max-w-2xl text-slate-500">
              Những chuyên gia có nhiều năm kinh nghiệm trong lĩnh vực phần mềm sẽ dẫn dắt bạn trên con đường chinh phục code.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                name: "Lê Thị Hồng Nhung",
                role: "Fullstack Developer",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAHlThwxqYSkU5GV65sYfHeevBagbOChLF7nOXxivnhgOfVoIol3yD8YC5RpErl4US21A2am_KkuE0ZJUxlC0mLWRv24AcGkdphX7XuvFpc_zvx3n7TgUxlAOUFjjRqIehitzyQdyaPOBILo-yVpVD9j24Q-Il7Zcw57AUbsEVCkLiLjObm6LiMQqhnrNACM4URbSnIGK2vlm0U_MYImCbJzrUGHiwO97_GLFWsFhNQn4wgGK1FJJDjZGxUk7O8ccgbLi61NErLDkc",
              },
              {
                name: "Phạm Gia Bảo",
                role: "Senior Web Architect",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAEDDC8CSipq2mBgrleYJOIKj1OQeHILl5p0aL9AwmqsP3Ndf9xywtCVEsLYVFWyS88p8oC63zDqz9s-TsW4mwi6khhTWTHX4iKel_QlNEwdsB0Om6er_LQOT_PgIH08fyqvKpC7JeXqLlGkqyEIZj1dQziMi8CzteTB-EuABG1OIfuGj49DBGIte4OvqiLhSurSP3ynBKoVyWYlAx5gb3583UpyWndg0Xs9PIOVwvVIck3QXy6YSRPyEaB0uRGEpO-acg2oczDeFc",
              },
              {
                name: "Nguyễn Thanh Tùng",
                role: "Mobile Developer",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBjkELWqwl_qxWCnyv0j_RX7lOdZwbXl10X-Uty17fceOcJECXeQRpNwuh79HrWYCiicTDKVi1um4pb4M8w0piEm2jpXDNku8jpmTbBU9BwbsN6tM1o9ydoPDXwq_NHTkSzG4AR8b5Nbecl5ZxlwR6bzA1PsOK6tXKG5pHgrP1IT38GrSAPnT3FPpFm5Uoc2UT-iHGnRr47thLtIpbq5Xw6PXUipWTu_SnD2So74qwyPFqm8Ng2BdeDNXOE70RuHtB15Eby6PxGFb0",
              },
              {
                name: "Trần Minh Đức",
                role: "AI Research Lead",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC15OIJ5CnST0ncCTOLH_ptdOpWTnqQu4fulNLXxnNGStvCvmZ92lZkvx4PxhiC2jrJdR-6LnC5BjebartDgarJmlU1lfIad0R-Zt5p8R02Jz5qFhp_hPb6tOLNU-ISr0jWDfqT8M2SrbGSdC3LdgdrkQ5hkec0kjLXg9zcfD5PvZdtTy5pvhjJ8GE3yU6uR6BYVMaPRszoLHBXoTK3TFBgyhq_wk7xrUbIPhGZFLpJj1WQq3yZWobSE4xFUzH58jQc6lWnzs0x3Q4",
              },
            ].map((m) => (
              <div
                key={m.name}
                className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-xl dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="relative aspect-square overflow-hidden bg-slate-200 dark:bg-slate-700">
                  <img
                    alt="Mentor"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    src={m.img}
                  />
                  <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-background-dark/80 to-transparent p-6 opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="flex gap-4">
                      <a
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-colors hover:bg-primary"
                        href="/"
                      >
                        <span className="material-symbols-outlined text-xl">language</span>
                      </a>
                      <a
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-colors hover:bg-primary"
                        href="/"
                      >
                        <span className="material-symbols-outlined text-xl">code</span>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h4 className="text-xl font-bold">{m.name}</h4>
                  <p className="mt-1 text-sm font-medium text-primary">{m.role}</p>
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
            <h2 className="text-3xl font-black dark:text-white md:text-4xl">Đánh giá từ học viên</h2>
            <p className="text-slate-500">Hàng ngàn học viên đã thay đổi sự nghiệp sau các khóa học tại L-Edu.</p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="relative rounded-3xl border border-slate-100 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="mb-6 flex items-center gap-4">
                <img
                  alt="User"
                  className="h-14 w-14 rounded-full border-2 border-primary object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDN_rZeApIYYNQfLm0ixzR6mk-LZVgTMTseiod6Z6eTDGYxCS-ftIr3y7fFC7ut3uEeOvgi_6iqRcs5Q40MKZvO0OZ5H9hewiGmCkXQlxeIkJ4-pivhkRgO_q03BU98ynPqstXr-zfcCFq9Yn-ZsOofLq9-ziIBDsxsQKUwMbgN2xOGc3CaVxBg9z2j47oFXopTdhjS9gT7hrLBwgrrskhJWAQm-5gtJXi7lyPTFjSK6VbOyYNF7SwAYzbTy7jwEGDZUIZ7t-LdTLg"
                />
                <div>
                  <h5 className="font-bold">Nguyễn Văn A</h5>
                  <p className="text-xs text-slate-500">React Native Student</p>
                </div>
              </div>
              <p className="italic leading-relaxed text-slate-600 dark:text-slate-400">
                "Khóa học rất bổ ích! Giảng viên hướng dẫn chi tiết, giúp mình hiểu rõ cách xây dựng ứng dụng di động với React Native."
              </p>
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
                  alt="User"
                  className="h-14 w-14 rounded-full border-2 border-white object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBx9Zxi8zh5d5kPqm17kd4fcsOZaWkhPQZocI5p9JKKW49tyrchq-TsqNZqMwml9VugsZ0Jf0wmR96zK1Gb6GnV5wOik61eQh7lPDSzZG7TBtMBEtc4Na0whabIAPy9Nzqrf5LrkmcWRPlynHFsQ_TYXAhcdvepXk0xNyCztEZYCgSOg97QPw0ZbsPUNDxK2iOb1XieniMwlJfAsc7HoDwZ0HX4dnJ54KLTiDkScLsmEHFVH7ziJMvzKoE53JkBZQ0kCbzJ_xPY5F0"
                />
                <div>
                  <h5 className="font-bold">Trần Thị Bích Ngọc</h5>
                  <p className="text-xs text-white/70">ReactJS Enthusiast</p>
                </div>
              </div>
              <p className="italic leading-relaxed">
                "Mình đã học nhiều khóa học lập trình trước đây nhưng đây là khóa ReactJS khiến mình hài lòng nhất. Giảng viên dạy rất có tâm."
              </p>
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
                  alt="User"
                  className="h-14 w-14 rounded-full border-2 border-primary object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEWy-fKv8WDsUhk5PlHXS1R0PyBoUtE5B9Kb8pJl2RTk2XT_ELpjMKiHDDW1OendMAGPlGerPPq3r9d8JYMwdjPSf8Zmhl1-5OGwLkdwsP6Hy_u6oOehd4kwrHSTCeCG-Vfh4ov9Fllz8vWHuszsIkTw666N915OuwfeH3jbCTrBS7RfQ4APjJnihQ-5fVL2-6kGwojILXw8ZZ7H-8LxdYJ8YKiWO3M0kBiuLvnFDjBUUrHqCrWJavTg46he7W8b-W_u5F9PhvA70"
                />
                <div>
                  <h5 className="font-bold">Lê Minh Tuấn</h5>
                  <p className="text-xs text-slate-500">Backend Student</p>
                </div>
              </div>
              <p className="italic leading-relaxed text-slate-600 dark:text-slate-400">
                "Khóa học tuyệt vời! Mình đã có một nền tảng kiến thức vững chắc để tự tin ứng tuyển vị trí Backend Developer."
              </p>
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
      <section className="bg-slate-50 py-24 dark:bg-[#0b1219]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 space-y-4 text-center">
            <h2 className="text-3xl font-black dark:text-white md:text-4xl">Hệ sinh thái ứng dụng</h2>
            <p className="text-slate-500">Khám phá các công cụ hỗ trợ học tập và thực hành của L-Edu.</p>
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
      </section>

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
              tag: "React Native",
              tagClass: "bg-primary/10 text-primary",
              date: "15 Oct, 2024",
              title: "Hướng dẫn React Native cho người mới bắt đầu",
              desc: "Tìm hiểu cách xây dựng ứng dụng di động đa nền tảng với React Native từ những bước đầu tiên...",
              img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDlERYqPFG7SKVmjUGh2F8kH815d63BmkXLK7pScScXjW1TUlabUd1bWMJCuDx6lXg2m3Kwb0banOcqxJNx-M6Nv8qHyXh_ifcROZLBfJotX3oMk31txwNbeo2p1T-9NpcBsciMGbiF_ECH4i9lnP9je8oRDIv77H-xoa5ITs1OTWIetC_SM6eyMPUTt4uEbu3L1TFjFRup8CHJSEzOdpTQQv4wAtc7gaDwqyxSK4ZXg5LgJ79gE9qlgel8jeis0BmbwlKhRP3qz24",
            },
            {
              tag: "Javascript",
              tagClass: "bg-amber-500/10 text-amber-500",
              date: "12 Oct, 2024",
              title: "JavaScript ES6+ Những tính năng quan trọng",
              desc: "Khám phá các tính năng hiện đại của JavaScript giúp code của bạn sạch hơn và hiệu quả hơn...",
              img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBTaxuF9NtCw2H3QYF8DlRzVzADselLdUXmU7I4bjETTpGe86m5ehlYCItU8w7rVzbmPYLEDlTVX468OW7C9Z3kEi3ceWR8JvJ-CxI8d5-FrCkuUGkwsTJSWZhGkva_zX5tHlStiP7INlMlWYXjX_tBlO0bVUKzxcjsAyumUNQa9wese_jvmTnR-s1A2vXsv5K5e4GTrBVFKdFCoGd8-jpK4I4VBAgYbdcn5YxH_jixonohLiwY6D8prZ5J6pUWuP3kdh8Jd3LPbn8",
            },
            {
              tag: "Career",
              tagClass: "bg-emerald-500/10 text-emerald-500",
              date: "08 Oct, 2024",
              title: "Lộ trình học trở thành Fullstack Developer 2025",
              desc: "Cập nhật xu hướng tuyển dụng và bộ kỹ năng cần thiết để chinh phục mức lương nghìn đô...",
              img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDoXix6f8gkmFqbDdFbF1Q1QVaYMLkiVvF6DjgRqdtJ17kdkxbgOAW1uUHIYspSJ_O9Y8_eLEwlOY8RO-rcdszxCoW6fsrchTN8rWjvxB5kQcfqpldDU6COb7OHaSYaloZne_W6LInBKqKInRfcD5urGfCmeDpMpe2X2eS0Kfq8HlCMtLPTBhoqTlMQi9JmcMfFqptdcS51aGdodGdy71XWrF5tVvrRdo926GmIu6iKUljbPPQMOuwz-qfA1EESGyz0Cz5ed_qXUi8",
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
          <h2 className="mb-6 max-w-2xl text-3xl font-black md:text-5xl">Đăng ký nhận tin tức mới nhất từ L-Edu</h2>
          <p className="mb-10 max-w-xl text-lg text-white/80">
            Nếu bạn quan tâm đến các khóa học của chúng tôi và muốn biết thêm về tin tức mới nhất, đừng bỏ lỡ.
          </p>
          <form className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
            <input
              className="flex-1 rounded-2xl border border-white/30 bg-white/20 px-6 py-4 placeholder:text-white/60 outline-none focus:ring-2 focus:ring-white"
              placeholder="Nhập email của bạn..."
              type="email"
            />
            <button className="rounded-2xl bg-white px-8 py-4 font-black text-primary shadow-xl transition-all hover:bg-slate-100">
              Đăng ký
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;