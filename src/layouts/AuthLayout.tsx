import { CodeOutlined, TeamOutlined } from "@ant-design/icons";
import React from "react";

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
            <div className="mb-8 flex items-center gap-3">
              <img src="/logo.png" className="h-[42px] w-[42px] rounded-[10px] object-contain" alt="logo" />
              <h2 className="m-0 text-3xl font-bold tracking-tight text-white">L Edu Academy</h2>
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
              <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-white">
                <CodeOutlined className="text-base" />
              </div>
              <h2 className="text-xl font-bold text-white">IT Academy</h2>
            </div>
            {children}
          </div>
          <div className="mt-auto pt-8 text-center text-xs text-slate-500">
            © 2024 IT Academy. Bảo lưu mọi quyền.
          </div>
        </section>
      </div>
    </main>
  );
};

export default AuthLayout;