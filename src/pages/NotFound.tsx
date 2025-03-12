import { Button, Typography, Row, Col, Card } from 'antd';

const { Title, Paragraph } = Typography;

const NotFound = () => {
    return (
        <Row justify="center" align="middle" style={{ height: '100vh', backgroundColor: '#fff', textAlign: 'center' }}>
            <Col xs={24} sm={20} md={16} lg={12}>
                <Card style={{ padding: 24, borderRadius: 8, boxShadow: '0px 4px 10px rgba(0,0,0,0.1)' }}>
                    <div style={{ 
                        backgroundImage: "url('https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif')",
                        height: 300,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderRadius: 8,
                    }} />

                    <Title level={1} style={{ color: '#003366', marginTop: 20 }}>404</Title>
                    <Title level={3}>Oops! Looks like you're lost</Title>
                    <Paragraph>The page you are looking for is not available!</Paragraph>

                    <Button type="primary" href="/" size="large" style={{ marginTop: 20 }}>
                        Go to Home
                    </Button>
                </Card>
            </Col>
        </Row>
    );
}

export default NotFound;