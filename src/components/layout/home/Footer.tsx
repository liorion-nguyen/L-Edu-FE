import { LinkOutlined } from "@ant-design/icons";
import { Layout, Spin } from "antd";
import { CSSProperties, useEffect, useMemo, useState } from "react";
import { getIconByValue } from "../../../constants/icons";
import { useTheme } from "../../../contexts/ThemeContext";
import { useTranslationWithRerender } from "../../../hooks/useLanguageChange";
import { Contact, contactService } from "../../../services/contactService";
import { footerService, Footer as FooterType } from "../../../services/footerService";
import { LinkedApp, linkedAppService } from "../../../services/linkedAppService";

const Footer = () => {
  const { t } = useTranslationWithRerender();
  useTheme();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [footers, setFooters] = useState<FooterType[]>([]);
  const [linkedApps, setLinkedApps] = useState<LinkedApp[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [contactsResponse, footersResponse, linkedAppsResponse] = await Promise.all([
          contactService.getContacts(),
          footerService.getFooters(),
          linkedAppService.getLinkedApps().catch(() => ({ success: false, data: [] }))
        ]);
        
        if (contactsResponse.success) {
          setContacts(contactsResponse.data);
        }
        
        if (footersResponse.success) {
          setFooters(footersResponse.data);
        }

        if (linkedAppsResponse.success) {
          setLinkedApps(linkedAppsResponse.data);
        }
      } catch (error) {
        console.error('Failed to fetch footer data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fallback data if API fails
  const fallbackContacts = useMemo(() => ([
    { name: "Location", value: "Cau Giay, Ha Noi, Viet Nam", icon: "/images/icons/contacts/location.png" },
    { name: "Email", value: "liorion.nguyen@gmail.com", icon: "/images/icons/contacts/email.png" },
    { name: "Phone", value: "(+84) 708-200-334", icon: "/images/icons/contacts/phone.png" },
  ]), []);

  const fallbackSocials = useMemo(() => ([
    { name: "Facebook", icon: "/images/icons/socials/ft_facebook.png", link: "#" },
    { name: "Twitter", icon: "/images/icons/socials/ft_twitter.png", link: "#" },
    { name: "Pinterest", icon: "/images/icons/socials/ft_pinterest.png", link: "#" },
    { name: "Linkedin", icon: "/images/icons/socials/ft_linkedin.png", link: "#" },
  ]), []);

  const fallbackCompanyLinks = [t('footer.courses'), t('footer.features'), t('footer.design')];
  const fallbackCourseLinks = [t('footer.language'), t('footer.marketing'), t('footer.testimonial'), t('footer.developer')];

  const socials = useMemo(() => {
    const socialContacts = contacts.filter((c) => c.type === "social");
    if (socialContacts.length > 0) {
      return socialContacts.map((c) => ({ label: c.label || "Social", url: c.value, icon: c.icon }));
    }
    return fallbackSocials.map((s) => ({ label: s.name, url: s.link, icon: s.icon }));
  }, [contacts, fallbackSocials]);

  const contactItems = useMemo(() => {
    const items = contacts.filter((c) => ["email", "phone", "address"].includes(c.type));
    const base: any[] = items.length > 0 ? items : (fallbackContacts as any[]);
    return base.map((c) => ({ type: c.type, value: c.value }));
  }, [contacts, fallbackContacts]);

  return (
    <Layout.Footer style={styles.footer}>
      <footer className="bg-white dark:bg-slate-900 pt-24 pb-12 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="text-center py-10">
              <Spin size="large" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <img src="/logo_name.png" alt="L-Edu" className="h-12"  />
                  </div>

                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{t("footer.description")}</p>

                  <div className="flex gap-4">
                    {socials.map((s, index) => {
                      const iconData = getIconByValue(s.icon || "");
                      return (
                        <a
                          key={index}
                          className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={s.label}
                        >
                          {iconData ? (
                            <span style={{ fontSize: 18 }}>{iconData.emoji}</span>
                          ) : (
                            <span className="material-symbols-outlined text-lg">alternate_email</span>
                          )}
                        </a>
                      );
                    })}
                  </div>
                </div>

                {footers.length > 0 &&
                  footers.slice(0, 2).map((footer) => (
                    <div key={footer._id}>
                      <h4 className="font-bold mb-6 dark:text-white">{footer.title}</h4>
                      <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
                        {footer.links.map((link, i) => (
                          <li key={i}>
                            <a
                              className="hover:text-primary transition-colors"
                              href={link.url}
                              {...(link.isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                            >
                              {link.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                {footers.length === 0 && (
                  <>
                    <div>
                      <h4 className="font-bold mb-6 dark:text-white">{t("footer.company")}</h4>
                      <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
                        {fallbackCompanyLinks.map((label, i) => (
                          <li key={i}>
                            <span className="hover:text-primary transition-colors">{label}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold mb-6 dark:text-white">{t("footer.course")}</h4>
                      <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
                        {fallbackCourseLinks.map((label, i) => (
                          <li key={i}>
                            <span className="hover:text-primary transition-colors">{label}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}

                <div>
                  <h4 className="font-bold mb-6 dark:text-white">{t("footer.contactInfo")}</h4>
                  <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
                    {contactItems.map((c, i) => {
                      const icon =
                        c.type === "email" ? "mail" : c.type === "phone" ? "phone_iphone" : "location_on";
                      return (
                        <li key={i} className="flex items-start gap-3">
                          <span className="material-symbols-outlined text-primary text-sm mt-0.5">{icon}</span>
                          {c.value}
                        </li>
                      );
                    })}

                    {linkedApps.length > 0 && (
                      <li className="pt-2">
                        <div className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200">
                          <LinkOutlined />
                          Ứng dụng liên kết
                        </div>
                        <ul className="mt-3 space-y-3">
                          {linkedApps.slice(0, 3).map((app) => (
                            <li key={app._id}>
                              <a
                                className="hover:text-primary transition-colors"
                                href={app.url}
                                {...(app.openInNewTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                              >
                                {app.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="pt-12 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-slate-500">
                <p>© {new Date().getFullYear()} L-Edu Academy. All rights reserved.</p>
                <div className="flex gap-8">
                  <a className="hover:text-primary transition-colors" href="/privacy">Chính sách bảo mật</a>
                  <a className="hover:text-primary transition-colors" href="/sitemap">Sitemap</a>
                </div>
              </div>
            </>
          )}
        </div>
      </footer>
    </Layout.Footer>
  );
};

export default Footer;

const styles: {
  footer: CSSProperties;
} = {
  footer: {
    padding: 0,
    background: "transparent",
  },
};