import { BookOutlined, DashboardOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";
import { MenuProps } from "antd";
import Link from "antd/es/typography/Link";
import Title from "antd/es/typography/Title";

const items: MenuProps['items'] = [
  {
    key: 'logo',
    label: (
      <Title level={3} style={{ margin: 0, fontWeight: "bold", textAlign: "center", color: "#BFECFF" }}>
        L Edu
      </Title>
    ),
    type: 'group',
  },
  {
    type: 'divider',
  },
  {
    key: 'group-navigation',
    type: 'group',
    children: [
      {
        key: 'overview',
        icon: <DashboardOutlined />,
        label: <Link href="/dashboard">Overview</Link>
      },
      {
        key: 'course',
        icon: <BookOutlined />,
        label: <Link href="/courses">Course</Link>
      },
    ],
  },
  {
    key: 'sub1',
    label: 'User',
    icon: <UserOutlined />,
    children: [
      {
        key: 'user-management',
        label: <Link href="/users">User</Link>
      },
      {
        key: 'teacher',
        label: <Link href="/teachers">Teacher</Link>
      },
      {
        key: 'student',
        label: <Link href="/students">Student</Link>
      }
    ]
  },
  {
    key: 'sub2',
    label: 'System',
    icon: <SettingOutlined />,
    children: [
      {
        key: 'support',
        label: <Link href="/support">Support</Link>
      },
      {
        key: 'settings',
        label: <Link href="/settings">Settings</Link>
      }
    ]
  },
];

export default items;