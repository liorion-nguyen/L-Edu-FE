import { CodeOutlined, TeamOutlined } from "@ant-design/icons";
import React from "react";
import { CODELAB_BRAND_NAME } from "../constants/codelabSite";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <main className="min-h-screen bg-background-dark">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <section className="relative hidden min-h-screen overflow-hidden bg-[linear-gradient(135deg,#0f1923_0%,#1a2a3a_100%)] lg:flex flex-col items-center justify-center">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBLjYYF6vuxZc3Q2jQdrp5f8uwaDJNkM4chTe5VvGpg2XOvaXT-OVlVV0UicLeLFEkZxHiALjgL_E1_tr3CAzPaTM-7BDF03Cp6kk41fyHRH4CRzoakpoqYeamZgaSC1HjzcxppJ9WHbna7H0Iw1gOJXFhqI0tosJglID_Rx6MFXbdXDd-4n3m6-LT__noAOL0Yry56sqoJVipmfUmeoNKz1InW1uyWxZ2f__oZXr5LlkCXWdxAy1rwTltnszGYbSWzbyMU676oBIM")',
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(15,25,35,0.85),rgba(15,25,35,0.35),rgba(0,127,255,0.18))]" />

          <div className="relative z-10 mx-auto max-w-[560px] px-12 py-[72px]">
            <div className="mb-10">
              <div className="group relative inline-block w-full max-w-[min(100%,320px)] animate-codelab-logo-float">
                <div
                  className="pointer-events-none absolute -inset-3 rounded-2xl bg-primary/25 blur-xl animate-codelab-logo-glow"
                  aria-hidden
                />
                <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/[0.97] px-5 py-3.5 shadow-[0_8px_40px_-8px_rgba(0,127,255,0.45)] ring-1 ring-white/20 transition duration-300 ease-out group-hover:scale-[1.02] group-hover:border-primary/30 group-hover:shadow-[0_12px_48px_-10px_rgba(0,127,255,0.55)]">
                  <div
                    className="pointer-events-none absolute -left-1/2 top-0 h-full w-1/2 skew-x-12 bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-0 transition duration-700 ease-out group-hover:translate-x-[220%] group-hover:opacity-90"
                    aria-hidden
                  />
                  <img
                    src="/codelab/logo/logo_row.png"
                    className="relative z-[1] h-10 w-full max-h-11 object-contain object-left md:h-11"
                    alt={CODELAB_BRAND_NAME}
                  />
                </div>
              </div>
            </div>

            <div className="mb-10">
              <h1 className="mb-3 text-[52px] font-extrabold leading-[1.2] text-white">
                Nâng tầm kỹ năng
                <br />
                <span className="text-primary">Lập trình</span> của bạn
              </h1>
              <p className="m-0 text-lg leading-[1.6] text-slate-400">
                Gia nhập cộng đồng hơn 50,000 học viên đang học tập và phát triển sự nghiệp công nghệ mỗi ngày.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2 rounded-[14px] border border-white/10 bg-[rgba(27,33,40,0.7)] p-4 backdrop-blur-[12px]">
                <CodeOutlined className="text-xl text-primary" />
                <span className="font-semibold text-white">200+ Khóa học</span>
              </div>
              <div className="flex flex-col gap-2 rounded-[14px] border border-white/10 bg-[rgba(27,33,40,0.7)] p-4 backdrop-blur-[12px]">
                <TeamOutlined className="text-xl text-primary" />
                <span className="font-semibold text-white">Cộng đồng hỗ trợ</span>
              </div>
            </div>
          </div>
        </section>

        <section className="flex min-h-screen w-full flex-col items-center justify-center bg-background-dark px-6 py-12 sm:px-12 lg:px-24">
          <div className="w-full max-w-[440px]">
            <div className="mb-8 flex items-center gap-2 lg:hidden">
              <img
                src="/codelab/logo/logo_icon.png"
                className="h-9 w-9 object-contain"
                alt={CODELAB_BRAND_NAME}
              />
              <h2 className="text-xl font-bold text-white">{CODELAB_BRAND_NAME}</h2>
            </div>
            {children}
          </div>
          <div className="mt-auto pt-8 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} {CODELAB_BRAND_NAME}. Bảo lưu mọi quyền.
          </div>
        </section>
      </div>
    </main>
  );
};

export default AuthLayout;