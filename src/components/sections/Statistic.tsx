import { Col, Row } from "antd";
import SectionLayout from "../../layouts/SectionLayout";
import { Typography } from "antd";

const { Text } = Typography;

const Statistic = () => {
    const statistics = [
        {
            name: "Students Enrolled",
            count: 200100,
        },
        {
            name: "Expert mentors",
            count: 253,
        },
        {
            name: "Students Review",
            count: 500005,
        },
        {
            name: "Success",
            count: 180000,
        }
    ];

    const formatNumber = (num: number) => {
        if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B+";
        if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M+";
        if (num >= 1_000) return (num / 1_000).toFixed(1) + "K+";
        return num;
    };

    return (
        <SectionLayout>
            <Row style={{ padding: "50px 100px", background: "#BFECFF", borderRadius: '20px' }} justify="space-between" align="middle">
                {
                    statistics.map((statistic, index) => (
                        <Col
                            xs={24} sm={12} md={6} lg={6}
                            key={index}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center"
                            }}
                        >
                            <Text style={{ color: "#333", fontSize: "25px" }}>{formatNumber(statistic.count)}</Text>
                            <Text style={{ color: "#333", fontSize: "17px" }}>{statistic.name}</Text>
                        </Col>

                    ))
                }
            </Row>
        </SectionLayout>
    );
};

export default Statistic;