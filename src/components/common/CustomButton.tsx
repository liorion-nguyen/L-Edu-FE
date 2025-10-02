import { Button } from "antd";
import { RADIUS, SPACING } from "../../constants/colors";
import { CSSProperties } from "react";

interface ButtonFormProps {
  label?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

const ButtonForm: React.FC<ButtonFormProps> = ({ 
  label, 
  type = "button", 
  onClick, 
  disabled,
  loading = false
}) => {
  return (
    <div style={{ marginBottom: SPACING.md }}>
      <Button 
        type="primary" 
        htmlType={type} 
        onClick={onClick} 
        disabled={disabled}
        loading={loading}
        style={styles.button}
      >
        {label}
      </Button>
    </div>
  );
};

const styles: { button: CSSProperties } = {
  button: {
    fontSize: "16px",
    background: "var(--accent-color)",
    border: "1px solid var(--accent-color)",
    borderRadius: RADIUS.md,
    color: "#ffffff",
    width: "100%",
    height: "48px",
    fontWeight: 600,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 2px 8px rgba(24, 144, 255, 0.2)",
    outline: "none",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
  },
};

export default ButtonForm;