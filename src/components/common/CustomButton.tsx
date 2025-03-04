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
      <Button type="primary" htmlType={type} onClick={onClick} disabled={disabled} style={{ fontSize: "15px"}}>
        {label}
      </Button>
    </div>
  );
};

export default ButtonForm;