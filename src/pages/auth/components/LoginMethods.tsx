import { Button, Row, Tooltip } from "antd";
import { CSSProperties } from "react";

const LoginMethods = () => {
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    const handleGoogleLogin = () => {
        window.location.href = `${API_BASE_URL}/auth/google`;
    };

    const handleFacebookLogin = () => {
        window.location.href = `${API_BASE_URL}/auth/facebook`;
    };

    const handleGitHubLogin = () => {
        window.location.href = `${API_BASE_URL}/auth/github`;
    };

    const loginMethods = [
        { 
            name: "Facebook", 
            icon: "/images/icons/socials/ic_facebook.svg", 
            handle: handleFacebookLogin,
            color: "#1877F2",
            hoverColor: "#166FE5"
        },
        { 
            name: "Github", 
            icon: "/images/icons/socials/ic_github.svg", 
            handle: handleGitHubLogin,
            color: "#333333",
            hoverColor: "#24292E"
        },
        { 
            name: "Google", 
            icon: "/images/icons/socials/ic_google.svg", 
            handle: handleGoogleLogin,
            color: "#DB4437",
            hoverColor: "#C23321"
        }
    ];

    return (
        <Row justify="center" gutter={[12, 12]}>
            {loginMethods.map((method, index) => (
                <Tooltip key={index} title={`Đăng nhập bằng ${method.name}`} placement="bottom">
                    <Button 
                        onClick={method.handle} 
                        style={{
                            ...styles.socialButton,
                            backgroundColor: method.color,
                            borderColor: method.color,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = method.hoverColor;
                            e.currentTarget.style.borderColor = method.hoverColor;
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2)';
                            const icon = e.currentTarget.querySelector('img');
                            if (icon) {
                                icon.style.transform = 'scale(1.1)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = method.color;
                            e.currentTarget.style.borderColor = method.color;
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                            const icon = e.currentTarget.querySelector('img');
                            if (icon) {
                                icon.style.transform = 'scale(1)';
                            }
                        }}
                    >
                        <img 
                            src={method.icon} 
                            alt={method.name} 
                            style={styles.socialIcon} 
                        />
                    </Button>
                </Tooltip>
            ))}
        </Row>
    );
};

const styles: { [key: string]: CSSProperties } = {
    socialButton: {
        width: "56px",
        height: "56px",
        borderRadius: "12px",
        border: "2px solid",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        cursor: "pointer",
        padding: 0,
        background: "transparent",
        position: "relative",
        overflow: "hidden",
    },
    socialIcon: {
        width: "28px",
        height: "28px",
        filter: "brightness(0) invert(1)",
        transition: "transform 0.2s ease",
        zIndex: 1,
    },
};

export default LoginMethods;
