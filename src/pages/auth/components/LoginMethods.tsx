import { Button, Row, Tooltip } from "antd";

const LoginMethods = () => {
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

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
            handle: handleFacebookLogin 
        },
        { 
            name: "Github", 
            icon: "/images/icons/socials/ic_github.svg", 
            handle: handleGitHubLogin 
        },
        { 
            name: "Google", 
            icon: "/images/icons/socials/ic_google.svg", 
            handle: handleGoogleLogin 
        }
    ];

    return (
        <Row justify="center" gutter={[16, 16]}>
            {loginMethods.map((method, index) => (
                <Tooltip key={index} title={`Đăng nhập bằng ${method.name}`} placement="bottom">
                    <Button onClick={method.handle} style={{ border: 0 }}>
                        <img src={method.icon} alt={method.name} style={{ width: "48px", height: "48px" }} />
                    </Button>
                </Tooltip>
            ))}
        </Row>
    );
};

export default LoginMethods;
