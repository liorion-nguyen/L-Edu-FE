import { Spin } from "antd";
import { useEffect, useMemo, useState } from "react";
import { getIconByValue } from "../../../constants/icons";
import { useTheme } from "../../../contexts/ThemeContext";
import { useTranslationWithRerender } from "../../../hooks/useLanguageChange";
import { Contact, contactService } from "../../../services/contactService";
import { Content, contentService } from "../../../services/contentService";

const AboutUs = () => {
  const { t } = useTranslationWithRerender();
  const { isDark } = useTheme();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contentBlocks, setContentBlocks] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);

        const [contactsResponse, contentResponse] = await Promise.all([
          contactService.getContacts(),
          contentService.getContentByPage("about"),
        ]);

        if (!mounted) return;
        if (contactsResponse?.success) setContacts(contactsResponse.data || []);
        if (contentResponse?.statusCode === 200) setContentBlocks(contentResponse.data || []);
      } catch (error) {
        // keep silent for landing-like page
        console.error("Failed to fetch data:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const socials = useMemo(() => contacts.filter((c) => c.type === "social"), [contacts]);
  const email = useMemo(() => contacts.find((c) => c.type === "email"), [contacts]);
  const phone = useMemo(() => contacts.find((c) => c.type === "phone"), [contacts]);
  const address = useMemo(() => contacts.find((c) => c.type === "address"), [contacts]);

  const softPanelBg = isDark ? "rgba(15, 23, 42, 0.35)" : "rgba(255, 255, 255, 0.7)";
  const softCardBg = isDark ? "rgba(15, 23, 42, 0.55)" : "rgba(255, 255, 255, 0.85)";
  const softHoverBg = isDark ? "rgba(148, 163, 184, 0.10)" : "rgba(15, 23, 42, 0.06)";

  return (
    <div className="font-display antialiased" style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}>
      {/* Hero (layout mới) */}
      <header className="relative overflow-hidden pb-20 pt-10">
        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-full w-full max-w-7xl -translate-x-1/2 opacity-25">
          <div className="absolute left-10 top-10 h-72 w-72 rounded-full bg-primary blur-[120px]" />
          <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full bg-purple-500 blur-[150px]" />
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-6 lg:grid-cols-2">
          <div className="space-y-8">
            <div
              className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-bold"
              style={{ borderColor: "rgba(35, 131, 226, 0.25)", background: "rgba(35, 131, 226, 0.10)", color: "var(--primary-color)" }}
            >
              <span className="material-symbols-outlined text-sm">rocket_launch</span>
              {t("about.title")}
            </div>

            <h1 className="text-4xl font-black leading-tight tracking-tight md:text-6xl" style={{ color: "var(--text-primary)" }}>
              {contentBlocks?.[0]?.title || "Giới thiệu về chúng tôi"}
            </h1>

            <p className="max-w-xl text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {contentBlocks?.[0]?.descriptions?.[0] ||
                "Chúng tôi xây dựng nền tảng học lập trình thực chiến, giúp bạn tiến bộ nhanh và tự tin làm dự án thật."}
            </p>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-primary/30 blur-3xl opacity-40" />
            <div
              className="relative overflow-hidden rounded-3xl border p-6 shadow-2xl"
              style={{ borderColor: "var(--border-color)", background: "var(--bg-primary)" }}
            >
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-400" />
                <div className="h-2 w-2 rounded-full bg-amber-400" />
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
              </div>
              <div className="mt-6 rounded-2xl p-5" style={{ background: "var(--bg-primary)", border: "1px solid var(--border-color)" }}>
                <div className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                  {contentBlocks?.[0]?.subtitle || "Học lập trình theo lộ trình rõ ràng"}
                </div>
                <div className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                  {contentBlocks?.[0]?.descriptions?.[1] || "Từ nền tảng đến nâng cao, học để làm được việc."}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Nội dung blocks */}
      <main className="mx-auto max-w-7xl px-6 pb-24">
        {loading ? (
          <div className="flex justify-center py-16">
            <Spin size="large" />
          </div>
        ) : contentBlocks.length === 0 ? (
          <div
            className="rounded-3xl border p-10 text-center"
            style={{ borderColor: "var(--border-color)", background: "var(--bg-primary)", color: "var(--text-secondary)" }}
          >
            <div className="text-2xl font-black" style={{ color: "var(--text-primary)" }}>
              No content available
            </div>
            <div className="mt-2">Please add content blocks in the admin dashboard.</div>
          </div>
        ) : (
          <div className="space-y-16">
            {contentBlocks.map((block, blockIndex) => {
              const sections = (block.sections || []).filter((s: any) => s?.isActive);
              return (
                <section key={block._id} className="space-y-10">
                  <div className="space-y-3">
                    <h2 className="text-3xl font-black md:text-4xl" style={{ color: "var(--text-primary)" }}>
                      {blockIndex === 0 ? block.subtitle || "Tại sao chọn L-Edu?" : block.title}
                    </h2>
                    {block.subtitle && (
                      <p className="text-base" style={{ color: "var(--text-secondary)" }}>
                        {block.subtitle}
                      </p>
                    )}
                  </div>

                  {!!block.descriptions?.length && (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {block.descriptions.slice(0, 4).map((desc, idx) => (
                        <div
                          key={idx}
                          className="rounded-2xl border p-5"
                          style={{ borderColor: "var(--border-color)", background: "var(--bg-primary)" }}
                        >
                          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                            {desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {!!sections.length && (
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                      {sections.map((section: any, idx: number) => (
                        <article
                          key={`${section.title}-${idx}`}
                          className="group overflow-hidden rounded-3xl border shadow-sm transition-all hover:shadow-xl"
                          style={{ borderColor: "var(--border-color)", background: "var(--bg-primary)" }}
                        >
                          <div className="aspect-[16/10] overflow-hidden" style={{ background: "var(--bg-secondary)" }}>
                            {section.image ? (
                              <img
                                alt={section.title}
                                src={section.image}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center" style={{ color: "var(--text-tertiary)" }}>
                                No Image
                              </div>
                            )}
                          </div>

                          <div className="p-7">
                            <h3 className="text-2xl font-black" style={{ color: "var(--text-primary)" }}>
                              {section.title}
                            </h3>
                            <p className="mt-2 line-clamp-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                              {section.description}
                            </p>

                            {section.buttonText && section.buttonLink && (
                              <a
                                href={section.buttonLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-6 inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-black text-white shadow-lg transition-all"
                                style={{
                                  background: "var(--primary-color)",
                                  boxShadow: "0 16px 40px rgba(35, 131, 226, 0.25)",
                                }}
                              >
                                {section.buttonText}
                                <span className="material-symbols-outlined text-sm">open_in_new</span>
                              </a>
                            )}
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}

        {/* Contact */}
        <section className="mt-20">
          <div
            className="relative overflow-hidden rounded-[2.5rem] border p-10 md:p-14"
            style={{
              borderColor: "var(--border-color)",
              background: softPanelBg,
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
            }}
          >
            <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-purple-500/15 blur-3xl" />

            <div className="mb-10 space-y-3 text-center">
              <h2 className="text-3xl font-black md:text-4xl" style={{ color: "var(--text-primary)" }}>
                {t("about.contactUs")}
              </h2>
              <p className="mx-auto max-w-2xl" style={{ color: "var(--text-secondary)" }}>
                {t("about.haveQuestions")}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div
                className="rounded-3xl border p-6"
                style={{
                  borderColor: "var(--border-color)",
                  background: softCardBg,
                  boxShadow: isDark ? "0 24px 60px rgba(2, 6, 23, 0.35)" : "0 24px 60px rgba(2, 6, 23, 0.08)",
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: softHoverBg }}>
                    <span className="material-symbols-outlined" style={{ color: "var(--primary-color)" }}>
                      mail
                    </span>
                  </div>
                  <div className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                    Email
                  </div>
                </div>

                <a
                  className="mt-2 block text-sm"
                  style={{ color: "var(--primary-color)" }}
                  href={email?.value ? `mailto:${email.value}` : undefined}
                >
                  {email?.value || "support@l-edu.vn"}
                </a>
              </div>

              <div
                className="rounded-3xl border p-6"
                style={{
                  borderColor: "var(--border-color)",
                  background: softCardBg,
                  boxShadow: isDark ? "0 24px 60px rgba(2, 6, 23, 0.35)" : "0 24px 60px rgba(2, 6, 23, 0.08)",
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: softHoverBg }}>
                    <span className="material-symbols-outlined" style={{ color: "var(--primary-color)" }}>
                      call
                    </span>
                  </div>
                  <div className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                    {t("about.phone")}
                  </div>
                </div>
                <div className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                  {phone?.value || "0900 000 000"}
                </div>
              </div>

              <div
                className="rounded-3xl border p-6"
                style={{
                  borderColor: "var(--border-color)",
                  background: softCardBg,
                  boxShadow: isDark ? "0 24px 60px rgba(2, 6, 23, 0.35)" : "0 24px 60px rgba(2, 6, 23, 0.08)",
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: softHoverBg }}>
                    <span className="material-symbols-outlined" style={{ color: "var(--primary-color)" }}>
                      location_on
                    </span>
                  </div>
                  <div className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                    {t("about.address")}
                  </div>
                </div>
                <div className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                  {address?.value || "Việt Nam"}
                </div>
              </div>
            </div>

            {!!socials.length && (
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                {socials.map((s, idx) => {
                  const iconData = getIconByValue(s.icon || "");
                  const emoji = iconData?.emoji || "🔗";
                  return (
                    <a
                      key={`${s.label}-${idx}`}
                      href={s.value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition-colors"
                      style={{
                        borderColor: "var(--border-color)",
                        background: softCardBg,
                        color: "var(--text-primary)",
                      }}
                    >
                      <span>{emoji}</span>
                      <span className="max-w-[180px] truncate">{s.label}</span>
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutUs;