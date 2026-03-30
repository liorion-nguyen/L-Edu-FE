import React, { useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import courseRegistrationService, { CreateRegistrationData } from "../../services/courseRegistrationService";

interface CourseRegistrationModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  courseId: string;
  courseTitle: string;
  isLocked?: boolean;
  isRejected?: boolean;
}

const CourseRegistrationModal: React.FC<CourseRegistrationModalProps> = ({
  visible,
  onCancel,
  onSuccess,
  courseId,
  courseTitle,
  isLocked = false,
  isRejected = false,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: { message?: string }) => {
    try {
      setLoading(true);

      const registrationData: CreateRegistrationData = {
        courseId,
        message: values.message,
      };

      await courseRegistrationService.createRegistration(registrationData);

      const successMessage = isLocked
        ? "Đơn đăng ký khóa học đã được gửi thành công! Khóa học này đang bị khóa, admin sẽ xem xét và phản hồi sớm nhất."
        : isRejected
          ? "Đơn đăng ký khóa học mới đã được gửi thành công! Admin sẽ xem xét lại đơn đăng ký của bạn."
          : "Đơn đăng ký khóa học đã được gửi thành công! Admin sẽ xem xét và phản hồi sớm nhất.";

      message.success(successMessage);
      form.resetFields();
      onSuccess();
      onCancel();
    } catch (error: unknown) {
      console.error("Registration error:", error);
      const err = error as { response?: { data?: { message?: string } } };
      const errorMessage = err.response?.data?.message || "Có lỗi xảy ra khi gửi đơn đăng ký";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const alertBoxClass = isLocked
    ? "rounded-xl border border-amber-200/90 dark:border-amber-500/35 bg-amber-50/95 dark:bg-amber-950/30 text-amber-950 dark:text-amber-100/95"
    : isRejected
      ? "rounded-xl border border-rose-200/90 dark:border-rose-500/35 bg-rose-50/95 dark:bg-rose-950/25 text-rose-900 dark:text-rose-100/95"
      : "rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white/80 dark:bg-slate-800/40 backdrop-blur-sm text-slate-800 dark:text-slate-100";

  const noteBoxClass = isLocked
    ? "rounded-xl border border-amber-200/90 dark:border-amber-500/30 bg-amber-50/90 dark:bg-amber-950/25 text-sm text-amber-900/95 dark:text-amber-100/90 leading-relaxed"
    : "rounded-xl border border-primary/25 dark:border-primary/35 bg-primary/[0.06] dark:bg-primary/10 text-sm text-slate-600 dark:text-slate-300 leading-relaxed";

  return (
    <Modal
      title={
        <div className="flex items-center gap-3 pr-6">
          <span className="material-symbols-outlined text-primary text-[26px] shrink-0">person_add</span>
          <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Đăng ký khóa học</span>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={520}
      destroyOnClose
      centered
      classNames={{
        content: "!rounded-2xl !overflow-hidden !p-0 !shadow-2xl !shadow-slate-900/15 dark:!shadow-black/40",
        header: "!mb-0 !px-6 !pt-5 !pb-4 !border-b !border-slate-200 dark:!border-slate-700/80 !bg-white dark:!bg-[#0f1923]",
        body: "!px-6 !py-5 !bg-slate-50 dark:!bg-[#0b1219]",
        mask: "!bg-slate-900/55 backdrop-blur-[2px]",
      }}
    >
      <div className={`mb-5 p-4 ${alertBoxClass}`}>
        <p className="font-semibold text-[15px] m-0 text-inherit">
          <span className="text-slate-600 dark:text-slate-400 font-medium">Khóa học: </span>
          <span className="text-slate-900 dark:text-white">{courseTitle}</span>
        </p>
        {isLocked && (
          <div className="mt-3 flex items-start gap-2 text-sm font-medium text-amber-800 dark:text-amber-200/95">
            <span className="material-symbols-outlined text-lg shrink-0 text-amber-600 dark:text-amber-400">warning</span>
            <span>Khóa học này đang bị khóa, cần admin duyệt</span>
          </div>
        )}
        {isRejected && (
          <div className="mt-3 flex items-start gap-2 text-sm font-medium text-rose-800 dark:text-rose-200/95">
            <span className="material-symbols-outlined text-lg shrink-0 text-rose-600 dark:text-rose-400">cancel</span>
            <span>Đơn đăng ký trước đã bị từ chối, bạn có thể đăng ký lại</span>
          </div>
        )}
      </div>

      <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
        <Form.Item
          name="message"
          label={<span className="text-slate-700 dark:text-slate-300 font-medium">Lời nhắn (tùy chọn)</span>}
          rules={[
            {
              max: 500,
              message: "Lời nhắn không được quá 500 ký tự",
            },
          ]}
        >
          <Input.TextArea
            rows={4}
            placeholder={
              isLocked
                ? "Hãy chia sẻ lý do bạn muốn tham gia khóa học này, kinh nghiệm hiện tại của bạn, hoặc bất kỳ thông tin nào khác để admin có thể đánh giá và duyệt đơn đăng ký của bạn..."
                : isRejected
                  ? "Đơn đăng ký trước của bạn đã bị từ chối. Hãy chia sẻ thêm thông tin, kinh nghiệm mới, hoặc lý do tại sao bạn nghĩ mình phù hợp với khóa học này..."
                  : "Hãy chia sẻ lý do bạn muốn tham gia khóa học này, kinh nghiệm hiện tại của bạn, hoặc bất kỳ thông tin nào khác mà bạn muốn admin biết..."
            }
            showCount
            maxLength={500}
            className="!rounded-xl !text-[15px] !border-slate-200 dark:!border-slate-600 !bg-white dark:!bg-slate-900/60 !text-slate-900 dark:!text-slate-100 placeholder:!text-slate-400 dark:placeholder:!text-slate-500 focus:!border-primary focus:!shadow-[0_0_0_2px_rgba(0,127,255,0.15)]"
          />
        </Form.Item>

        <Form.Item className="!mb-0">
          <div className="flex flex-wrap justify-end gap-3">
            <Button
              onClick={handleCancel}
              size="large"
              className="!h-11 !min-w-[100px] !rounded-xl !font-semibold !border-slate-200 dark:!border-slate-600 !bg-white dark:!bg-slate-800 !text-slate-700 dark:!text-slate-200 hover:!border-primary hover:!text-primary dark:hover:!border-primary"
            >
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              className="!h-11 !min-w-[180px] !rounded-xl !font-semibold !bg-primary !border-primary !shadow-md !shadow-primary/25 hover:!bg-[#006fe6] hover:!border-[#006fe6] hover:!shadow-lg hover:!shadow-primary/30 !inline-flex !items-center !justify-center !gap-2"
              icon={<span className="material-symbols-outlined text-[18px] leading-none">send</span>}
            >
              Gửi đơn đăng ký
            </Button>
          </div>
        </Form.Item>
      </Form>

      <div className={`mt-5 p-4 ${noteBoxClass}`}>
        <p className="m-0">
          <span className="font-semibold text-slate-800 dark:text-slate-200">Lưu ý: </span>
          {isLocked
            ? "Đơn đăng ký của bạn sẽ được gửi đến admin để xem xét. Khóa học này đang bị khóa nên cần admin duyệt trước khi bạn có thể tham gia. Bạn sẽ nhận được thông báo khi đơn đăng ký được duyệt hoặc từ chối."
            : "Đơn đăng ký của bạn sẽ được gửi đến admin để xem xét. Bạn sẽ nhận được thông báo khi đơn đăng ký được duyệt hoặc từ chối."}
        </p>
      </div>
    </Modal>
  );
};

export default CourseRegistrationModal;
