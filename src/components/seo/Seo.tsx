import React from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { CODELAB_BRAND_NAME } from "../../constants/codelabSite";
import { buildSeo } from "../../lib/seo";
import { SeoJsonLd } from "./SeoJsonLd";

function shouldNoIndex(pathname: string): boolean {
  return (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/dashboard-program") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/change-password") ||
    pathname.startsWith("/profile/") ||
    pathname.startsWith("/test/") ||
    pathname.startsWith("/debug/")
  );
}

function routeTitle(pathname: string): string | undefined {
  if (pathname === "/") {
    return "Học lập trình Python, Web & mentor kèm — Vinh, Nghệ An";
  }
  if (pathname === "/aboutus") {
    return "Giới thiệu CodeLab — lộ trình & đội ngũ";
  }
  if (pathname === "/course") {
    return "Khóa học lập trình — Python, Web, React";
  }
  if (pathname.startsWith("/course/")) {
    return "Chi tiết khóa học";
  }
  if (pathname.startsWith("/my-classes")) {
    return "Lớp học của tôi";
  }
  if (pathname.startsWith("/exams")) {
    return "Kỳ thi & đánh giá";
  }
  return undefined;
}

function routeDescription(pathname: string): string | undefined {
  if (pathname === "/") {
    return (
      `${CODELAB_BRAND_NAME} — học lập trình thực chiến cho học sinh tại TP. Vinh, Nghệ An: Python, tư duy logic, Web/Frontend (HTML, CSS, JavaScript, React), ` +
      `dự án thật và định hướng ôn thi HSG khi phù hợp. Đăng ký học tại app.codelab.pro.vn.`
    );
  }
  if (pathname === "/aboutus") {
    return `${CODELAB_BRAND_NAME} — vì sao chọn học lập trình tại Vinh: chương trình, mentor và cách học thực chiến.`;
  }
  if (pathname === "/course" || pathname.startsWith("/course/")) {
    return `Danh sách và chi tiết khóa học ${CODELAB_BRAND_NAME}: Python, Web, lộ trình rõ ràng cho học sinh.`;
  }
  return undefined;
}

/**
 * SEO global cho SPA (React Router): canonical, OG/Twitter, robots meta, JSON-LD cho trang public.
 * Lưu ý: SPA không SSR nên bot sẽ thấy meta tốt nhất khi render (Googlebot ok; social crawler tuỳ).
 */
export default function Seo() {
  const location = useLocation();
  const pathname = location.pathname || "/";
  const noindex = shouldNoIndex(pathname);

  const s = buildSeo({
    pathname,
    title: routeTitle(pathname),
    description: routeDescription(pathname),
    noindex,
  });

  return (
    <>
      <Helmet>
        <html lang="vi" />
        <title>{s.title}</title>
        <meta name="description" content={s.description} />
        <meta name="keywords" content={s.keywords} />
        <link rel="canonical" href={s.canonical} />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={CODELAB_BRAND_NAME} />
        <meta property="og:locale" content="vi_VN" />
        <meta property="og:title" content={s.title} />
        <meta property="og:description" content={s.description} />
        <meta property="og:url" content={s.canonical} />
        <meta property="og:image" content={s.ogImage} />
        <meta property="og:image:alt" content={`${CODELAB_BRAND_NAME} — logo`} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={s.title} />
        <meta name="twitter:description" content={s.description} />
        <meta name="twitter:image" content={s.ogImage} />

        <meta name="author" content={CODELAB_BRAND_NAME} />
        <meta
          name="robots"
          content={s.noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"}
        />
      </Helmet>

      {!noindex && <SeoJsonLd phone={s.contact.phone} email={s.contact.email} />}
    </>
  );
}

