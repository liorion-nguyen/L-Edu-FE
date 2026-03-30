import React from "react";
import { Modal } from "antd";
import Login from "../../pages/auth/Login";

type Props = {
  open: boolean;
  onSuccess: () => void;
};

const DashboardLoginModal: React.FC<Props> = ({ open, onSuccess }) => {
  return (
    <Modal
      open={open}
      centered
      footer={null}
      closable={false}
      maskClosable={false}
      width={520}
      className="dashboard-login-modal"
    >
      {/* Reuse full login (incl. Google/Facebook methods). Keep user on current dashboard URL. */}
      <div className="rounded-2xl bg-background-dark border border-[#25364d] p-6">
        <Login redirectTo={null} onLoginSuccess={onSuccess} />
      </div>
    </Modal>
  );
};

export default DashboardLoginModal;

