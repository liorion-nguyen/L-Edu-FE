import { useMemo, type ReactNode } from "react";
import {
  CODELAB_ADDRESS_TEXT,
  CODELAB_BRAND_NAME,
  CODELAB_CONTACT_EMAIL,
  CODELAB_CONTACT_PHONE,
  CODELAB_FACEBOOK_URL,
  CODELAB_IMG,
  CODELAB_TIKTOK_URL,
} from "../../../constants/codelabSite";
import { getIconByValue } from "../../../constants/icons";
import { useTheme } from "../../../contexts/ThemeContext";
import { useTranslationWithRerender } from "../../../hooks/useLanguageChange";

type Contact = {
  _id: string;
  type: string;
  label: string;
  value: string;
  icon?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
};

type ContentSection = {
  title: string;
  description: string;
  image?: string;
  buttonText?: string;
  buttonLink?: string;
  isActive?: boolean;
  _id?: string;
};

type Content = {
  _id: string;
  page: string;
  section: string;
  title: string;
  subtitle: string;
  descriptions: string[];
  sections: ContentSection[];
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
};

// Dữ liệu tĩnh (dùng response hiện tại, không call API)
const STATIC_CONTENT_BLOCKS: Content[] = [
  {
    _id: "68df72c68e9ff6d8db3bf2d5",
    page: "about",
    section: "intro",
    title: "Giới thiệu",
    subtitle: "Chào mừng đến với nền tảng học lập trình của chúng tôi! 🚀",
    descriptions: [
      "CodeLab là nền tảng đào tạo lập trình thực tế, tập trung giúp học viên không chỉ “hiểu” mà còn làm được.\nChúng tôi xây dựng lộ trình từ cơ bản đến nâng cao, phù hợp cho cả học sinh mới bắt đầu lẫn những bạn muốn phát triển sâu hơn trong lĩnh vực công nghệ.\n\nTại CodeLab, học viên được tiếp cận với:\n• Lộ trình rõ ràng, dễ hiểu\n• Bài tập thực hành liên tục\n• Dự án thực tế sau mỗi giai đoạn\n• Sự hỗ trợ sát sao từ người hướng dẫn\n\nMục tiêu của chúng tôi là giúp học viên từng bước xây dựng tư duy lập trình, sự tự tin và khả năng giải quyết vấn đề trong thực tế.",
      "Từ việc xây dựng website hiện đại đến phát triển ứng dụng với Python, CodeLab giúp việc học trở nên trực quan, dễ tiếp cận và có định hướng rõ ràng.\nHọc viên không chỉ học lý thuyết mà còn được thực hành liên tục để tạo ra sản phẩm thực tế của riêng mình. 👇",
    ],
    sections: [
      {
        title: "Khóa học của chúng tôi",
        description:
          "CodeLab cung cấp các chương trình học phù hợp với từng độ tuổi và trình độ khác nhau.\nNội dung được thiết kế theo hướng dễ tiếp cận, giúp học viên từng bước làm quen và phát triển kỹ năng lập trình một cách bài bản.\n\n👉 Học viên sẽ:\n• Làm dự án thực tế\n• Xây dựng sản phẩm cá nhân\n• Hiểu rõ cách hoạt động của ứng dụng",
        image: "https://res.cloudinary.com/dubmd1vq9/image/upload/v1759474465/1_3x_2dad764ee9_1759474465159.webp",
        buttonText: "Tìm hiểu thêm",
        buttonLink: "https://app.codelab.pro.vn/dashboard-program/courses",
        isActive: true,
        _id: "69d510f7dcc1a4995f61488e",
      },
      {
        title: "Giảng viên của chúng tôi",
        description:
          "Đội ngũ giảng viên tại CodeLab là những người có kinh nghiệm thực tế trong lĩnh vực công nghệ.\nKhông chỉ dạy kiến thức, họ còn chia sẻ cách tư duy, cách làm việc và kinh nghiệm thực tế trong ngành.\n\n👉 Điều học viên nhận được:\n• Hướng dẫn sát sao\n• Feedback trực tiếp\n• Định hướng phát triển lâu dài",
        image: "https://res.cloudinary.com/dubmd1vq9/image/upload/v1775537463/nqchung_1775537463262.png",
        buttonText: "Tìm hiểu thêm",
        buttonLink: "https://app.codelab.pro.vn/dashboard-program/courses",
        isActive: true,
        _id: "69d510f7dcc1a4995f61488f",
      },
    ],
    isActive: true,
    order: 1,
    createdAt: "2025-10-03T06:52:54.812Z",
    updatedAt: "2026-04-07T14:13:11.255Z",
  },
  {
    _id: "68df73048e9ff6d8db3bf2ee",
    page: "about",
    section: "reason",
    title: "Khơi dậy tiềm năng lập trình của bạn",
    subtitle: "Vì sao phụ huynh tin tưởng lựa chọn CodeLab cho con em mình",
    descriptions: [
      "Tại CodeLab, học viên được học theo mô hình nhóm nhỏ, giúp người hướng dẫn có thể theo sát từng bạn trong quá trình học. /n Mọi thắc mắc đều được giải đáp kịp thời, đảm bảo không ai bị “mất gốc” trong quá trình học.",
      "Chúng tôi tập trung vào việc giúp học viên hiểu – làm được – và tự tin phát triển tiếp, thay vì chỉ học lý thuyết. /nSau mỗi giai đoạn, học viên đều có sản phẩm cụ thể để nhìn thấy sự tiến bộ của mình. 💻✨",
    ],
    sections: [],
    isActive: true,
    order: 2,
    createdAt: "2025-10-03T06:53:56.239Z",
    updatedAt: "2026-04-07T13:54:56.585Z",
  },
];

const STATIC_CONTACTS: Contact[] = [
  {
    _id: "68df3d3ff9c042630fee39f3",
    type: "email",
    label: "Email",
    value: "contact@codelab.pro.vn",
    icon: "mail",
    isActive: true,
    order: 1,
    createdAt: "2025-10-03T03:04:31.982Z",
    updatedAt: "2026-04-07T04:35:05.338Z",
  },
  {
    _id: "68df3d60f9c042630fee3a07",
    type: "phone",
    label: "Phone",
    value: "+84 789108503",
    icon: "phone",
    isActive: true,
    order: 2,
    createdAt: "2025-10-03T03:05:04.452Z",
    updatedAt: "2026-04-07T04:35:18.632Z",
  },
  {
    _id: "68df3d80f9c042630fee3a0e",
    type: "address",
    label: "Address",
    value: "Thành phố Vinh, Nghệ An, Hà Nội",
    icon: "location",
    isActive: true,
    order: 3,
    createdAt: "2025-10-03T03:05:36.429Z",
    updatedAt: "2026-04-07T04:35:34.166Z",
  },
  {
    _id: "68df3da6f9c042630fee3a16",
    type: "social",
    label: "Facebook",
    value: "https://www.facebook.com/codelab.pro.vn",
    icon: "facebook",
    isActive: true,
    order: 4,
    createdAt: "2025-10-03T03:06:14.521Z",
    updatedAt: "2026-04-07T04:36:15.114Z",
  },
  {
    _id: "68df440bf9c042630fee3aec",
    type: "social",
    label: "Zalo",
    value: "+84 789108503",
    icon: "zalo",
    isActive: true,
    order: 5,
    createdAt: "2025-10-03T03:33:31.630Z",
    updatedAt: "2026-04-07T04:36:30.581Z",
  },
  {
    _id: "68df4440f9c042630fee3af4",
    type: "social",
    label: "Tiktok",
    value: "https://www.tiktok.com/@codelab.pro.vn",
    icon: "tiktok",
    isActive: true,
    order: 6,
    createdAt: "2025-10-03T03:34:24.889Z",
    updatedAt: "2026-04-07T04:51:42.738Z",
  },
];

const AboutUs = () => {
  const { t } = useTranslationWithRerender();
  const { isDark } = useTheme();
  const contacts = STATIC_CONTACTS;
  const contentBlocks = STATIC_CONTENT_BLOCKS;

  const normalizeLineBreaks = (value: unknown): string => {
    const text = typeof value === "string" ? value : value == null ? "" : String(value);
    return text.replaceAll("\\n", "\n").replaceAll("/n", "\n");
  };

  const toDescriptionArray = (value: unknown): string[] => {
    if (Array.isArray(value)) return value.map((v) => normalizeLineBreaks(v)).filter((v) => v.trim().length > 0);

    const text = normalizeLineBreaks(value);
    if (!text.trim()) return [];

    // Nếu backend trả về 1 chuỗi, coi đó là 1 item (không tự "xé" thành nhiều cards).
    return [text];
  };

  const toHeroDescriptionBlocks = (value: unknown): string[] => {
    const text = normalizeLineBreaks(value);
    if (!text.trim()) return [];

    // Hero cần nhiều "block" (desc[0], desc[1], desc[2]) → tách theo dòng trống.
    const lines = text.split("\n");
    const blocks: string[] = [];
    let buf: string[] = [];

    const flush = () => {
      const s = buf.join("\n").trim();
      if (s) blocks.push(s);
      buf = [];
    };

    for (const line of lines) {
      if (!line.trim()) {
        flush();
        continue;
      }
      buf.push(line);
    }
    flush();

    return blocks;
  };

  const renderDesc = (value: unknown): ReactNode => {
    const text = normalizeLineBreaks(value);
    const lines = text.split("\n");

    const nodes: ReactNode[] = [];
    let pendingList:
      | { kind: "ul"; items: string[] }
      | { kind: "ol"; items: string[] }
      | null = null;

    const flushList = () => {
      if (!pendingList) return;

      const key = `list-${nodes.length}`;
      if (pendingList.kind === "ul") {
        nodes.push(
          <ul key={key} className="mt-2 list-disc space-y-1 pl-5">
            {pendingList.items.map((it, idx) => (
              <li key={`${key}-li-${idx}`} className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {it}
              </li>
            ))}
          </ul>
        );
      } else {
        nodes.push(
          <ol key={key} className="mt-2 list-decimal space-y-1 pl-5">
            {pendingList.items.map((it, idx) => (
              <li key={`${key}-li-${idx}`} className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {it}
              </li>
            ))}
          </ol>
        );
      }

      pendingList = null;
    };

    for (let i = 0; i < lines.length; i++) {
      const rawLine = lines[i] ?? "";
      const line = rawLine.trimEnd();
      const trimmed = line.trim();

      if (!trimmed) {
        flushList();
        nodes.push(<br key={`br-${i}`} />);
        continue;
      }

      const ulMatch = trimmed.match(/^([-*•])\s+(.*)$/);
      const olMatch = trimmed.match(/^(\d+)[.)]\s+(.*)$/);

      if (ulMatch) {
        const itemText = ulMatch[2].trim();
        if (pendingList?.kind !== "ul") {
          flushList();
          pendingList = { kind: "ul", items: [] };
        }
        pendingList.items.push(itemText);
        continue;
      }

      if (olMatch) {
        const itemText = olMatch[2].trim();
        if (pendingList?.kind !== "ol") {
          flushList();
          pendingList = { kind: "ol", items: [] };
        }
        pendingList.items.push(itemText);
        continue;
      }

      flushList();
      nodes.push(
        <span key={`txt-${i}`} className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {line}
        </span>
      );
      nodes.push(<br key={`txt-br-${i}`} />);
    }

    flushList();

    return nodes;
  };

  const socials = useMemo(() => contacts.filter((c) => c.type === "social"), [contacts]);
  const socialLinks = useMemo(() => {
    if (socials.length) {
      return socials.map((s) => ({ label: s.label, value: s.value, icon: s.icon || "" }));
    }
    return [
      { label: "Facebook — CodeLab", value: CODELAB_FACEBOOK_URL, icon: "facebook" },
      { label: "TikTok — @codelab.pro.vn", value: CODELAB_TIKTOK_URL, icon: "tiktok" },
    ];
  }, [socials]);
  const email = useMemo(() => contacts.find((c) => c.type === "email"), [contacts]);
  const phone = useMemo(() => contacts.find((c) => c.type === "phone"), [contacts]);
  const address = useMemo(() => contacts.find((c) => c.type === "address"), [contacts]);
  const locationText = useMemo(() => address?.value || CODELAB_ADDRESS_TEXT, [address?.value]);
  const mapsOpenUrl = useMemo(
    () => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationText || "CodeLab")}`,
    [locationText]
  );
  const mapsOpenUrlFinal = useMemo(() => process.env.REACT_APP_MAPS_URL || mapsOpenUrl, [mapsOpenUrl]);
  // Nếu bạn có link embed Google Maps thì dán vào đây
  const mapsEmbedUrl = process.env.REACT_APP_MAPS_EMBED_URL || "";

  const softPanelBg = isDark ? "rgba(15, 23, 42, 0.35)" : "rgba(255, 255, 255, 0.7)";
  const softCardBg = isDark ? "rgba(15, 23, 42, 0.55)" : "rgba(255, 255, 255, 0.85)";
  const softHoverBg = isDark ? "rgba(148, 163, 184, 0.10)" : "rgba(15, 23, 42, 0.06)";
  const heroDesc0 = useMemo(() => contentBlocks?.[0]?.descriptions?.[0] || "", [contentBlocks]);
  const heroDesc1 = useMemo(() => contentBlocks?.[0]?.descriptions?.[1] || "", [contentBlocks]);

  const socialFacebook = useMemo(() => contacts.find((c) => c.type === "social" && c.icon === "facebook"), [contacts]);
  const socialZalo = useMemo(() => contacts.find((c) => c.type === "social" && c.icon === "zalo"), [contacts]);
  const socialTiktok = useMemo(() => contacts.find((c) => c.type === "social" && c.icon === "tiktok"), [contacts]);

  const toHref = (value?: string, kind?: "email" | "phone" | "url") => {
    if (!value) return "#";
    if (kind === "email") return `mailto:${value}`;
    if (kind === "phone") return `tel:${value}`;
    if (/^https?:\/\//i.test(value)) return value;
    return value;
  };

  return (
    <div className="font-display antialiased" style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}>
      {/* Hero (layout mới) */}
      <header className="relative overflow-hidden pb-20 pt-10">
        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-full w-full max-w-7xl -translate-x-1/2 opacity-25">
          <div className="absolute left-10 top-10 h-72 w-72 rounded-full bg-primary blur-[120px]" />
          <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full bg-purple-500 blur-[150px]" />
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-6 lg:grid-cols-2">
          <div className="space-y-8 h-full">
            <div
              className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-bold"
              style={{ borderColor: "rgba(35, 131, 226, 0.25)", background: "rgba(35, 131, 226, 0.10)", color: "var(--primary-color)" }}
            >
              <span className="material-symbols-outlined text-sm">rocket_launch</span>
              {t("about.title")}
            </div>

            <h1 className="text-4xl font-black leading-tight tracking-tight md:text-6xl" style={{ color: "var(--text-primary)" }}>
              {contentBlocks?.[0]?.title || `Giới thiệu ${CODELAB_BRAND_NAME}`}
            </h1>

            <div className="max-w-xl text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {heroDesc0
                ? renderDesc(heroDesc0)
                : `${CODELAB_BRAND_NAME} dạy lập trình thực chiến cho học sinh cấp 2–3 (khoảng 12–18 tuổi) tại TP. Vinh, Nghệ An: lớp nhỏ, mentor kèm, dự án thật và định hướng ôn thi khi phù hợp.`}
            </div>
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
              <div className="mt-6 overflow-hidden rounded-2xl" style={{ border: "1px solid var(--border-color)" }}>
                <img
                  src={CODELAB_IMG.classMain}
                  alt={`${CODELAB_BRAND_NAME} — Hoạt động tại lớp`}
                  className="h-auto w-full object-cover"
                />
              </div>
              <div className="mt-4 rounded-2xl p-5" style={{ background: "var(--bg-primary)", border: "1px solid var(--border-color)" }}>
                <div className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                  {contentBlocks?.[0]?.subtitle || "Lộ trình Python, web và ôn thi"}
                </div>
                <div className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                  {heroDesc1 ? renderDesc(heroDesc1) : "Từ làm quen logic và Python đến React, deployment và luyện thi HSG — học để làm được sản phẩm thật."}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Nội dung blocks */}
      <main className="mx-auto max-w-7xl px-6 pb-24">
        {contentBlocks.length === 0 ? (
          <div
            className="rounded-3xl border p-10 text-center"
            style={{ borderColor: "var(--border-color)", background: "var(--bg-primary)", color: "var(--text-secondary)" }}
          >
            <div className="text-2xl font-black" style={{ color: "var(--text-primary)" }}>
              Nội dung chi tiết đang cập nhật
            </div>
            <div className="mt-2">
              Thông tin đầy đủ về chương trình {CODELAB_BRAND_NAME} sẽ được hiển thị khi quản trị viên thêm khối nội dung trong hệ thống.
            </div>
          </div>
        ) : (
          <div className="space-y-16">
            <section className="space-y-10">
              {/* 2 cards section (không loop) */}
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {(() => {
                  const section0 = contentBlocks?.[0]?.sections?.[0];
                  if (!section0) return null;
                  return (
                    <article
                      className="group overflow-hidden rounded-3xl border shadow-sm transition-all hover:shadow-xl"
                      style={{ borderColor: "var(--border-color)", background: "var(--bg-primary)" }}
                    >
                      <div className="aspect-[16/10] overflow-hidden" style={{ background: "var(--bg-secondary)" }}>
                        {section0.image ? (
                          <img
                            alt={section0.title}
                            src={section0.image}
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
                          {section0.title}
                        </h3>
                        <div className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                          {renderDesc(section0.description)}
                        </div>

                        {section0.buttonText && section0.buttonLink && (
                          <a
                            href={section0.buttonLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-6 inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-black text-white shadow-lg transition-all"
                            style={{
                              background: "var(--primary-color)",
                              boxShadow: "0 16px 40px rgba(35, 131, 226, 0.25)",
                            }}
                          >
                            {section0.buttonText}
                            <span className="material-symbols-outlined text-sm">open_in_new</span>
                          </a>
                        )}
                      </div>
                    </article>
                  );
                })()}

                {(() => {
                  const section1 = contentBlocks?.[0]?.sections?.[1];
                  if (!section1) return null;
                  return (
                    <article
                      className="group overflow-hidden rounded-3xl border shadow-sm transition-all hover:shadow-xl"
                      style={{ borderColor: "var(--border-color)", background: "var(--bg-primary)" }}
                    >
                      <div className="aspect-[16/10] overflow-hidden" style={{ background: "var(--bg-secondary)" }}>
                        {section1.image ? (
                          <img
                            alt={section1.title}
                            src={section1.image}
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
                          {section1.title}
                        </h3>
                        <div className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                          {renderDesc(section1.description)}
                        </div>

                        {section1.buttonText && section1.buttonLink && (
                          <a
                            href={section1.buttonLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-6 inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-black text-white shadow-lg transition-all"
                            style={{
                              background: "var(--primary-color)",
                              boxShadow: "0 16px 40px rgba(35, 131, 226, 0.25)",
                            }}
                          >
                            {section1.buttonText}
                            <span className="material-symbols-outlined text-sm">open_in_new</span>
                          </a>
                        )}
                      </div>
                    </article>
                  );
                })()}
              </div>
            </section>

            <section className="space-y-10">
              <div className="space-y-3">
                <h2 className="text-3xl font-black md:text-4xl" style={{ color: "var(--text-primary)" }}>
                  {contentBlocks?.[1]?.title || "Khơi dậy tiềm năng lập trình của bạn"}
                </h2>
                {contentBlocks?.[1]?.subtitle && (
                  <p className="text-base" style={{ color: "var(--text-secondary)" }}>
                    {contentBlocks[1].subtitle}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl border p-5" style={{ borderColor: "var(--border-color)", background: "var(--bg-primary)" }}>
                  <div className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {renderDesc(contentBlocks?.[1]?.descriptions?.[0] || "")}
                  </div>
                </div>
                <div className="rounded-2xl border p-5" style={{ borderColor: "var(--border-color)", background: "var(--bg-primary)" }}>
                  <div className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {renderDesc(contentBlocks?.[1]?.descriptions?.[1] || "")}
                  </div>
                </div>
              </div>
            </section>
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

            <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
              {/* Cột trái: thông tin liên hệ */}
              <div className="md:col-span-5">
                <div
                  className="rounded-3xl border p-6"
                  style={{
                    borderColor: "var(--border-color)",
                    background: softCardBg,
                    boxShadow: isDark ? "0 24px 60px rgba(2, 6, 23, 0.35)" : "0 24px 60px rgba(2, 6, 23, 0.08)",
                  }}
                >
                  <div className="space-y-3">
                    {/* Email */}
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: softHoverBg }}>
                        <span className="material-symbols-outlined text-[20px]" style={{ color: "var(--primary-color)" }}>
                          mail
                        </span>
                      </div>
                      <a
                        href={toHref(email?.value || CODELAB_CONTACT_EMAIL, "email")}
                        className="min-w-0 truncate text-sm font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {email?.value || CODELAB_CONTACT_EMAIL}
                      </a>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: softHoverBg }}>
                        <span className="material-symbols-outlined text-[20px]" style={{ color: "var(--primary-color)" }}>
                          call
                        </span>
                      </div>
                      <a
                        href={toHref(phone?.value || CODELAB_CONTACT_PHONE, "phone")}
                        className="min-w-0 truncate text-sm font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {phone?.value || CODELAB_CONTACT_PHONE || "Hotline/Zalo — xem fanpage Facebook"}
                      </a>
                    </div>

                    {/* Address */}
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: softHoverBg }}>
                        <span className="material-symbols-outlined text-[20px]" style={{ color: "var(--primary-color)" }}>
                          location_on
                        </span>
                      </div>
                      <span className="min-w-0 truncate text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                        {locationText}
                      </span>
                    </div>

                    {/* Facebook */}
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: softHoverBg }}>
                        <span style={{ color: "var(--primary-color)" }}>
                          {(() => {
                            const Icon = getIconByValue("facebook")?.icon;
                            return Icon ? <Icon size={20} /> : null;
                          })()}
                        </span>
                      </div>
                      <a
                        href={toHref(socialFacebook?.value || CODELAB_FACEBOOK_URL, "url")}
                        target="_blank"
                        rel="noreferrer"
                        className="min-w-0 truncate text-sm font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {socialFacebook?.label || "Facebook"} — {CODELAB_BRAND_NAME}
                      </a>
                    </div>

                    {/* Zalo */}
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: softHoverBg }}>
                        <span style={{ color: "var(--primary-color)" }}>
                          {(() => {
                            const Icon = getIconByValue("zalo")?.icon;
                            return Icon ? <Icon size={20} /> : null;
                          })()}
                        </span>
                      </div>
                      <a
                        href={toHref(socialZalo?.value || phone?.value || CODELAB_CONTACT_PHONE, "phone")}
                        className="min-w-0 truncate text-sm font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {socialZalo?.label || "Zalo"} — {socialZalo?.value || phone?.value || CODELAB_CONTACT_PHONE}
                      </a>
                    </div>

                    {/* TikTok */}
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: softHoverBg }}>
                        <span style={{ color: "var(--primary-color)" }}>
                          {(() => {
                            const Icon = getIconByValue("tiktok")?.icon;
                            return Icon ? <Icon size={20} /> : null;
                          })()}
                        </span>
                      </div>
                      <a
                        href={toHref(socialTiktok?.value || CODELAB_TIKTOK_URL, "url")}
                        target="_blank"
                        rel="noreferrer"
                        className="min-w-0 truncate text-sm font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {socialTiktok?.label || "TikTok"}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cột phải: bản đồ */}
              <div className="flex w-full flex-col items-end gap-3 md:col-span-7">
                {/* <a
                  href={mapsOpenUrlFinal}
                  target="_blank"
                  rel="noreferrer"
                  className="whitespace-nowrap rounded-full bg-slate-400 px-5 py-2.5 text-sm font-extrabold text-ui-on-primary-fixed transition-colors hover:bg-ui-primary-fixed/90"
                >
                  Mở Google Maps <span aria-hidden>↗</span>
                </a> */}
                <div
                  className="w-full overflow-hidden rounded-2xl border shadow-sm"
                  style={{ borderColor: "var(--border-color)", background: "var(--bg-primary)" }}
                >
                  {mapsEmbedUrl ? (
                      <iframe
                        title={`Bản đồ — ${locationText}`}
                        src={mapsEmbedUrl}
                        className="h-[360px] w-full md:h-[420px]"
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                  ) : (
                    <div className="flex h-[360px] w-full flex-col items-center justify-center gap-3 px-6 text-center md:h-[420px]">
                      <span className="material-symbols-outlined text-4xl" style={{ color: "var(--primary-color)" }}>
                        map
                      </span>
                      <p className="max-w-md text-sm" style={{ color: "var(--text-secondary)" }}>
                        Chưa cấu hình embed bản đồ. Bạn có thể mở Google Maps để xem vị trí.
                      </p>
                      <a
                        href={mapsOpenUrlFinal}
                        target="_blank"
                        rel="noreferrer"
                        className="whitespace-nowrap rounded-full bg-ui-primary-fixed px-5 py-2.5 text-sm font-extrabold text-ui-on-primary-fixed transition-colors hover:bg-ui-primary-fixed/90"
                      >
                        Mở Google Maps <span aria-hidden>↗</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Social đã gộp vào box bên trái */}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutUs;