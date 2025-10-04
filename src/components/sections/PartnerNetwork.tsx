import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Typography, Spin } from 'antd';
import { useTranslationWithRerender } from '../../hooks/useLanguageChange';
import SectionLayout from '../../layouts/SectionLayout';
import { footerService, Footer, FooterLink } from '../../services/footerService';

const { Title } = Typography;

interface PartnerNetworkProps {
  style?: React.CSSProperties;
}

const PartnerNetwork: React.FC<PartnerNetworkProps> = ({ style }) => {
  const { t } = useTranslationWithRerender();
  const [partners, setPartners] = useState<Footer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true);
        const response = await footerService.getFooters();
        if (response.success) {
          // Tìm section 'company' hoặc 'partners'
          const partnerSection = response.data.find(
            section => section.section === 'company' || section.section === 'partners'
          );
          setPartners(partnerSection || null);
        }
      } catch (error) {
        console.error('Failed to fetch partners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
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

  if (!partners || partners.links.length === 0) {
    return null; // Không hiển thị nếu không có data
  }

  return (
    <SectionLayout style={style}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <Title level={2} style={{ color: 'var(--text-primary)' }}>
          {partners.title || t('partners.title')}
        </Title>
        <Typography.Paragraph style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
          {t('partners.description')}
        </Typography.Paragraph>
      </div>

      <Row gutter={[24, 24]} justify="center">
        {partners.links.map((partner, index) => (
          <Col 
            key={index} 
            xs={12} 
            sm={8} 
            md={6} 
            lg={4} 
            xl={4}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <Card
              hoverable
              style={{
                width: '100%',
                maxWidth: '180px',
                height: '120px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-primary)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              styles={{
                body: {
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  flexDirection: 'column'
                }
              }}
              onClick={() => {
                if (partner.url && partner.isExternal) {
                  window.open(partner.url, '_blank', 'noopener,noreferrer');
                } else if (partner.url) {
                  window.location.href = partner.url;
                }
              }}
            >
              {partner.icon ? (
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <img
                    src={partner.icon}
                    alt={partner.label}
                    style={{
                      width: '60px',
                      height: '60px',
                      objectFit: 'contain',
                      borderRadius: '8px'
                    }}
                    onError={(e) => {
                      // Fallback nếu image load lỗi
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<div style="font-size: 24px; color: var(--text-primary); font-weight: bold;">${partner.label.charAt(0)}</div>`;
                      }
                    }}
                  />
                  <Typography.Text 
                    style={{ 
                      fontSize: '12px', 
                      textAlign: 'center',
                      color: 'var(--text-secondary)',
                      fontWeight: '500'
                    }}
                  >
                    {partner.label}
                  </Typography.Text>
                </div>
              ) : (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  height: '100%',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div style={{
                    fontSize: '32px',
                    color: 'var(--accent-color)',
                    fontWeight: 'bold',
                    backgroundColor: 'var(--bg-secondary)',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {partner.label.charAt(0)}
                  </div>
                  <Typography.Text 
                    style={{ 
                      fontSize: '12px', 
                      textAlign: 'center',
                      color: 'var(--text-secondary)',
                      fontWeight: '500'
                    }}
                  >
                    {partner.label}
                  </Typography.Text>
                </div>
              )}
            </Card>
          </Col>
        ))}
      </Row>

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <Typography.Text style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          {t('partners.footerText')}
        </Typography.Text>
      </div>
    </SectionLayout>
  );
};

export default PartnerNetwork;