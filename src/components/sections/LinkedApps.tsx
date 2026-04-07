import { AppstoreOutlined, LinkOutlined } from '@ant-design/icons';
import { Button, Card, Col, Image, Row, Spin, Tag, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslationWithRerender } from '../../hooks/useLanguageChange';
import SectionLayout from '../../layouts/SectionLayout';
import { LinkedApp, linkedAppService } from '../../services/linkedAppService';

const { Title, Text, Paragraph } = Typography;

interface LinkedAppsProps {
  style?: React.CSSProperties;
}

const LinkedApps: React.FC<LinkedAppsProps> = ({ style }) => {
  const { t } = useTranslationWithRerender();
  const [apps, setApps] = useState<LinkedApp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        setLoading(true);
        const response = await linkedAppService.getLinkedApps();
        if (response.success) {
          setApps(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch linked apps:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, []);

  if (loading) {
    return (
      <SectionLayout style={style}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
        </div>
      </SectionLayout>
    );
  }

  if (apps.length === 0) {
    return null; // Không hiển thị nếu không có data
  }

  const handleAppClick = (app: LinkedApp) => {
    if (app.openInNewTab) {
      window.open(app.url, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = app.url;
    }
  };

  return (
    <SectionLayout style={style}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <Title level={2} style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>
          Ứng Dụng Liên Kết
        </Title>
        <Paragraph style={{ color: 'var(--text-secondary)', fontSize: '16px', maxWidth: '600px', margin: '0 auto' }}>
          Khám phá các ứng dụng và công cụ hữu ích được liên kết với CodeLab
        </Paragraph>
      </div>

      <Row gutter={[24, 24]} justify="center">
        {apps.map((app) => (
          <Col 
            key={app._id} 
            xs={24} 
            sm={12} 
            md={8} 
            lg={8}
            xl={6}
          >
            <Card
              hoverable
              style={{
                height: '100%',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                backgroundColor: 'var(--bg-primary)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
              }}
              styles={{
                body: {
                  padding: '24px',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }
              }}
              onClick={() => handleAppClick(app)}
            >
              {/* Header with Icon and Name */}
              <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                {app.icon ? (
                  app.icon.startsWith('http') ? (
                    <Image
                      src={app.icon}
                      alt={app.name}
                      width={48}
                      height={48}
                      style={{ objectFit: 'contain', borderRadius: '8px' }}
                      preview={false}
                    />
                  ) : (
                    <div style={{ fontSize: '48px', lineHeight: 1 }}>{app.icon}</div>
                  )
                ) : (
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--bg-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    color: 'var(--accent-color)',
                  }}>
                    <AppstoreOutlined />
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <Title level={4} style={{ margin: 0, color: 'var(--text-primary)' }}>
                    {app.name}
                  </Title>
                  {app.category && (
                    <Tag color="blue" style={{ marginTop: '4px' }}>
                      {app.category}
                    </Tag>
                  )}
                </div>
              </div>

              {/* Description */}
              {app.description && (
                <Paragraph 
                  ellipsis={{ rows: 2, expandable: false }}
                  style={{ 
                    color: 'var(--text-secondary)', 
                    marginBottom: '16px',
                    minHeight: '44px',
                  }}
                >
                  {app.description}
                </Paragraph>
              )}

              {/* Stats */}
              {app.metadata?.stats && (
                <div style={{ marginBottom: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {app.metadata.stats.users && (
                    <Tag color="blue">👥 {app.metadata.stats.users}</Tag>
                  )}
                  {app.metadata.stats.photos && (
                    <Tag color="green">📸 {app.metadata.stats.photos}</Tag>
                  )}
                  {app.metadata.stats.rating && (
                    <Tag color="orange">⭐ {app.metadata.stats.rating}</Tag>
                  )}
                  {app.metadata.stats.satisfaction && (
                    <Tag color="purple">💯 {app.metadata.stats.satisfaction}</Tag>
                  )}
                </div>
              )}

              {/* Features */}
              {app.metadata?.features && app.metadata.features.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <Text strong style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    Tính năng:
                  </Text>
                  <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {app.metadata.features.slice(0, 3).map((feature, idx) => (
                      <Tag key={idx} style={{ fontSize: '11px', margin: 0 }}>
                        {feature}
                      </Tag>
                    ))}
                    {app.metadata.features.length > 3 && (
                      <Tag style={{ fontSize: '11px', margin: 0 }}>
                        +{app.metadata.features.length - 3} more
                      </Tag>
                    )}
                  </div>
                </div>
              )}

              {/* Preview Image */}
              {app.image && (
                <div style={{ marginBottom: '16px', borderRadius: '8px', overflow: 'hidden' }}>
                  <Image
                    src={app.image}
                    alt={app.name}
                    style={{ width: '100%', height: '120px', objectFit: 'cover' }}
                    preview={false}
                  />
                </div>
              )}

              {/* Footer with Link Button */}
              <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                <Button
                  type="primary"
                  icon={<LinkOutlined />}
                  block
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAppClick(app);
                  }}
                  style={{
                    backgroundColor: 'var(--accent-color)',
                    borderColor: 'var(--accent-color)',
                  }}
                >
                  Truy cập ứng dụng
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {apps.length > 0 && (
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Text style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Tất cả các ứng dụng đều được kiểm tra và đảm bảo chất lượng
          </Text>
        </div>
      )}
    </SectionLayout>
  );
};

export default LinkedApps;
