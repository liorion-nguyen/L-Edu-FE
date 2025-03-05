import { Avatar, Dropdown, Menu } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";

const UserMenu = ({ user }: { user: any }) => {
  const menu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        {user?.name}
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
      <Avatar src={user?.avatar} style={{ cursor: "pointer" }} />
    </Dropdown>
  );
};

export default UserMenu;
