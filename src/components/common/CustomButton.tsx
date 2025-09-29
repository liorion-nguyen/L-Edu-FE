import { Button } from "antd";
import { COLORS, RADIUS, SPACING } from "../../constants/colors";

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

const styles = {
  button: {
    fontSize: "16px",
    background: COLORS.primary[500],
    border: `1px solid ${COLORS.primary[600]}`,
    borderRadius: RADIUS.md,
    color: COLORS.text.inverse,
    width: "100%",
    height: "48px",
    fontWeight: 600,
    transition: "all 0.2s ease",
    boxShadow: "none",
    outline: "none",
    cursor: "pointer",
    "&:hover": {
      background: COLORS.primary[600],
      borderColor: COLORS.primary[700],
      transform: "translateY(-1px)",
      boxShadow: `0 4px 12px ${COLORS.primary[200]}`,
    },
    "&:active": {
      transform: "translateY(0)",
      boxShadow: `0 2px 8px ${COLORS.primary[200]}`,
    },
    "&:focus": {
      boxShadow: `0 0 0 3px ${COLORS.primary[100]}`,
    },
    "&:disabled": {
      background: COLORS.neutral[300],
      borderColor: COLORS.neutral[400],
      color: COLORS.neutral[500],
      cursor: "not-allowed",
      transform: "none",
      boxShadow: "none",
    },
  },
};

export default ButtonForm;