import { Button, Card, Carousel, Col, Row, Typography } from 'antd';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslationWithRerender } from '../../../hooks/useLanguageChange';
import SectionLayout from '../../../layouts/SectionLayout';

const { Title, Paragraph } = Typography;

const AboutUs = () => {
    const navigate = useNavigate();
    const { t } = useTranslationWithRerender();
    
    useEffect(() => {
        console.log('AboutUs component mounted/rendered');
        return () => {
            console.log('AboutUs component unmounted');
        };
    }, []);

    const team = [
        {
            name: t('about.member1.name'),
            image: 'https://png.pngtree.com/png-vector/20240314/ourmid/pngtree-cartoon-of-thai-male-teacher-holding-a-stick-in-front-of-png-image_11960362.png',
            description: t('about.member1.description'),
            link: 'https://www.facebook.com/chungg.203',
        },
        {
            name: t('about.member2.name'),
            image: 'https://png.pngtree.com/png-vector/20240314/ourmid/pngtree-cartoon-of-thai-male-teacher-holding-a-stick-in-front-of-png-image_11960363.png',
            description: t('about.member2.description'),
            link: 'https://www.facebook.com/chungg.203',
        },
        {
            name: t('about.member3.name'),
            image: 'https://img.pikbest.com/png-images/qiantu/original-cute-cartoon-teacher-classroom-hand-drawn-free-buckle-element_2732027.png!sw800',
            description: t('about.member3.description'),
            link: 'https://www.facebook.com/chungg.203',
        },
    ];
    return (
        <SectionLayout title={t('about.title')} style={styles.container}>
            <Title level={1} style={{ textAlign: "center", color: "var(--text-primary)" }}>{t('about.title')}</Title>
            <Title level={4} style={{ color: "var(--text-primary)" }}>{t('about.welcome')}</Title>
            <Paragraph style={{ color: "var(--text-secondary)" }}>{t('about.description1')}</Paragraph>
            <Paragraph style={{ color: "var(--text-secondary)" }}>{t('about.description2')}</Paragraph>

            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <Card
                        cover={<img alt="Our Courses" src="/images/landing/about/cover-course.png" style={{ height: 300, objectFit: 'cover' }} />}
                    >
                        <Card.Meta title={t('course.ourCourses')} description={t('about.ourCoursesDescription')} />
                        <Button type="primary" style={{ marginTop: 16 }} onClick={() => navigate('/hotels')}>
                            {t('about.learnMore')}
                        </Button>
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card
                        cover={<img alt="Our Teachers" src="/images/landing/about/cover-teacher.png" style={{ height: 300, objectFit: 'cover' }} />}
                    >
                        <Card.Meta title={t('about.ourTeachers')} description={t('about.ourTeachersDescription')} />
                        <Button type="primary" style={{ marginTop: 16 }} onClick={() => navigate('/tours')}>
                            {t('about.learnMore')}
                        </Button>
                    </Card>
                </Col>
            </Row>

            <div style={{ marginTop: 40, backgroundColor: 'var(--bg-secondary)', padding: 24, borderRadius: 8, border: '1px solid var(--border-color)' }}>
                <Title level={2} style={{ color: 'var(--text-primary)', textAlign: "center" }}>{t('about.unlockPotential')}</Title>
                <Paragraph style={{ color: 'var(--text-secondary)' }}>{t('about.believeLearning')}</Paragraph>
                <Paragraph style={{ color: 'var(--text-secondary)' }}>{t('about.expertInstructors')}</Paragraph>
            </div>


            <div style={{ marginTop: 40 }}>
                <Title level={2} style={{ textAlign: "center", color: "var(--text-primary)" }}>{t('about.meetTeam')}</Title>
                {/* <SliderCustom Html={relatedTeam()} /> */}
                <Carousel autoplay>
                    {
                        team.map((member, index) => (
                            <Card
                                hoverable
                                cover={<img alt={member.name} src={member.image} style={{ height: 200, objectFit: 'cover' }} />}
                                key={index}
                            >
                                <Card.Meta title={<a href={member.link} target="_blank" rel="noopener noreferrer">{member.name}</a>} description={member.description} />
                            </Card>
                        ))
                    }
                </Carousel>
            </div>

            <div style={{ marginTop: 40, backgroundColor: 'var(--bg-secondary)', padding: 24, borderRadius: 8, border: '1px solid var(--border-color)' }}>
                <Title level={2} style={{ textAlign: "center", color: "var(--text-primary)" }}>{t('about.contactUs')}</Title>
                <Paragraph style={{ textAlign: "center", color: 'var(--text-secondary)' }}>
                    {t('about.haveQuestions')} <a href="mailto:liorion.nguyen@gmail.com" style={{ color: 'var(--accent-color)' }}>liorion.nguyen@gmail.com</a>
                </Paragraph>
                <Paragraph style={{ textAlign: "center", color: 'var(--text-secondary)' }}>
                    📍 {t('about.address')}: {t('about.addressValue')}
                </Paragraph>
                <Paragraph style={{ textAlign: "center", color: 'var(--text-secondary)' }}>
                    📞 {t('about.phone')}: +84 708 200 334
                </Paragraph>
                <Paragraph style={{ textAlign: "center", color: 'var(--text-secondary)' }}>
                    🌐 {t('about.followUs')}:
                    <a href="https://www.facebook.com/chungg.203" target="_blank" rel="noopener noreferrer" style={{ marginLeft: 8, color: 'var(--accent-color)' }}>Facebook</a> |
                    <a href="mailto:liorion.nguyen@gmail.com" target="_blank" rel="noopener noreferrer" style={{ marginLeft: 8, color: 'var(--accent-color)' }}>Gmail</a> |
                    <a href="https://zalo.me/0708200334" target="_blank" rel="noopener noreferrer" style={{ marginLeft: 8, color: 'var(--accent-color)' }}>Zalo</a>
                </Paragraph>

            </div>

        </SectionLayout>
    );
};

export default AboutUs;

const styles: {
    container: React.CSSProperties;
} = {
    container: {
        minHeight: "100vh",
        background: "var(--bg-primary)",
        position: "relative",
        overflow: "hidden",
        padding: "40px 20px",
    },
};