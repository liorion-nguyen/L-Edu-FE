import { Input } from "antd";
import { useField } from "formik";
import { COLORS, RADIUS, SPACING } from "../../constants/colors";

interface CustomInputProps {
  label?: string;
  name: string;
  type?: string;
  placeholder?: string;
}

const InputForm: React.FC<CustomInputProps> = ({ label, name, type = "text", placeholder }) => {
  const [field, meta] = useField(name);

  return (
    <div style={{ marginBottom: SPACING.md }}>
      {label && (
        <label style={styles.label}>
          {label}
        </label>
      )}
      <Input 
        {...field} 
        type={type} 
        placeholder={placeholder} 
        style={styles.input}
      />
      {meta.touched && meta.error && (
        <div style={styles.error}>{meta.error}</div>
      )}
    </div>
  );
};

const styles = {
  label: {
    display: "block",
    marginBottom: SPACING.xs,
    color: COLORS.text.primary,
    fontSize: "14px",
    fontWeight: 500,
  },
  input: {
    fontSize: "15px",
    background: COLORS.background.primary,
    border: `1px solid ${COLORS.border.light}`,
    borderRadius: RADIUS.md,
    color: COLORS.text.primary,
    padding: `${SPACING.sm} ${SPACING.md}`,
    height: "48px",
    transition: "all 0.2s ease",
    boxShadow: "none",
    outline: "none",
    "&:hover": {
      borderColor: COLORS.primary[300],
      boxShadow: `0 0 0 2px ${COLORS.primary[100]}`,
    },
    "&:focus": {
      borderColor: COLORS.primary[500],
      boxShadow: `0 0 0 3px ${COLORS.primary[100]}`,
    },
    "&:focus-visible": {
      borderColor: COLORS.primary[500],
      boxShadow: `0 0 0 3px ${COLORS.primary[100]}`,
    },
  },
  error: {
    color: COLORS.status.error,
    fontSize: "12px",
    marginTop: SPACING.xs,
  },
};

export default InputForm;