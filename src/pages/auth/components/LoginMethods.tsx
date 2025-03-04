import { Button, Row, Tooltip } from "antd";

const LoginMethods = () => {
    const loginMethods = [
        { name: "Facebook", icon: "/images/icons/socials/ic_facebook.svg", handle: () => {} },
        { name: "Github", icon: "/images/icons/socials/ic_github.svg", handle: () => {} },
        { name: "Google", icon: "/images/icons/socials/ic_google.svg", handle: () => {} }
    ];

    return (
        <Row justify="center" gutter={[16, 16]}>
            {loginMethods.map((method, index) => (
                <Tooltip key={index} title={method.name} placement="bottom">
                    <Button onClick={method.handle} style={{ border: 0 }}>
                        <img src={method.icon} alt={method.name} style={{ width: "48px", height: "48px" }} />
                    </Button>
                </Tooltip>
            ))}
        </Row>
    );
};

export default LoginMethods;
