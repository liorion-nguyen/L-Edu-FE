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
  if (pathname === "/") return `${CODELAB_BRAND_NAME} — Học lập trình thực chiến`;
  if (pathname === "/aboutus") return "Giới thiệu";
  if (pathname === "/course") return "Khoá học";
  if (pathname.startsWith("/course/")) return "Khoá học";
  if (pathname.startsWith("/my-classes")) return "Lớp học";
  if (pathname.startsWith("/exams")) return "Kỳ thi";
  return undefined;
}

function routeDescription(pathname: string): string | undefined {
  if (pathname === "/") {
    return `${CODELAB_BRAND_NAME} — lập trình thực chiến cho học sinh 12–18 tại TP. Vinh, Nghệ An.`;
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
        <title>{s.title}</title>
        <meta name="description" content={s.description} />
        <link rel="canonical" href={s.canonical} />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={s.title} />
        <meta property="og:description" content={s.description} />
        <meta property="og:url" content={s.canonical} />
        <meta property="og:image" content={s.ogImage} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={s.title} />
        <meta name="twitter:description" content={s.description} />
        <meta name="twitter:image" content={s.ogImage} />

        <meta
          name="robots"
          content={s.noindex ? "noindex, nofollow" : "index, follow"}
        />
      </Helmet>

      {!noindex && <SeoJsonLd phone={s.contact.phone} email={s.contact.email} />}
    </>
  );
}

