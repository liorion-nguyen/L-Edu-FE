import { Avatar, Dropdown, Menu } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { dispatch } from "../../redux/store";
import { logout } from "../../redux/slices/auth";
import { useNavigate } from "react-router-dom";

const UserMenu = ({ user }: { user: any }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    fetch();
  };
  const fetch = async () => {
    const check = await dispatch(logout());
    if (check) {
      navigate("/login");
    }
  }
  const menu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />} onClick={() => navigate(`/profile/${user?._id}`)}>
        {user?.fullName}
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Đăng xuất
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
