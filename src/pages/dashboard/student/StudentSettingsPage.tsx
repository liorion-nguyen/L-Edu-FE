import { Modal } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { showNotification } from "../../../components/common/Toaster";
import { localStorageConfig } from "../../../config";
import { ToasterType } from "../../../enum/toaster";
import { getUser, updateUser } from "../../../redux/slices/auth";
import type { RootState } from "../../../redux/store";
import { useDispatch, useSelector } from "../../../redux/store";
import type { UserType } from "../../../types/user";
import ChangePasswordModal from "../../home/profile/ChangePasswordModal";
import UpdateProfile from "../../home/profile/UpdateProfile";

type TabKey = "account" | "security" | "notifications";

const glassPanelClass =
  "rounded-xl p-6 border border-slate-200/70 dark:border-white/10 bg-white dark:bg-white/[0.03] backdrop-blur-xl";

const tabBase =
  "pb-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap";

const StudentSettingsPage: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((s: RootState) => s.auth);

  const [tab, setTab] = useState<TabKey>("account");
  const [twoFAEnabled, setTwoFAEnabled] = useState(true);
  const [emailNotiEnabled, setEmailNotiEnabled] = useState(true);
  const [pushNotiEnabled, setPushNotiEnabled] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  const avatarUrl = useMemo(() => user?.avatar || "", [user?.avatar]);
  const userEmail = user?.email || "";

  // Deep-link / hard refresh: token exists but redux user not hydrated yet.
  useEffect(() => {
    if (user?._id) return;
    const token = typeof window !== "undefined" ? localStorage.getItem(localStorageConfig.accessToken) : null;
    if (token) {
      void dispatch(getUser());
    }
  }, [dispatch, user?._id]);

  const handleUpdateProfile = async (
    updatedData: Partial<Omit<UserType, "_id" | "email" | "password" | "createdAt" | "updatedAt">>,
  ) => {
    if (!user?._id) return;
    await dispatch(updateUser({ id: user._id, data: updatedData })).unwrap();
  };

  return (
    <div className="student-settings-page w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
          Cài đặt tài khoản
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Quản lý thông tin cá nhân, bảo mật và tùy chọn thông báo của bạn.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 mb-8 gap-8 overflow-x-auto">
        <button
          type="button"
          onClick={() => setTab("account")}
          className={[
            tabBase,
            tab === "account"
              ? "border-primary text-primary"
              : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200",
          ].join(" ")}
        >
          Thiết lập tài khoản
        </button>
        <button
          type="button"
          onClick={() => setTab("security")}
          className={[
            tabBase,
            tab === "security"
              ? "border-primary text-primary"
              : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200",
          ].join(" ")}
        >
          Bảo mật
        </button>
        <button
          type="button"
          onClick={() => setTab("notifications")}
          className={[
            tabBase,
            tab === "notifications"
              ? "border-primary text-primary"
              : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200",
          ].join(" ")}
        >
          Thông báo
        </button>
      </div>

      <div className="grid gap-8">
        {/* Account */}
        {tab === "account" && (
          <section className={glassPanelClass}>
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary">person</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Thông tin tài khoản</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email hiện tại</label>
                <div className="w-full bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 p-3">
                  {userEmail || "—"}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Tên hiển thị</label>
                <div className="w-full bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 p-3">
                  {user?.fullName || "—"}
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden">
                  {avatarUrl ? (
                    <img alt="" src={avatarUrl} className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-primary">person</span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {user?.fullName || "Học viên"}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{userEmail || "—"}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary">badge</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Thông tin cá nhân</h3>
              </div>

              {user ? (
                <div className="student-settings-profile-form">
                  <UpdateProfile user={user} onSubmit={handleUpdateProfile} />
                </div>
              ) : (
                <p className="text-slate-600 dark:text-slate-400 text-sm">Đang tải thông tin người dùng...</p>
              )}
            </div>
          </section>
        )}

        {/* Security */}
        {tab === "security" && (
          <>
            <section className={glassPanelClass}>
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary">shield</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Bảo mật</h3>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/30 rounded-lg border border-slate-200 dark:border-slate-700/50">
                <div className="flex gap-4">
                  <div className="bg-primary/10 p-2 rounded-lg h-fit">
                    <span className="material-symbols-outlined text-primary">vibration</span>
                  </div>
                  <div>
                    <p className="text-slate-900 dark:text-slate-100 font-bold">Xác thực hai yếu tố (2FA)</p>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Thêm một lớp bảo mật cho tài khoản của bạn thông qua mã OTP.
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    className="sr-only peer"
                    type="checkbox"
                    checked={twoFAEnabled}
                    onChange={(e) => setTwoFAEnabled(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setChangePasswordOpen(true)}
                  className="bg-primary hover:bg-[#006fe6] text-white px-5 py-2.5 rounded-lg font-bold text-sm shadow-lg shadow-primary/20 transition-all"
                >
                  Đổi mật khẩu
                </button>
              </div>
            </section>

            {/* Danger zone */}
            <section className="border border-red-500/20 bg-red-500/5 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-red-500">warning</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Vùng nguy hiểm</h3>
              </div>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Xóa tài khoản vĩnh viễn và tất cả dữ liệu liên quan.
                </p>
                <button
                  type="button"
                  onClick={() => showNotification(ToasterType.info, "Account", "Chức năng xóa tài khoản sẽ bổ sung sau.")}
                  className="text-red-500 hover:bg-red-500/10 px-4 py-2 rounded-lg text-sm font-bold border border-red-500/20 transition-colors"
                >
                  Xóa tài khoản
                </button>
              </div>
            </section>
          </>
        )}

        {/* Notifications */}
        {tab === "notifications" && (
          <section className={glassPanelClass}>
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary">notifications_active</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Thông báo</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-800/50">
                <div>
                  <p className="text-slate-900 dark:text-slate-100 font-medium">Thông báo qua Email</p>
                  <p className="text-slate-600 dark:text-slate-400 text-xs">
                    Nhận cập nhật về các khóa học và sự kiện qua hòm thư.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    className="sr-only peer"
                    type="checkbox"
                    checked={emailNotiEnabled}
                    onChange={(e) => setEmailNotiEnabled(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-slate-900 dark:text-slate-100 font-medium">Thông báo đẩy (Push Notifications)</p>
                  <p className="text-slate-600 dark:text-slate-400 text-xs">
                    Hiển thị thông báo trên trình duyệt ngay lập tức.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    className="sr-only peer"
                    type="checkbox"
                    checked={pushNotiEnabled}
                    onChange={(e) => setPushNotiEnabled(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>
            </div>
          </section>
        )}
      </div>

      <Modal
        title={null}
        open={changePasswordOpen}
        onCancel={() => setChangePasswordOpen(false)}
        footer={null}
        width={560}
        centered
        destroyOnClose
      >
        <ChangePasswordModal onSuccess={() => setChangePasswordOpen(false)} />
      </Modal>
    </div>
  );
};

export default StudentSettingsPage;

