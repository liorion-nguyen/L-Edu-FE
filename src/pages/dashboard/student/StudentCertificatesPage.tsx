import React, { useMemo, useState } from "react";

type CertificateItem = {
  id: string;
  title: string;
  completedAt: string; // dd/mm/yyyy (display)
  premium?: boolean;
};

const CERTS_MOCK: CertificateItem[] = [
  { id: "cert-python-basic", title: "Chứng chỉ Python Cơ bản", completedAt: "15/10/2023", premium: true },
  { id: "cert-rn-advanced", title: "React Native Nâng cao", completedAt: "02/12/2023" },
  { id: "cert-java-web", title: "Lập trình Java Web", completedAt: "20/01/2024" },
  { id: "cert-uiux-master", title: "UI/UX Design Masterclass", completedAt: "11/03/2024", premium: true },
];

const StudentCertificatesPage: React.FC = () => {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return CERTS_MOCK;
    return CERTS_MOCK.filter((c) => c.title.toLowerCase().includes(query));
  }, [q]);

  return (
    <div className="text-slate-900 dark:text-slate-100 font-display">
      {/* Page header (match stitch content) */}
      <div className="flex items-center justify-between gap-4 flex-wrap mb-10">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold tracking-tight">Chứng chỉ của tôi</h2>
          <span className="px-2 py-0.5 rounded bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider">
            Đã xác thực
          </span>
        </div>

        <div className="relative w-full sm:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
            search
          </span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800/50 border-none focus:ring-2 focus:ring-primary rounded-lg text-sm transition-all outline-none"
            placeholder="Tìm kiếm chứng chỉ..."
            type="text"
          />
        </div>
      </div>

      {/* Welcome */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Chứng chỉ đã đạt được</h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            Chúc mừng bạn đã hoàn thành xuất sắc lộ trình đào tạo chuyên sâu.
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-slate-100 text-slate-100 dark:text-slate-900 font-bold rounded-xl hover:opacity-90 transition-opacity"
        >
          <span className="material-symbols-outlined text-xl">share</span>
          <span>Chia sẻ hồ sơ</span>
        </button>
      </div>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="group relative flex flex-col bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:border-primary/50 transition-all shadow-sm hover:shadow-xl"
          >
            <div className="aspect-[16/10] overflow-hidden relative">
              <div
                className="absolute inset-0 bg-primary/10 flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(0, 127, 255, 0.1) 0%, rgba(15, 25, 35, 0.4) 100%)",
                }}
              >
                <span className="material-symbols-outlined text-primary text-6xl opacity-50">verified_user</span>
              </div>
              {c.premium && (
                <div className="absolute top-4 right-4 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">
                  Premium
                </div>
              )}
            </div>

            <div className="p-6 flex flex-col gap-4">
              <div>
                <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">{c.title}</h3>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                  <span className="material-symbols-outlined text-base">calendar_today</span>
                  <span>Hoàn thành: {c.completedAt}</span>
                </div>
              </div>

              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 py-3 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg font-bold text-sm transition-all"
              >
                <span className="material-symbols-outlined text-xl">download</span>
                <span>Tải xuống PDF</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Ongoing Progress Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Chứng chỉ đang thực hiện</h2>
        <div className="bg-slate-50 dark:bg-slate-800/20 rounded-xl p-8 border border-dashed border-slate-300 dark:border-slate-700">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="size-20 rounded-full border-4 border-primary/20 border-t-primary flex items-center justify-center">
              <span className="text-xl font-black text-primary">75%</span>
            </div>
            <div className="flex-1 w-full">
              <h4 className="text-lg font-bold mb-1">Full-stack Web Development (Node.js &amp; Next.js)</h4>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
                Hoàn thành 12/16 modules. Dự kiến đạt chứng chỉ vào tháng sau.
              </p>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="w-3/4 h-full bg-primary rounded-full" />
              </div>
            </div>
            <button
              type="button"
              className="px-6 py-2 border-2 border-primary text-primary font-bold rounded-lg hover:bg-primary hover:text-white transition-all"
            >
              Tiếp tục học
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCertificatesPage;

