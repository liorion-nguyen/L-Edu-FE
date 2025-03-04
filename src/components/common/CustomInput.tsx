import { Input } from "antd";
import { useField } from "formik";

interface CustomInputProps {
  label?: string;
  name: string;
  type?: string;
  placeholder?: string;
}

const InputForm: React.FC<CustomInputProps> = ({ label, name, type = "text", placeholder }) => {
  const [field, meta] = useField(name);

  return (
    <div style={{ marginBottom: "16px" }}>
      <Input {...field} type={type} placeholder={placeholder} style={{ fontSize: "15px" }} />
      {meta.touched && meta.error && (
        <div style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>{meta.error}</div>
      )}
    </div>
  );
};

export default InputForm;