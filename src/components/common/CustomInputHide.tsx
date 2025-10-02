import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Input } from "antd";
import { useField } from "formik";
import { RADIUS, SPACING } from "../../constants/colors";
import { CSSProperties } from "react";

interface CustomInputProps {
    label?: string;
    name: string;
    type?: string;
    placeholder?: string;
}

const InputFormHide: React.FC<CustomInputProps> = ({ label, name, type = "text", placeholder }) => {
    const [field, meta] = useField(name);

    return (
        <div style={{ marginBottom: SPACING.md }}>
            {label && (
                <label style={styles.label}>
                    {label}
                </label>
            )}
            <Input.Password
                placeholder={placeholder}
                {...field}
                type={type}
                style={styles.input}
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
            {meta.touched && meta.error && (
                <div style={styles.error}>{meta.error}</div>
            )}
        </div>
    );
};

const styles: { 
  label: CSSProperties;
  input: CSSProperties;
  error: CSSProperties;
} = {
    label: {
        display: "block",
        marginBottom: SPACING.xs,
        color: "var(--text-primary)",
        fontSize: "14px",
        fontWeight: 500,
    },
    input: {
        fontSize: "15px",
        background: "var(--bg-primary)",
        border: "1px solid var(--border-color)",
        borderRadius: RADIUS.md,
        color: "var(--text-primary)",
        padding: `${SPACING.sm} ${SPACING.md}`,
        height: "48px",
        transition: "all 0.2s ease",
        boxShadow: "none",
        outline: "none",
    },
    error: {
        color: "var(--error-color)",
        fontSize: "12px",
        marginTop: SPACING.xs,
    },
};

export default InputFormHide;