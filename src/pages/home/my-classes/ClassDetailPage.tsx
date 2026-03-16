import {
  ArrowLeftOutlined,
  BookOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  ForwardOutlined,
  MinusCircleOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Button,
  Card,
  Descriptions,
  Drawer,
  Empty,
  Progress,
  Select,
  Skeleton,
  Tabs,
  Tag,
  Typography,
} from 'antd';
import React, { CSSProperties, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MarkdownViewer from '../../../components/common/MarkdownViewer';
import { localStorageConfig } from '../../../config';
import SectionLayout from '../../../layouts/SectionLayout';
import { RootState, useSelector } from '../../../redux/store';
import { studentClassService } from '../../../services/studentClassService';
import type {
  ClassDetail,
  MyAttendanceRecord,
  SessionItem,
  SessionNote,
} from '../../../types/class';
const { Title, Text } = Typography;

const CLASS_STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Đang hoạt động',
  FINISHED: 'Kết thúc',
  PENDING: 'Chờ',
};

type ProgressState = 'done' | 'next' | 'upcoming';

function HtmlContent({ html }: { html: string }) {
  if (!html || !html.trim()) return <Text type="secondary">Chưa có nội dung.</Text>;
  if (html.trim().startsWith('<')) {
    return <div dangerouslySetInnerHTML={{ __html: html }} style={{ lineHeight: 1.6 }} />;
  }
  return <MarkdownViewer content={html} />;
}

const ClassDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [detail, setDetail] = useState<ClassDetail | null>(null);
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [myAttendances, setMyAttendances] = useState<MyAttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [sessionNote, setSessionNote] = useState<SessionNote | null>(null);
  const [noteLoading, setNoteLoading] = useState(false);
  const [lessonDrawerOpen, setLessonDrawerOpen] = useState(false);
  const [lessonSessionId, setLessonSessionId] = useState<string | null>(null);
  const [lessonContent, setLessonContent] = useState<{ title: string; notesMd?: string } | null>(null);
  const [lessonLoading, setLessonLoading] = useState(false);

  const loadNote = useCallback(
    async (sessionId: string) => {
      if (!id) return;
      setNoteLoading(true);
      try {
        const note = await studentClassService.getSessionNote(id, sessionId);
        setSessionNote(note);
      } catch {
        setSessionNote({ sessionContent: '', homework: '', studentComments: [] });
      } finally {
        setNoteLoading(false);
      }
    },
    [id],
  );

  useEffect(() => {
    const hasToken =
      typeof window !== 'undefined'
        ? !!localStorage.getItem(localStorageConfig.accessToken)
        : false;

    if (!hasToken) {
      navigate('/login', { replace: true });
      return;
    }
    if (!id) {
      setError('Thiếu mã lớp.');
      setLoading(false);
      return;
    }
    if (!user) {
      // Đợi Header load getUser xong rồi mới fetch
      return;
    }
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const [detailRes, sessionsRes, attendancesRes] = await Promise.all([
          studentClassService.getClassDetail(id),
          studentClassService.getClassSessions(id),
          studentClassService.getMyAttendances(id),
        ]);
        setDetail(detailRes);
        setSessions(Array.isArray(sessionsRes) ? sessionsRes : []);
        setMyAttendances(Array.isArray(attendancesRes) ? attendancesRes : []);
      } catch (err: any) {
        const msg =
          err?.response?.status === 403
            ? 'Bạn không có quyền xem lớp này.'
            : err?.response?.status === 404
              ? 'Không tìm thấy lớp.'
              : 'Không tải được thông tin lớp.';
        setError(msg);
        setDetail(null);
        setSessions([]);
        setMyAttendances([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user, id, navigate]);

  useEffect(() => {
    if (selectedSessionId && id) {
      loadNote(selectedSessionId);
    } else {
      setSessionNote(null);
    }
  }, [selectedSessionId, id, loadNote]);

  const openLessonDrawer = useCallback(async (sessionId: string) => {
    setLessonSessionId(sessionId);
    setLessonDrawerOpen(true);
    setLessonContent(null);
    setLessonLoading(true);
    try {
      const data = await studentClassService.getSessionContent(sessionId);
      if (data) {
        setLessonContent({
          title: data.title,
          notesMd: data.notesMd?.notesMd ?? '',
        });
      } else {
        setLessonContent({ title: 'Bài học', notesMd: '' });
      }
    } catch {
      setLessonContent({ title: 'Bài học', notesMd: '' });
    } finally {
      setLessonLoading(false);
    }
  }, []);

  const attendanceBySessionId = Object.fromEntries(
    (myAttendances || []).map((a) => [a.sessionId, a.status]),
  );
  const scheduleSlots = detail?.scheduleSlots ?? [];
  const attendedSet = new Set<string>(['PRESENT', 'LATE']);
  const progressStates: ProgressState[] = (() => {
    const sess = sessions || [];
    let nextIndex = -1;
    const now = new Date();
    return sess.map((s, idx) => {
      const status = attendanceBySessionId[s._id] ?? 'NOT_MARKED';
      const hasAttendance = attendedSet.has(status);
      const slot = scheduleSlots[idx];
      let isPast = false;
      if (slot?.date && (slot.timeEnd || slot.timeStart)) {
        const endTime = slot.timeEnd || slot.timeStart;
        const endStr = `${slot.date}T${endTime}:00`;
        const slotEnd = new Date(endStr);
        if (!Number.isNaN(slotEnd.getTime())) {
          isPast = slotEnd < now;
        }
      }
      const effectiveDone = hasAttendance || isPast;
      if (!effectiveDone && nextIndex === -1) nextIndex = idx;
      return effectiveDone ? 'done' : nextIndex === idx ? 'next' : 'upcoming';
    });
  })();
  const progressPercent = (() => {
    const sess = sessions || [];
    if (sess.length === 0) return 0;
    const now = new Date();
    let doneCount = 0;
    sess.forEach((s, idx) => {
      const status = attendanceBySessionId[s._id] ?? 'NOT_MARKED';
      const hasAttendance = attendedSet.has(status);
      const slot = scheduleSlots[idx];
      let isPast = false;
      if (slot?.date && (slot.timeEnd || slot.timeStart)) {
        const endTime = slot.timeEnd || slot.timeStart;
        const endStr = `${slot.date}T${endTime}:00`;
        const slotEnd = new Date(endStr);
        if (!Number.isNaN(slotEnd.getTime())) {
          isPast = slotEnd < now;
        }
      }
      if (hasAttendance || isPast) doneCount += 1;
    });
    return Math.round((doneCount / sess.length) * 100);
  })();

  if (!user) return null;

  if (loading || !id) {
    return (
      <SectionLayout title="Chi tiết lớp">
        <Skeleton active paragraph={{ rows: 6 }} />
      </SectionLayout>
    );
  }

  if (error || !detail) {
    return (
      <SectionLayout title="Chi tiết lớp">
        <Alert
          type="error"
          showIcon
          message={error ?? 'Không tìm thấy lớp'}
          description="Vui lòng kiểm tra lại hoặc quay lại danh sách lớp."
          action={
            <Button type="primary" onClick={() => navigate('/my-classes')}>
              Quay lại danh sách lớp
            </Button>
          }
        />
      </SectionLayout>
    );
  }

  const doneSessionsCount = progressStates.filter((st) => st === 'done').length;
  const nextSessionIndex = progressStates.findIndex((st) => st === 'next');
  const currentSessionIndex =
    doneSessionsCount > 0
      ? progressStates.findIndex((st, idx) => st === 'done' && idx === doneSessionsCount - 1)
      : -1;
  const currentSession =
    currentSessionIndex >= 0 && sessions[currentSessionIndex] ? sessions[currentSessionIndex] : sessions[0];

  const tab1 = (
    <div style={styles.overviewWrapper}>
      {/* Hero / Welcome section */}
      <Card bordered={false} style={styles.heroCard}>
        <div style={styles.heroLeft}>
          <Text type="secondary" style={styles.heroBreadcrumb}>
            Lớp học / {detail.course?.name ?? 'Khoá học'} / {detail.name}
          </Text>
          <Title level={3} style={styles.heroTitle}>
            Xin chào, {user?.fullName || 'bạn'} 👋
          </Title>
          <Text style={styles.heroSubtitle}>
            Bạn đã hoàn thành{' '}
            <span style={styles.heroHighlight}>{progressPercent}%</span> lộ trình{' '}
            {detail.course?.name ?? 'khóa học này'}.
          </Text>
          <div style={styles.heroMetaRow}>
            <span style={styles.heroMetaItem}>
              <strong>{doneSessionsCount}</strong> / {sessions.length || detail.totalSessions || 0} buổi
            </span>
            {currentSession && (
              <span style={styles.heroMetaItem}>
                Buổi hiện tại:{' '}
                <strong>
                  {progressStates.indexOf('next') > 0
                    ? progressStates.indexOf('next')
                    : doneSessionsCount || 1}
                  .
                </strong>{' '}
                {currentSession.title}
              </span>
            )}
          </div>
          <div style={styles.heroActions}>
            <Button
              type="primary"
              size="large"
              onClick={() => {
                const targetId =
                  nextSessionIndex >= 0 && sessions[nextSessionIndex]
                    ? sessions[nextSessionIndex]._id
                    : currentSession?._id;
                if (targetId) {
                  window.open(`/course/document/${targetId}`, '_blank', 'noopener,noreferrer');
                }
              }}
            >
              Tiếp tục học ngay
            </Button>
            <Button
              size="large"
              onClick={() => {
                // chuyển sang tab Tiến độ & Bài học
                const tabs = document.querySelector('[role=\"tablist\"]');
                if (tabs) {
                  (tabs.querySelector('[data-node-key=\"2\"]') as HTMLElement | null)?.click();
                }
              }}
            >
              Xem lộ trình
            </Button>
          </div>
        </div>
        <div style={styles.heroRight}>
          <div style={styles.heroCircle}>
            <span style={styles.heroCirclePercent}>{progressPercent}%</span>
            <span style={styles.heroCircleLabel}>
              {doneSessionsCount}/{sessions.length || detail.totalSessions || 0} buổi
            </span>
          </div>
        </div>
      </Card>

      {/* 2-column layout */}
      <div style={styles.mainGrid}>
        {/* Left column */}
        <div style={styles.mainLeft}>
          <Card size="small" style={styles.card}>
            <Title level={5} style={styles.sectionTitle}>
              Thống kê học tập
            </Title>
            <div style={styles.statsRow}>
              <div style={styles.statItem}>
                <Text type="secondary">Số buổi đã học</Text>
                <Title level={4} style={styles.statValue}>
                  {doneSessionsCount}
                </Title>
              </div>
              <div style={styles.statItem}>
                <Text type="secondary">Số buổi còn lại</Text>
                <Title level={4} style={styles.statValue}>
                  {(sessions.length || detail.totalSessions || 0) - doneSessionsCount}
                </Title>
              </div>
              <div style={styles.statItem}>
                <Text type="secondary">Số buổi dự kiến</Text>
                <Title level={4} style={styles.statValue}>
                  {detail.totalSessions ?? sessions.length}
                </Title>
              </div>
            </div>
          </Card>

          <Card size="small" style={styles.card}>
            <Title level={5} style={styles.sectionTitle}>
              Lộ trình khóa học
            </Title>
            <div style={styles.segmentBar}>
              {(sessions.length ? sessions : Array.from({ length: detail.totalSessions || 0 })).map(
                (_s, idx) => {
                  const state = progressStates[idx] ?? 'upcoming';
                  return (
                    <div
                      key={idx}
                      style={{
                        ...styles.segment,
                        ...(state === 'done'
                          ? styles.segmentDone
                          : state === 'next'
                          ? styles.segmentNext
                          : styles.segmentUpcoming),
                      }}
                    />
                  );
                },
              )}
            </div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Màu xanh: đã học · Xanh dương: buổi kế tiếp · Xám: chưa học
            </Text>
          </Card>
        </div>

        {/* Right column */}
        <div style={styles.mainRight}>
          <Card size="small" style={styles.card}>
            <Title level={5} style={styles.sectionTitle}>
              Thông tin lớp học
            </Title>
            <Descriptions column={1} size="small" colon={false}>
              <Descriptions.Item label="Tên lớp">{detail.name}</Descriptions.Item>
              <Descriptions.Item label="Khoá học">
                {detail.course?.name ?? detail.courseId ?? '—'}
              </Descriptions.Item>
              <Descriptions.Item label="Giảng viên">
                {detail.teacher?.fullName ?? '—'}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={detail.status === 'ACTIVE' ? 'green' : 'default'}>
                  {CLASS_STATUS_LABELS[detail.status] ?? detail.status}
                </Tag>
              </Descriptions.Item>
              {detail.scheduleFrequency != null && (
                <Descriptions.Item label="Tần suất">
                  Tuần {detail.scheduleFrequency} buổi
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>

          <Card size="small" style={styles.card}>
            <Title level={5} style={styles.sectionTitle}>
              Buổi học sắp tới
            </Title>
            {nextSessionIndex >= 0 &&
            sessions[nextSessionIndex] &&
            scheduleSlots[nextSessionIndex] ? (
              <>
                <Text strong>
                  Buổi {nextSessionIndex + 1}: {sessions[nextSessionIndex].title}
                </Text>
                <div style={{ marginTop: 4 }}>
                  <Text type="secondary">
                    {scheduleSlots[nextSessionIndex].date} ·{' '}
                    {scheduleSlots[nextSessionIndex].timeStart} –{' '}
                    {scheduleSlots[nextSessionIndex].timeEnd}
                  </Text>
                </div>
              </>
            ) : (
              <Text type="secondary">Chưa có lịch buổi tiếp theo.</Text>
            )}
          </Card>
        </div>
      </div>
    </div>
  );

  const progressLabels: Record<ProgressState, { label: string; icon: React.ReactNode; color: string }> = {
    done: { label: 'Đã học', icon: <CheckCircleOutlined />, color: '#52c41a' },
    next: { label: 'Buổi tới', icon: <ForwardOutlined />, color: '#1677ff' },
    upcoming: { label: 'Chưa học', icon: <MinusCircleOutlined />, color: '#8c8c8c' },
  };

  const tab2 = (
    <div style={styles.tabProgress}>
      <Card size="small" style={styles.card}>
        <div style={styles.progressHeader}>
          <Text strong>Tiến độ học</Text>
          <Progress percent={progressPercent} size="small" style={{ width: 120 }} />
        </div>
      </Card>
      {sessions.length === 0 ? (
        <Empty description="Chưa có buổi học" style={{ marginTop: 24 }} />
      ) : (
        <div style={styles.sessionList}>
          {sessions.map((s, idx) => {
            const state = progressStates[idx] ?? 'upcoming';
            const slot = scheduleSlots[idx];
            const { label, icon, color } = progressLabels[state];
            return (
              <Card
                key={s._id}
                size="small"
                style={{
                  ...styles.sessionCard,
                  borderLeftColor: color,
                  borderLeftWidth: 4,
                }}
              >
                <div style={styles.sessionCardInner}>
                  <div style={styles.sessionCardLeft}>
                    <span style={{ ...styles.sessionBadge, color, marginRight: 12 }}>
                      {icon} {label}
                    </span>
                    <div>
                      <Text strong>Buổi {idx + 1}: {s.title}</Text>
                      {slot && (
                        <div style={styles.sessionMeta}>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {slot.date} · {slot.timeStart} – {slot.timeEnd}
                          </Text>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    type="link"
                    size="small"
                    icon={<BookOutlined />}
                    onClick={() => {
                      // Mở nội dung bài học ở tab mới, giữ nguyên trang lớp học
                      window.open(`/course/document/${s._id}`, '_blank', 'noopener,noreferrer');
                    }}
                    style={styles.viewLessonBtn}
                  >
                    Xem bài học
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );

  const tab3 = (
    <Card size="small" style={styles.card}>
      <div style={{ marginBottom: 16 }}>
        <Text strong>Chọn buổi: </Text>
        <Select
          placeholder="Chọn buổi học"
          allowClear
          style={{ width: 280 }}
          value={selectedSessionId ?? undefined}
          onChange={(v) => setSelectedSessionId(v ?? null)}
          options={sessions.map((s, idx) => ({
            label: `Buổi ${idx + 1}: ${s.title}`,
            value: s._id,
          }))}
        />
      </div>
      {noteLoading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : sessionNote ? (
        <div>
          <Title level={5}>Bài tập về nhà</Title>
          <HtmlContent html={sessionNote.homework} />
        </div>
      ) : selectedSessionId ? null : (
        <Text type="secondary">Chọn một buổi để xem bài tập về nhà.</Text>
      )}
    </Card>
  );

  const tab4 = (
    <Card size="small" style={styles.card}>
      <div style={{ marginBottom: 16 }}>
        <Text strong>Chọn buổi: </Text>
        <Select
          placeholder="Chọn buổi học"
          allowClear
          style={{ width: 280 }}
          value={selectedSessionId ?? undefined}
          onChange={(v) => setSelectedSessionId(v ?? null)}
          options={sessions.map((s, idx) => ({
            label: `Buổi ${idx + 1}: ${s.title}`,
            value: s._id,
          }))}
        />
      </div>
      {noteLoading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : sessionNote ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div>
            <Title level={5}>Tổng kết buổi học</Title>
            <HtmlContent html={sessionNote.sessionContent} />
          </div>
          {sessionNote.studentComments?.length > 0 ? (
            <div>
              <Title level={5}>Nhận xét dành cho bạn</Title>
              <HtmlContent html={sessionNote.studentComments[0].comment} />
            </div>
          ) : (
            <Text type="secondary">Chưa có nhận xét cho bạn ở buổi này.</Text>
          )}
        </div>
      ) : selectedSessionId ? null : (
        <Text type="secondary">Chọn một buổi để xem tổng kết và nhận xét.</Text>
      )}
    </Card>
  );

  return (
    <SectionLayout title={detail.name} style={styles.sectionLayout}>
      <div style={styles.container}>
        <div style={styles.header}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/my-classes')}
            style={styles.backBtn}
          >
            Quay lại
          </Button>
        </div>

        <Tabs
          defaultActiveKey="1"
          size="large"
          tabBarGutter={32}
          animated
          tabBarStyle={styles.tabBar}
          items={[
            {
              key: '1',
              label: (
                <span>
                  <FileTextOutlined /> Thông tin chung
                </span>
              ),
              children: tab1,
            },
            {
              key: '2',
              label: (
                <span>
                  <CheckCircleOutlined /> Tiến độ & Bài học
                </span>
              ),
              children: tab2,
            },
            {
              key: '3',
              label: (
                <span>
                  <BookOutlined /> Bài tập về nhà
                </span>
              ),
              children: tab3,
            },
            {
              key: '4',
              label: (
                <span>
                  <TeamOutlined /> Nhận xét của giảng viên
                </span>
              ),
              children: tab4,
            },
          ]}
        />
      </div>

      <Drawer
        title={lessonContent?.title ?? 'Bài học'}
        placement="right"
        width="min(100%, 560)"
        onClose={() => {
          setLessonDrawerOpen(false);
          setLessonSessionId(null);
          setLessonContent(null);
        }}
        open={lessonDrawerOpen}
        styles={{ body: { paddingTop: 16 } }}
      >
        {lessonLoading ? (
          <Skeleton active paragraph={{ rows: 8 }} />
        ) : lessonContent ? (
          <div className="markdown-viewer" style={styles.lessonBody}>
            {lessonContent.notesMd ? (
              <MarkdownViewer content={lessonContent.notesMd} />
            ) : (
              <Text type="secondary">Chưa có nội dung bài học.</Text>
            )}
          </div>
        ) : null}
      </Drawer>
    </SectionLayout>
  );
};

export default ClassDetailPage;

const styles: Record<string, CSSProperties> = {
  sectionLayout: {
    minHeight: '100vh',
  },
  container: {
    padding: '24px 0',
  },
  header: {
    marginBottom: 24,
  },
  backBtn: {
    marginBottom: 8,
    paddingLeft: 0,
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    margin: 0,
    fontWeight: 600,
  },
  tabBar: {
    marginBottom: 16,
    borderBottom: '1px solid #e5e7eb',
    paddingInline: 4,
  },
  card: {
    borderRadius: 12,
  },
  tabProgress: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  progressHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  sessionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    marginTop: 8,
  },
  sessionCard: {
    borderRadius: 12,
    borderLeft: '4px solid #d9d9d9',
  },
  sessionCardInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  sessionCardLeft: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  sessionBadge: {
    fontSize: 13,
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
  sessionMeta: {
    marginTop: 4,
  },
  viewLessonBtn: {
    paddingLeft: 0,
  },
  lessonBody: {
    lineHeight: 1.7,
  },
  overviewWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  heroCard: {
    borderRadius: 20,
    padding: 0,
    background: 'linear-gradient(135deg, #0f172a 0%, #111827 50%, #1f2937 100%)',
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
    gap: 12,
    flex: 1,
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
    fontWeight: 600,
    color: '#38bdf8',
  },
  heroMetaRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 4,
    color: '#9ca3af',
    fontSize: 13,
  },
  heroMetaItem: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
  },
  heroActions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },
  heroCircle: {
    width: 130,
    height: 130,
    borderRadius: '50%',
    border: '6px solid rgba(56,189,248,0.4)',
    boxShadow: '0 0 25px rgba(56,189,248,0.5)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background:
      'conic-gradient(from 225deg, rgba(56,189,248,0.9), rgba(129,140,248,0.9), rgba(236,72,153,0.8))',
    color: '#f9fafb',
  },
  heroCirclePercent: {
    fontSize: 26,
    fontWeight: 700,
  },
  heroCircleLabel: {
    fontSize: 12,
    opacity: 0.9,
  },
  mainGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 16,
  },
  mainLeft: {
    flex: 3,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  mainRight: {
    flex: 2,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  sectionTitle: {
    margin: '0 0 8px',
  },
  statsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    flex: 1,
    minWidth: 120,
  },
  statValue: {
    margin: 0,
  },
  segmentBar: {
    display: 'flex',
    gap: 2,
    marginTop: 8,
    marginBottom: 4,
  },
  segment: {
    flex: 1,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#e5e7eb',
  },
  segmentDone: {
    background: 'linear-gradient(90deg, #22c55e, #16a34a)',
  },
  segmentNext: {
    background: 'linear-gradient(90deg, #38bdf8, #6366f1)',
  },
  segmentUpcoming: {
    backgroundColor: '#e5e7eb',
  },
};
