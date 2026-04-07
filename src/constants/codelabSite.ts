/**
 * Nội dung thương hiệu CodeLab — đồng bộ với Docs/ChangeContactWebsite.md.
 * Số điện thoại / email / link có thể ghi đè qua biến môi trường REACT_APP_*.
 */

export const CODELAB_BRAND_NAME = "CodeLab";

export const CODELAB_SITE_URL =
  process.env.REACT_APP_SITE_URL?.replace(/\/$/, "") || "https://app.codelab.pro.vn";

/** Form đăng ký tư vấn trên site marketing (www + hash) */
export const CODELAB_SIGNUP_URL =
  process.env.REACT_APP_CODELAB_SIGNUP_URL || "https://www.codelab.pro.vn/#dang-ky";

export const CODELAB_CONTACT_PHONE =
  process.env.REACT_APP_CONTACT_PHONE || "";

export const CODELAB_CONTACT_EMAIL =
  process.env.REACT_APP_CONTACT_EMAIL || "contact@codelab.pro.vn";

export const CODELAB_ADDRESS_TEXT = "TP. Vinh, Nghệ An";

export const CODELAB_MAPS_URL =
  process.env.REACT_APP_MAPS_URL ||
  "https://www.google.com/maps/search/?api=1&query=TP.+Vinh%2C+Ngh%E1%BB%87+An";

export const CODELAB_FACEBOOK_URL =
  process.env.REACT_APP_FACEBOOK_URL || "https://www.facebook.com/codelab.pro.vn/";

export const CODELAB_TIKTOK_URL =
  process.env.REACT_APP_TIKTOK_URL || "https://www.tiktok.com/@codelab.pro.vn";

/** Ảnh tĩnh từ public/codelab (copied từ Docs/images) */
export const CODELAB_IMG = {
  logoRow: "/codelab/logo/logo_row.png",
  logoCol: "/codelab/logo/logo_col.png",
  logoIcon: "/codelab/logo/logo_icon.png",
  classMain: "/codelab/class/class_main.png",
  classGroup: "/codelab/class/class_group.png",
  classMentor: "/codelab/class/class_mentor.png",
  classWide: "/codelab/class/class_wide.png",
  mentorChung: "/codelab/mentor/nqchung.png",
  mentorDuy: "/codelab/mentor/nvduy.png",
  mentorMinh: "/codelab/mentor/plminh.png",
  studentPhuMinh: "/codelab/student/phminh.png",
  studentLeManh: "/codelab/student/lmanh.png",
  studentNgocPhuong: "/codelab/student/nhphuong.png",
  studentQuangVinh: "/codelab/student/nqvinh.png",
  resultPortfolio: "/codelab/result/portfolio.png",
  resultAppWeb: "/codelab/result/app_web.png",
  resultMindset: "/codelab/result/mindset.png",
} as const;
