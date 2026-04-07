import { CODELAB_BRAND_NAME } from "../../constants/codelabSite";
import { absoluteUrl, seo, siteOrigin } from "../../lib/seo";
import { CODELAB_FACEBOOK_URL, CODELAB_TIKTOK_URL } from "../../constants/codelabSite";

function digitsOnly(s: string): string {
  return s.replace(/\D/g, "");
}

function telephoneE164(v: string): string | undefined {
  const d = digitsOnly(v);
  if (!d) return undefined;
  if (d.startsWith("84")) return `+${d}`;
  if (d.startsWith("0")) return `+84${d.slice(1)}`;
  return `+${d}`;
}

export function SeoJsonLd(props: { phone?: string; email?: string }) {
  const base = siteOrigin();
  const logoUrl = absoluteUrl("/codelab/logo/logo_col.png");
  const sameAs = [CODELAB_FACEBOOK_URL, CODELAB_TIKTOK_URL].filter(Boolean);
  const tel = props.phone ? telephoneE164(props.phone) : undefined;

  const graph: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["EducationalOrganization", "LocalBusiness"],
        "@id": `${base}/#organization`,
        name: CODELAB_BRAND_NAME,
        alternateName: [`${CODELAB_BRAND_NAME} Vinh`, `${CODELAB_BRAND_NAME} Nghệ An`, "codelab.pro.vn"],
        description: seo.description,
        url: base,
        logo: { "@type": "ImageObject", url: logoUrl },
        image: logoUrl,
        email: props.email || undefined,
        telephone: tel,
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Vinh",
          addressRegion: "Nghệ An",
          addressCountry: "VN",
        },
        areaServed: {
          "@type": "City",
          name: "Vinh",
          containedInPlace: { "@type": "AdministrativeArea", name: "Nghệ An" },
        },
        sameAs,
      },
      {
        "@type": "WebSite",
        "@id": `${base}/#website`,
        url: base,
        name: `${CODELAB_BRAND_NAME} App`,
        description: seo.description,
        publisher: { "@id": `${base}/#organization` },
        inLanguage: "vi-VN",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

