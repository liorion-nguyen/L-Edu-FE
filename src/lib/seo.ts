import {
  CODELAB_ADDRESS_TEXT,
  CODELAB_BRAND_NAME,
  CODELAB_CONTACT_EMAIL,
  CODELAB_CONTACT_PHONE,
  CODELAB_FACEBOOK_URL,
  CODELAB_SITE_URL,
  CODELAB_TIKTOK_URL,
} from "../constants/codelabSite";

/** Từ khóa thương hiệu + địa phương — dùng cho meta keywords & nhất quán nội dung SEO */
export const seoKeywords = [
  "CodeLab",
  "CodeLab Vinh",
  "CodeLab Nghệ An",
  "codelab.pro.vn",
  "học lập trình Vinh",
  "học lập trình Nghệ An",
  "học Python cho học sinh",
  "học web frontend",
  "React học sinh",
  "lớp lập trình TP Vinh",
  "ôn thi học sinh giỏi tin",
].join(", ");

export const seo = {
  /** Title mặc định — thương hiệu đứng đầu để nhất quán trên Google */
  title: `${CODELAB_BRAND_NAME} — Học lập trình Python, Web & luyện thi tại Vinh`,
  /** Mô tả mặc định: nhắc CodeLab + dịch vụ + địa phương (tự nhiên, không nhồi) */
  description:
    `${CODELAB_BRAND_NAME} — trung tâm dạy lập trình thực chiến tại ${CODELAB_ADDRESS_TEXT}: Python, Web/Frontend (HTML, CSS, JavaScript, React), ` +
    `lớp nhỏ, mentor kèm, dự án thật. Hệ thống học tập trực tuyến tại app.codelab.pro.vn.`,
  /** Ảnh OG: logo cột nhìn tốt hơn icon khi share */
  ogImagePath: "/codelab/logo/logo_col.png",
} as const;

export function siteOrigin(): string {
  return CODELAB_SITE_URL.replace(/\/$/, "");
}

export function absoluteUrl(pathname: string): string {
  const base = siteOrigin();
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${base}${path}`;
}

export type SeoInput = {
  title?: string;
  description?: string;
  pathname?: string;
  noindex?: boolean;
};

function finalizeTitle(raw?: string): string {
  if (!raw) return seo.title;
  if (raw.includes(CODELAB_BRAND_NAME)) return raw;
  return `${raw} | ${CODELAB_BRAND_NAME}`;
}

export function buildSeo(input: SeoInput) {
  const pathname = input.pathname ?? "/";
  const canonical = absoluteUrl(pathname);
  const title = finalizeTitle(input.title);
  const description = input.description ?? seo.description;
  const ogImage = absoluteUrl(seo.ogImagePath);

  return {
    canonical,
    title,
    description,
    keywords: seoKeywords,
    ogImage,
    noindex: !!input.noindex,
    contact: {
      email: CODELAB_CONTACT_EMAIL,
      phone: CODELAB_CONTACT_PHONE,
    },
    socials: {
      facebook: CODELAB_FACEBOOK_URL,
      tiktok: CODELAB_TIKTOK_URL,
    },
  } as const;
}

