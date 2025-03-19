import { Button } from "antd";

interface ButtonFormProps {
  label?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
}

const ButtonForm: React.FC<ButtonFormProps> = ({ label, type = "button", onClick, disabled }) => {
  return (
    <div style={{ marginBottom: "16px" }}>
      <Button type="primary" htmlType={type} onClick={onClick} disabled={disabled} style={{ fontSize: "15px",
         background: "linear-gradient(45deg, #4ECDC4, #1A4A4A)", // Teal gradient
         border: "none",
         color: "#B0E0E6", // Pale teal for text
         boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5), 0 0 10px rgba(78, 205, 196, 0.2)", // Teal glow
         transition: "box-shadow 0.3s",
         width: "100%",
      }}>
        {label}
      </Button>
    </div>
  );
};

export default ButtonForm;