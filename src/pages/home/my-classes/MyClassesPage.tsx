import { BookOutlined } from '@ant-design/icons';
import { Button, Card, Col, Empty, Row, Skeleton, Tag, Typography } from 'antd';
import React, { CSSProperties, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { localStorageConfig } from '../../../config';
import SectionLayout from '../../../layouts/SectionLayout';
import { RootState, useSelector } from '../../../redux/store';
import { studentClassService } from '../../../services/studentClassService';
import type { ClassSummary } from '../../../types/class';

const { Title, Text } = Typography;

const CLASS_STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Đang hoạt động',
  FINISHED: 'Kết thúc',
  PENDING: 'Chờ',
};

const CLASS_STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'green',
  FINISHED: 'default',
  PENDING: 'orange',
};

const MyClassesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [classes, setClasses] = useState<ClassSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hasToken =
      typeof window !== 'undefined'
        ? !!localStorage.getItem(localStorageConfig.accessToken)
        : false;

    if (!hasToken) {
      navigate('/login', { replace: true });
      return;
    }
    if (!user) {
      // Đợi Header load getUser xong rồi mới fetch lớp
      return;
    }
    const fetch = async () => {
      setLoading(true);
      try {
        const list = await studentClassService.getMyClasses();
        setClasses(Array.isArray(list) ? list : []);
      } catch {
        setClasses([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user, navigate]);

  const activeClasses = classes.filter((c) => c.status === 'ACTIVE');
  const finishedClasses = classes.filter((c) => c.status === 'FINISHED');
  const pendingClasses = classes.filter((c) => c.status === 'PENDING');
  const nextClass = activeClasses[0] ?? classes[0];

  const statusChartData = [
    { key: 'active', label: 'Đang học', value: activeClasses.length },
    { key: 'finished', label: 'Hoàn thành', value: finishedClasses.length },
    { key: 'pending', label: 'Chờ', value: pendingClasses.length },
  ].filter((d) => d.value > 0);

  return (
    <SectionLayout title="Lớp học của tôi" style={styles.sectionLayout}>
      <div style={styles.container}>
        {/* Hero section */}
        <Card bordered={false} style={styles.heroCard}>
          <div style={styles.heroLeft}>
            <Text type="secondary" style={styles.heroBreadcrumb}>
              Bảng điều khiển / Lớp học của tôi
            </Text>
            <Title level={2} style={styles.heroTitle}>
              Xin chào, {user?.fullName || 'bạn'} 👋
            </Title>
            <Text style={styles.heroSubtitle}>
              Bạn đang tham gia{' '}
              <span style={styles.heroHighlight}>{activeClasses.length}</span> lớp đang hoạt động và
              đã hoàn thành <span style={styles.heroHighlight}>{finishedClasses.length}</span> lớp.
            </Text>
            {nextClass && (
              <Text style={styles.heroNextClass}>
                Lớp sắp tới:{' '}
                <strong>
                  {nextClass.name}
                  {nextClass.course ? ` · ${nextClass.course.name}` : ''}
                </strong>
              </Text>
            )}
            <div style={styles.heroActions}>
              <Button
                type="primary"
                size="large"
                onClick={() => {
                  if (nextClass) navigate(`/my-classes/${nextClass._id}`);
                }}
              >
                Vào lớp học
              </Button>
              <Button
                size="large"
                onClick={() => navigate('/course')}
              >
                Khám phá khoá học
              </Button>
            </div>
          </div>
          <div style={styles.heroRight}>
            <div style={styles.heroStatsCard}>
              <Text type="secondary" style={styles.heroStatsLabel}>
                Tổng số lớp
              </Text>
              <Title level={3} style={styles.heroStatsValue}>
                {classes.length}
              </Title>
              <div style={styles.heroStatsRow}>
                <span>Đang học: {activeClasses.length}</span>
                <span>Hoàn thành: {finishedClasses.length}</span>
                <span>Chờ khai giảng: {pendingClasses.length}</span>
              </div>
              {statusChartData.length > 0 && (
                <div style={styles.heroChartWrapper}>
                  <ResponsiveContainer width="100%" height={70}>
                    <BarChart data={statusChartData} barSize={18}>
                      <XAxis dataKey="label" hide />
                      <YAxis hide />
                      <Tooltip
                        formatter={(v: any) => [`${v} lớp`, 'Số lớp']}
                        contentStyle={styles.chartTooltip}
                      />
                      <Bar dataKey="value" radius={8} fill="#38bdf8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Simple status distribution "chart" */}
        {classes.length > 0 && (
          <Card size="small" style={styles.statusCard}>
            <Title level={5} style={styles.statusTitle}>
              Phân bố trạng thái lớp học
            </Title>
            <div style={styles.segmentBar}>
              {classes.map((cls) => {
                const color =
                  cls.status === 'ACTIVE'
                    ? '#22c55e'
                    : cls.status === 'FINISHED'
                    ? '#38bdf8'
                    : '#e5e7eb';
                return (
                  <div
                    key={cls._id}
                    style={{
                      ...styles.segment,
                      background:
                        cls.status === 'ACTIVE'
                          ? 'linear-gradient(90deg, #22c55e, #16a34a)'
                          : cls.status === 'FINISHED'
                          ? 'linear-gradient(90deg, #38bdf8, #6366f1)'
                          : color,
                    }}
                    title={`${cls.name} (${CLASS_STATUS_LABELS[cls.status] ?? cls.status})`}
                  />
                );
              })}
            </div>
            <Text type="secondary" style={styles.statusLegend}>
              Xanh lá: lớp đang học · Xanh dương: lớp đã hoàn thành · Xám: lớp chờ khai giảng
            </Text>
          </Card>
        )}

        {/* Grid of classes */}
        {loading ? (
          <Row gutter={[24, 24]}>
            {[1, 2, 3].map((i) => (
              <Col key={i} xs={24} sm={12} lg={8}>
                <Skeleton active paragraph={{ rows: 3 }} />
              </Col>
            ))}
          </Row>
        ) : classes.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Bạn chưa tham gia lớp nào"
            style={styles.empty}
          />
        ) : (
          <Row gutter={[24, 24]}>
            {classes.map((cls) => (
              <Col key={cls._id} xs={24} sm={12} xl={8}>
                <Card
                  hoverable
                  style={{
                    ...styles.card,
                    ...(cls.status === 'ACTIVE' ? styles.cardActive : {}),
                  }}
                  styles={{ body: styles.cardBody }}
                >
                  <div style={styles.cardContent}>
                    <Title level={5} style={styles.cardTitle}>
                      {cls.name}
                    </Title>
                    {cls.course && (
                      <Text type="secondary" style={styles.courseName}>
                        <BookOutlined style={{ marginRight: 6 }} />
                        {cls.course.name}
                      </Text>
                    )}
                    {cls.teacher && (
                      <Text type="secondary" style={styles.teacherName}>
                        GV: {cls.teacher.fullName}
                      </Text>
                    )}
                    <div style={styles.meta}>
                      <Tag color={CLASS_STATUS_COLORS[cls.status] ?? 'default'}>
                        {CLASS_STATUS_LABELS[cls.status] ?? cls.status}
                      </Tag>
                      {cls.totalSessions != null && (
                        <Text type="secondary" style={styles.sessionsText}>
                          {cls.totalSessions} buổi
                        </Text>
                      )}
                    </div>
                    <Button
                      type="primary"
                      block
                      style={styles.button}
                      onClick={() => navigate(`/my-classes/${cls._id}`)}
                    >
                      Xem chi tiết
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </SectionLayout>
  );
};

export default MyClassesPage;

const styles: Record<string, CSSProperties> = {
  sectionLayout: {
    minHeight: '100vh',
    background: 'radial-gradient(circle at top, #0f172a 0, #020617 45%, #000 100%)',
  },
  container: {
    padding: '24px 0 48px',
    maxWidth: 1200,
    margin: '0 auto',
  },
  heroCard: {
    marginBottom: 32,
    borderRadius: 20,
    padding: 0,
    background: 'linear-gradient(135deg, #0f172a 0%, #111827 40%, #1f2937 100%)',
    color: '#e5e7eb',
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    gap: 24,
  },
  heroLeft: {
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  heroRight: {
    padding: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBreadcrumb: {
    fontSize: 12,
    color: '#9ca3af',
  },
  heroTitle: {
    margin: 0,
    color: '#f9fafb',
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#d1d5db',
  },
  heroHighlight: {
    color: '#38bdf8',
    fontWeight: 600,
  },
  heroNextClass: {
    fontSize: 13,
    color: '#e5e7eb',
  },
  heroActions: {
    marginTop: 12,
    display: 'flex',
    flexWrap: 'wrap',
    gap: 12,
  },
  heroStatsCard: {
    minWidth: 220,
    padding: 16,
    borderRadius: 16,
    background: 'rgba(15,23,42,0.9)',
    border: '1px solid rgba(148,163,184,0.4)',
    boxShadow: '0 18px 40px rgba(15,23,42,0.8)',
  },
  heroStatsLabel: {
    fontSize: 12,
    color: '#9ca3af',
  },
  heroStatsValue: {
    margin: '4px 0 8px',
    color: '#e5e7eb',
  },
  heroStatsRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    fontSize: 12,
    color: '#9ca3af',
  },
  heroChartWrapper: {
    marginTop: 8,
    height: 70,
  },
  chartTooltip: {
    backgroundColor: '#020617',
    border: '1px solid #38bdf8',
    borderRadius: 8,
    fontSize: 12,
  },
  statusCard: {
    borderRadius: 16,
    marginBottom: 24,
    background: 'rgba(15,23,42,0.9)',
    border: '1px solid rgba(148,163,184,0.5)',
  },
  statusTitle: {
    margin: '0 0 8px',
  },
  segmentBar: {
    display: 'flex',
    gap: 2,
    marginTop: 8,
    marginBottom: 4,
  },
  segment: {
    flex: 1,
    height: 10,
    borderRadius: 999,
    backgroundColor: '#e5e7eb',
  },
  statusLegend: {
    fontSize: 12,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    background: 'rgba(15,23,42,0.95)',
    border: '1px solid rgba(148,163,184,0.4)',
    boxShadow: '0 18px 40px rgba(15,23,42,0.8)',
  },
  cardBody: {
    padding: 18,
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  cardTitle: {
    margin: 0,
    fontWeight: 600,
  },
  courseName: {
    display: 'block',
    fontSize: 13,
  },
  teacherName: {
    display: 'block',
    fontSize: 13,
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  sessionsText: {
    fontSize: 12,
  },
  button: {
    marginTop: 16,
  },
  empty: {
    padding: 64,
    color: '#e5e7eb',
  },
  cardActive: {
    borderColor: '#38bdf8',
    boxShadow: '0 0 0 1px rgba(56,189,248,0.7), 0 18px 40px rgba(8,47,73,0.9)',
  },
};
