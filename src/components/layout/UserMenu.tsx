import { LogoutOutlined, UserOutlined, LockOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslationWithRerender } from "../../hooks/useLanguageChange";
import { logout } from "../../redux/slices/auth";
import { useDispatch } from "../../redux/store";

const UserMenu = ({ user }: { user: any }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslationWithRerender();
  
  const handleLogout = async () => {
    const response = await dispatch(logout());
    if (response.payload) {
      navigate("/login");
    }
  };
  const menu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />} onClick={() => navigate(`/profile/${user?._id}`)}>
        {user?.fullName}
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="change-password" icon={<LockOutlined />} onClick={() => navigate('/change-password')}>
        {t('auth.changePassword.title')}
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        {t('navigation.logout')}
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
      <Avatar src={user?.avatar || "./images/landing/sections/fakeImages/avatarStudent.png"} style={{ cursor: "pointer" }} />
    </Dropdown>
  );
};

export default UserMenu;
