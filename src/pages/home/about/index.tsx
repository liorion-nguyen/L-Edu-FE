import { Button, Card, Carousel, Col, Row, Typography, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslationWithRerender } from '../../../hooks/useLanguageChange';
import SectionLayout from '../../../layouts/SectionLayout';
import { contactService, Contact } from '../../../services/contactService';
import { contentService, Content } from '../../../services/contentService';
import { getIconByValue } from '../../../constants/icons';

const { Title, Paragraph } = Typography;

const AboutUs = () => {
    const navigate = useNavigate();
    const { t } = useTranslationWithRerender();
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [contentBlocks, setContentBlocks] = useState<Content[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Fetch contacts
                const contactsResponse = await contactService.getContacts();
                if (contactsResponse.success) {
                    setContacts(contactsResponse.data);
                }
                
                // Fetch about content blocks
                const contentResponse = await contentService.getContentByPage('about');
                if (contentResponse.statusCode === 200) {
                    setContentBlocks(contentResponse.data);
                }
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <SectionLayout title={t('about.title')} style={styles.container}>
            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <Spin size="large" />
                </div>
            ) : (
                <>
                    {contentBlocks.length > 0 ? (
                        // Render multiple content blocks
                        contentBlocks.map((block, blockIndex) => (
                            <div key={block._id} style={{ marginBottom: '40px' }}>
                                <Title level={blockIndex === 0 ? 1 : 2} style={{ textAlign: "center", color: "var(--text-primary)" }}>
                                    {block.title}
                                </Title>
                                <Title level={4} style={{ color: "var(--text-primary)" }}>
                                    {block.subtitle}
                                </Title>
                                
                                {block.descriptions && block.descriptions.length > 0 && (
                                    block.descriptions.map((desc, index) => (
                                        <Paragraph key={index} style={{ color: "var(--text-secondary)" }}>
                                            {desc}
                                        </Paragraph>
                                    ))
                                )}

                                {/* Render sections for this block */}
                                {block.sections && block.sections.length > 0 && (
                                    <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
                                        {block.sections.filter(section => section.isActive).map((section, index) => (
                                            <Col xs={24} md={12} key={index}>
                                                <Card
                                                    cover={
                                                        section.image ? (
                                                            <img 
                                                                alt={section.title} 
                                                                src={section.image} 
                                                                style={{ height: 300, objectFit: 'cover' }} 
                                                            />
                                                        ) : (
                                                            <div style={{ height: 300, backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                <span style={{ color: '#999' }}>No Image</span>
                                                            </div>
                                                        )
                                                    }
                                                >
                                                    <Card.Meta 
                                                        title={section.title} 
                                                        description={section.description} 
                                                    />
                                                    {section.buttonText && section.buttonLink && (
                                                        <Button 
                                                            type="primary" 
                                                            style={{ marginTop: 16 }} 
                                                            onClick={() => window.open(section.buttonLink, '_blank')}
                                                        >
                                                            {section.buttonText}
                                                        </Button>
                                                    )}
                                                </Card>
                                            </Col>
                                        ))}
                                    </Row>
                                )}
                            </div>
                        ))
                    ) : (
                        // No content blocks available
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                            <Title level={3}>No content available</Title>
                            <Paragraph>Please add content blocks in the admin dashboard.</Paragraph>
                        </div>
                    )}
                </>
            )}

            <div style={{ marginTop: 40, backgroundColor: 'var(--bg-secondary)', padding: 24, borderRadius: 8, border: '1px solid var(--border-color)' }}>
                <Title level={2} style={{ textAlign: "center", color: "var(--text-primary)" }}>{t('about.contactUs')}</Title>
                
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <Spin />
                    </div>
                ) : (
                    <>
                        {contacts.map((contact, index) => {
                            const iconData = getIconByValue(contact.icon || '');
                            const icon = iconData ? iconData.emoji : '📋';
                            
                            if (contact.type === 'email') {
                                return (
                                    <Paragraph key={index} style={{ textAlign: "center", color: 'var(--text-secondary)' }}>
                                        {t('about.haveQuestions')} <a href={`mailto:${contact.value}`} style={{ color: 'var(--accent-color)' }}>{contact.value}</a>
                                    </Paragraph>
                                );
                            }
                            if (contact.type === 'address') {
                                return (
                                    <Paragraph key={index} style={{ textAlign: "center", color: 'var(--text-secondary)' }}>
                                        {icon} {t('about.address')}: {contact.value}
                                    </Paragraph>
                                );
                            }
                            if (contact.type === 'phone') {
                                return (
                                    <Paragraph key={index} style={{ textAlign: "center", color: 'var(--text-secondary)' }}>
                                        {icon} {t('about.phone')}: {contact.value}
                                    </Paragraph>
                                );
                            }
                            return null;
                        })}
                        
                        <Paragraph style={{ textAlign: "center", color: 'var(--text-secondary)' }}>
                            🌐 {t('about.followUs')}:
                            {contacts
                                .filter(contact => contact.type === 'social')
                                .map((contact, index) => (
                                    <span key={index}>
                                        <a 
                                            href={contact.value} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            style={{ marginLeft: 8, color: 'var(--accent-color)' }}
                                        >
                                            {contact.label}
                                        </a>
                                        {index < contacts.filter(c => c.type === 'social').length - 1 && ' | '}
                                    </span>
                                ))
                            }
                        </Paragraph>
                    </>
                )}
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