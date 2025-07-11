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
    fontWeight: 500,
  },
};

export default ButtonForm;