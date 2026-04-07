import {
  CODELAB_ADDRESS_TEXT,
  CODELAB_BRAND_NAME,
  CODELAB_CONTACT_EMAIL,
  CODELAB_CONTACT_PHONE,
  CODELAB_FACEBOOK_URL,
  CODELAB_SITE_URL,
  CODELAB_TIKTOK_URL,
} from "../constants/codelabSite";

export const seo = {
  /** Title mặc định cho app subdomain */
  title: `${CODELAB_BRAND_NAME} App — Hệ thống học tập`,
  /** Mô tả mặc định cho app subdomain */
  description:
    `${CODELAB_BRAND_NAME} (app.codelab.pro.vn) — hệ thống học tập và quản lý lớp học.` +
    ` Lập trình thực chiến cho học sinh tại ${CODELAB_ADDRESS_TEXT}.`,
  /** Ảnh OG mặc định (reuse icon) */
  ogImagePath: "/codelab/logo/logo_icon.png",
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

export function buildSeo(input: SeoInput) {
  const pathname = input.pathname ?? "/";
  const canonical = absoluteUrl(pathname);
  const title = input.title ? `${input.title} | ${CODELAB_BRAND_NAME}` : seo.title;
  const description = input.description ?? seo.description;
  const ogImage = absoluteUrl(seo.ogImagePath);

  return {
    canonical,
    title,
    description,
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

