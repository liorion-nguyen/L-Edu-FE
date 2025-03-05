import SectionLayout from "../../layouts/SectionLayout";
import Title from "antd/es/typography/Title";
import { Button, Col, Layout, Menu, Row, Drawer, Grid } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { CSSProperties, useState } from "react";
import { MenuOutlined } from "@ant-design/icons";
import UserMenu from "./UserMenu";
import { User } from "../../types/auth";

const { useBreakpoint } = Grid;
const menuItems = [
    { key: "/", label: "Home" },
    { key: "/about", label: "About" },
    { key: "/course", label: "Course" },
    { key: "/contact", label: "Contact" },
];

const Header = () => {
    const screens = useBreakpoint();
    const navigate = useNavigate();
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const getSizeScreen = () => {
        if (screens.md) return true;
        if (screens.lg) return true;
        if (screens.xl) return true;
        if (screens.xxl) return true;
        return false;
    };
    const handleLogin = () => {
        navigate("/login");
    };
    const user: User = {
        id: "1",
        name: "John Doe",
        email: "liorion.nguyen@gmail.com",
        role: "Student",
        course: ["react_native"],
        avatar: "/images/landing/sections/fakeImages/avatarStudent.png"
    };
    const handleHome = () => {  
        navigate("/");
    };
    return (
        <Layout.Header style={styles.header}>
            <SectionLayout>
                <Row justify="space-between" align="middle" style={{ width: "100%" }}>
                    {/* Logo */}
                    <Col lg={4} md={6} sm={18} xs={18}>
                        <Title level={1} style={styles.logo} onClick={handleHome}>L Edu</Title>
                    </Col>

                    {/* Menu hiển thị trên màn hình lớn */}
                    <Col lg={16} md={12} sm={0} xs={0}>
                        <Menu
                            mode="horizontal"
                            selectedKeys={[location.pathname]}
                            items={menuItems}
                            onClick={({ key }) => navigate(key)}
                            style={styles.menu}
                        />
                    </Col>

                    {/* Nút Enroll + Menu Icon trên mobile */}
                    <Col lg={4} md={6} sm={6} xs={6} style={{ textAlign: "right" }}>
                        {
                            user ? getSizeScreen() && <UserMenu user={user}/>
                                : <Button style={{ ...styles.button, display: getSizeScreen() ? "inline-flex" : "none" }} onClick={handleLogin}>Enroll now</Button>
                        }
                        <MenuOutlined style={{ ...styles.menuIcon, display: getSizeScreen() ? "none" : "inline-flex" }} onClick={() => setOpen(true)} />
                    </Col>
                </Row>
            </SectionLayout>

            {/* Drawer cho mobile */}
            <Drawer
                title={user ? user.name : "Guest Account"}
                placement="right"
                closable
                onClose={() => setOpen(false)}
                open={open}
            >
                <Menu
                    mode="vertical"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    onClick={({ key }) => {
                        navigate(key);
                        setOpen(false);
                    }}
                />
            </Drawer>
        </Layout.Header>
    );
}

export default Header;

const styles: { header: CSSProperties, logo: CSSProperties, menu: CSSProperties, button: CSSProperties, menuIcon: CSSProperties } = {
    header: {
        background: "white",
        display: "flex",
        justifyContent: "center",
        position: "fixed",
        zIndex: 1000,
        top: 0,
        left: 0,
        width: "100%",
        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
        padding: 0
    },
    logo: {
        margin: 0,
        fontWeight: "bold",
        cursor: "pointer",
        color: "#BFECFF"
    },
    menu: {
        flex: 1,
        justifyContent: "center",
        borderBottom: "none",
    },
    button: {
        background: "#6259E8",
        color: "white",
        border: "none",
        display: "inline-flex",
    },
    menuIcon: {
        fontSize: "24px",
        cursor: "pointer",
    }
};