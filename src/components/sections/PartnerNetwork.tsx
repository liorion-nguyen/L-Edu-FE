import { Col, Row } from "antd";
import Title from "antd/es/typography/Title";
import SectionLayout from "../../layouts/SectionLayout";

const PartnerNetwork = () => {
    const customers = [
        { name: "Mindx", logo: "/images/landing/sections/overview/mindx.png", link: "https://mindx.edu.vn/" },
        { name: "Kite", logo: "/images/landing/sections/overview/kite.png", link: "http://americanstudy.edu.vn/" },
        { name: "Fetch", logo: "/images/landing/sections/overview/fetch.png", link: "https://www.fetch.tech/" },
        { name: "Starack", logo: "/images/landing/sections/overview/starack.png", link: "https://starack.net/" },
        { name: "Hnue", logo: "/images/landing/sections/overview/hnue.png", link: "https://hnue.edu.vn/" },
    ];

    return (
        <SectionLayout>
            <Row>
                <Col span={24}>
                    <Title level={2} style={{ textAlign: "center", color: "#282846" }}>Partner Network</Title>
                </Col>
                <Col span={24}>
                    <Row justify="center" style={{ display: "flex", gap: "100px", flexWrap: "wrap" }}>
                        {customers.map((customer, index) => (
                            <a key={index} href={customer.link} target="_blank" rel="noreferrer">
                                <img src={customer.logo} alt={customer.name} style={{ height: "100px" }} />
                            </a>
                        ))}
                    </Row>
                </Col>
            </Row>
        </SectionLayout>
    );
};

export default PartnerNetwork;