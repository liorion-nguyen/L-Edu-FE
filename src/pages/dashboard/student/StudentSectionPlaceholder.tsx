import React from "react";

/** Placeholder until student sub-pages are built */
const StudentSectionPlaceholder: React.FC<{ title: string }> = ({ title }) => (
  <div>
    <h2 className="text-2xl font-black" style={{ color: "var(--text-primary)" }}>
      {title}
    </h2>
    <p className="mt-2" style={{ color: "var(--text-secondary)" }}>
      Nội dung đang được cập nhật.
    </p>
  </div>
);

export default StudentSectionPlaceholder;
