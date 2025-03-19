import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Input } from "antd";
import { useField } from "formik";

interface CustomInputProps {
    label?: string;
    name: string;
    type?: string;
    placeholder?: string;
}

const InputFormHide: React.FC<CustomInputProps> = ({ label, name, type = "text", placeholder }) => {
    const [field, meta] = useField(name);

    return (
        <div style={{ marginBottom: "16px" }}>
            <Input.Password
                placeholder={placeholder}
                {...field}
                type={type}
                style={{ fontSize: "15px", background: "rgba(78, 205, 196, 0.05)", // Teal undertone for glassmorphism
                    border: "1px solid rgba(78, 205, 196, 0.2)", // Teal border
                    color: "#B0E0E6", // Pale teal for text
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5), 0 0 10px rgba(78, 205, 196, 0.2)", // Teal glow
                     }}
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
            {meta.touched && meta.error && (
                <div style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>{meta.error}</div>
            )}
        </div>
    );
};

export default InputFormHide;