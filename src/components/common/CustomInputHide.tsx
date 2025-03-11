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
                style={{ fontSize: "15px" }}
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
            {meta.touched && meta.error && (
                <div style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>{meta.error}</div>
            )}
        </div>
    );
};

export default InputFormHide;