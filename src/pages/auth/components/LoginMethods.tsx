import { Button, Col, Row, Tooltip } from "antd";
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
                <Col key={index}>
                    <Tooltip key={index} title={method.name} placement="bottom">
                        <Button
                            type="text"
                            onClick={method.handle}
                            style={{
                                padding: 0,
                                height: 'auto',
                                border: 'none',
                                background: 'transparent',
                                boxShadow: 'none',
                            }}
                        >
                            <img
                                src={method.icon}
                                alt={method.name}
                                style={styles.socialIcon}
                            />
                        </Button>
                    </Tooltip>
                </Col>
            ))}
        </Row>
    );
};

const styles: { [key: string]: CSSProperties } = {
    socialButton: {
        width: "48px",
        height: "48px",
        borderRadius: "50%",
        border: "none !important",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        padding: 0,
        background: "transparent",
        position: "relative",
        overflow: "hidden",
    },
};

export default LoginMethods;
