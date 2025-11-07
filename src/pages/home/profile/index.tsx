import React, { CSSProperties, useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Empty,
  List,
  Modal,
  Progress,
  Row,
  Space,
  Statistic,
  Tag,
  Typography,
} from "antd";
import {
  BarChartOutlined,
  BookOutlined,
  CalendarOutlined,
  EditOutlined,
  HomeOutlined,
  MailOutlined,
  PhoneOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import SectionLayout from "../../../layouts/SectionLayout";
import { RootState, useDispatch, useSelector } from "../../../redux/store";
import { getMyCourses } from "../../../redux/slices/courses";
import { updateUser } from "../../../redux/slices/auth";
import UpdateProfile from "./UpdateProfile";
import { MyCourseResponse } from "../../../types/course";
import { UserType } from "../../../types/user";

const { Title, Text, Paragraph } = Typography;

type LocationNameState = {
  province?: string;
  district?: string;
  ward?: string;
};

type ProfileUpdatePayload = Partial<Omit<UserType, "_id" | "email" | "password" | "createdAt" | "updatedAt">>;

const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const { user, loading: authLoading } = useSelector((state: RootState) => state.auth);
  const { myCourses, loading: coursesLoading } = useSelector((state: RootState) => state.courses);
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [locationNames, setLocationNames] = useState<LocationNameState>({});

  useEffect(() => {
    if (!user) return;
    if (id && id !== user._id) {
      // TODO: load other user profile when API is available
      return;
    }
    dispatch(getMyCourses());
  }, [dispatch, id, user?._id]);

  useEffect(() => {
    if (!user?.address) {
      setLocationNames({});
      return;
    }

    let ignore = false;

    const fetchLocationNames = async () => {
      try {
        const provincesResponse = await fetch("https://esgoo.net/api-tinhthanh/1/0.htm");
        const provincesJson = await provincesResponse.json();
        const provinceName = provincesJson?.data?.find((item: any) => item.id === user.address?.province)?.name;

        let districtName: string | undefined;
        let wardName: string | undefined;

        if (user.address?.province) {
          const districtsResponse = await fetch(`https://esgoo.net/api-tinhthanh/2/${user.address.province}.htm`);
          const districtsJson = await districtsResponse.json();
          districtName = districtsJson?.data?.find((item: any) => item.id === user.address?.district)?.name;

          if (user.address?.district) {
            const wardsResponse = await fetch(`https://esgoo.net/api-tinhthanh/3/${user.address.district}.htm`);
            const wardsJson = await wardsResponse.json();
            wardName = wardsJson?.data?.find((item: any) => item.id === user.address?.ward)?.name;
          }
        }

        if (!ignore) {
          setLocationNames({
            province: provinceName || user.address?.province,
            district: districtName || user.address?.district,
            ward: wardName || user.address?.ward,
          });
        }
      } catch (_) {
        if (!ignore) {
          setLocationNames({
            province: user.address?.province,
            district: user.address?.district,
            ward: user.address?.ward,
          });
        }
      }
    };

    fetchLocationNames();

    return () => {
      ignore = true;
    };
  }, [user?.address?.province, user?.address?.district, user?.address?.ward, user?.address]);

  useEffect(() => {
    const styleId = "profile-page-dynamic-style";
    if (document.getElementById(styleId)) return;

    const styleElement = document.createElement("style");
    styleElement.id = styleId;
    styleElement.innerText = `
      .profile-primary-card:hover {
        box-shadow: 0 16px 30px rgba(0, 0, 0, 0.45), 0 0 18px rgba(78, 205, 196, 0.25);
        transform: translateY(-4px);
      }

      .profile-edit-btn:hover {
        background: #059669 !important;
        box-shadow: 0 12px 20px rgba(5, 150, 105, 0.35);
        transform: translateY(-1px);
      }

      .profile-courses-card .ant-list-item {
        background: rgba(6, 36, 36, 0.75);
        border-radius: 14px;
        padding: 20px;
        margin-bottom: 16px;
        border: 1px solid rgba(78, 205, 196, 0.12);
      }

      .profile-courses-card .ant-list-item:hover {
        border-color: rgba(78, 205, 196, 0.35);
        box-shadow: 0 12px 20px rgba(0, 0, 0, 0.35);
      }

      .profile-stats-card .ant-statistic-title {
        color: #8de3dd;
      }
    `;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const handleUpdateProfile = async (updatedData: ProfileUpdatePayload) => {
    if (!user) return;
    try {
      await dispatch(updateUser({ id: user._id, data: updatedData })).unwrap();
      setIsModalOpen(false);
    } catch (_) {
      // Notifications handled in thunk
    }
  };

  const formatDate = (value?: Date | string | null) => {
    if (!value) return "Đang cập nhật";
    try {
      return new Date(value).toLocaleDateString("vi-VN");
    } catch (error) {
      return "Đang cập nhật";
    }
  };

  const courseStats = useMemo(() => {
    if (!myCourses || myCourses.length === 0) {
      return { total: 0, completed: 0, inProgress: 0, averageProgress: 0 };
    }

    const total = myCourses.length;
    const completed = myCourses.filter((course) => course.duration > 0 && course.numberOfSessionCurrent >= course.duration).length;
    const averageProgress = Math.round(
      myCourses.reduce((acc, course) => {
        const percent = course.duration > 0 ? (course.numberOfSessionCurrent / course.duration) * 100 : 0;
        return acc + Math.max(0, Math.min(100, percent));
      }, 0) / total
    );
    const inProgress = total - completed;

    return { total, completed, inProgress, averageProgress };
  }, [myCourses]);

  const renderCourseProgress = (course: MyCourseResponse) => {
    const rawProgress = course.duration > 0 ? (course.numberOfSessionCurrent / course.duration) * 100 : 0;
    const progress = Math.round(Math.max(0, Math.min(100, rawProgress)));

    return (
      <List.Item>
        <List.Item.Meta
          avatar={
            <Avatar
              shape="square"
              size={60}
              style={styles.courseAvatar}
            >
              {course.name.charAt(0).toUpperCase()}
            </Avatar>
          }
          title={
            <Space size={12} align="center">
              <Text style={styles.courseName}>{course.name}</Text>
              <Tag color="geekblue">{course.role ?? "LEARNER"}</Tag>
            </Space>
          }
          description={
            <Space direction="vertical" size={4} style={{ width: "100%" }}>
              <Text style={styles.courseMetaText}>
                <TeamOutlined /> {course.instructor?.fullName ?? "Giảng viên đang cập nhật"}
              </Text>
              <Text style={styles.courseMetaText}>
                <BookOutlined /> {course.numberOfSessionCurrent}/{course.duration} buổi đã hoàn thành
              </Text>
            </Space>
          }
        />
        <Space size={20} align="center">
          <div style={{ textAlign: "center" }}>
            <Text style={styles.progressLabel}>{progress}%</Text>
            <Progress
              type="circle"
              percent={progress}
              width={72}
              strokeColor="#4ECDC4"
              trailColor="rgba(78, 205, 196, 0.15)"
            />
          </div>
        </Space>
      </List.Item>
    );
  };

  const personalDetails = [
    {
      key: "birthday",
      label: "Ngày sinh",
      value: formatDate(user?.birthday ?? undefined),
    },
    {
      key: "gender",
      label: "Giới tính",
      value: user?.gender ?? "Đang cập nhật",
    },
    {
      key: "bio",
      label: "Tiểu sử",
      value: user?.bio?.trim() || "Chia sẻ đôi nét về bản thân bạn để mọi người hiểu hơn",
    },
  ];

  const contactDetails = [
    {
      key: "email",
      label: "Email",
      value: user?.email ?? "--",
    },
    {
      key: "phone",
      label: "Điện thoại",
      value: user?.phone ? `${user.phone.country ?? ""} ${user.phone.number ?? ""}`.trim() : "Đang cập nhật",
    },
    {
      key: "address",
      label: "Địa chỉ",
      value:
        user?.address && (locationNames.province || locationNames.district || locationNames.ward)
          ? [locationNames.ward, locationNames.district, locationNames.province]
              .filter(Boolean)
              .join(", ")
          : "Đang cập nhật",
    },
  ];

  const accountDetails = [
    {
      key: "role",
      label: "Vai trò",
      value: user?.role ?? "Đang cập nhật",
    },
    {
      key: "joined",
      label: "Ngày tham gia",
      value: formatDate(user?.createdAt ?? undefined),
    },
    {
      key: "updated",
      label: "Cập nhật gần nhất",
      value: formatDate(user?.updatedAt ?? undefined),
    },
  ];

  return (
    <SectionLayout
      style={styles.container}
      title={user ? `Hồ sơ của ${user.fullName}` : "Thông tin hồ sơ"}
    >
      <Row gutter={[24, 24]}>
        <Col xs={24} xl={16}>
          <Card className="profile-primary-card" style={styles.profileCard} loading={authLoading}>
            <Row gutter={[24, 24]} align="middle">
              <Col xs={24} sm={8} md={6} lg={8} xl={7}>
                <Avatar
                  size={140}
                  src={user?.avatar || "/images/landing/sections/fakeImages/avatarStudent.png"}
                  icon={<UserOutlined />}
                  style={styles.avatar}
                />
              </Col>
              <Col xs={24} sm={16} md={18} lg={16} xl={17}>
                <Space direction="vertical" size={8} style={{ width: "100%" }}>
                  <Title level={3} style={styles.fullName}>
                    {user?.fullName ?? "Đang cập nhật"}
                  </Title>
                  <Space size={12} wrap>
                    {user?.role && <Tag color="cyan">{user.role}</Tag>}
                    {user?.status && <Badge status="processing" text={user.status} style={styles.badgeText} />}
                  </Space>
                  <Paragraph style={styles.bioText} ellipsis={{ rows: 3 }}>
                    {user?.bio?.trim() || "Cùng xây dựng hành trình học tập cá nhân hoá tại L-Edu."}
                  </Paragraph>
                  <Space direction="horizontal" size={16} wrap style={{ marginTop: 12 }}>
                    <Space>
                      <MailOutlined style={styles.icon} />
                      <Text style={styles.infoText}>{user?.email ?? "Đang cập nhật"}</Text>
                    </Space>
                    {user?.phone && (
                      <Space>
                        <PhoneOutlined style={styles.icon} />
                        <Text style={styles.infoText}>
                          {`${user.phone.country ?? ""} ${user.phone.number ?? ""}`.trim()}
                        </Text>
                      </Space>
                    )}
                    {user?.address && (
                      <Space>
                        <HomeOutlined style={styles.icon} />
                        <Text style={styles.infoText}>
                          {[locationNames.ward, locationNames.district, locationNames.province]
                            .filter(Boolean)
                            .join(", ") || "Đang cập nhật"}
                        </Text>
                      </Space>
                    )}
                  </Space>
                </Space>
              </Col>
            </Row>
            {user && (!id || id === user._id) && (
              <Button
                type="primary"
                icon={<EditOutlined />}
                className="profile-edit-btn"
                style={styles.editButton}
                block
                onClick={() => setIsModalOpen(true)}
              >
                Cập nhật hồ sơ
              </Button>
            )}
          </Card>

          <Row gutter={[24, 24]} style={{ marginTop: 12 }}>
            <Col xs={24} md={12}>
              <Card title="Thông tin cá nhân" style={styles.secondaryCard} bordered={false}>
                <Descriptions column={1} colon={false} labelStyle={styles.descriptionLabel}>
                  {personalDetails.map((item) => (
                    <Descriptions.Item key={item.key} label={item.label}>
                      <Text style={styles.descriptionValue}>{item.value}</Text>
                    </Descriptions.Item>
                  ))}
                </Descriptions>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="Liên hệ" style={styles.secondaryCard} bordered={false}>
                <Descriptions column={1} colon={false} labelStyle={styles.descriptionLabel}>
                  {contactDetails.map((item) => (
                    <Descriptions.Item key={item.key} label={item.label}>
                      <Text style={styles.descriptionValue}>{item.value}</Text>
                    </Descriptions.Item>
                  ))}
                </Descriptions>
              </Card>
            </Col>
          </Row>

          <Card title="Khoá học đang tham gia" style={{ ...styles.secondaryCard, marginTop: 24 }} bordered={false} className="profile-courses-card">
            <List
              dataSource={myCourses || []}
              loading={coursesLoading && !myCourses}
              locale={{ emptyText: <Empty description="Bạn chưa tham gia khoá học nào" /> }}
              renderItem={renderCourseProgress}
            />
          </Card>
        </Col>

        <Col xs={24} xl={8}>
          <Card title="Tổng quan học tập" style={styles.statsCard} bordered={false} className="profile-stats-card">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic
                  title="Khoá học"
                  value={courseStats.total}
                  prefix={<BookOutlined style={styles.statIcon} />}
                  valueStyle={styles.statValue}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Hoàn thành"
                  value={courseStats.completed}
                  prefix={<BarChartOutlined style={styles.statIcon} />}
                  valueStyle={styles.statValue}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Đang học"
                  value={courseStats.inProgress}
                  prefix={<TeamOutlined style={styles.statIcon} />}
                  valueStyle={styles.statValue}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Tiến độ TB"
                  suffix="%"
                  value={courseStats.averageProgress}
                  prefix={<BarChartOutlined style={styles.statIcon} />}
                  valueStyle={styles.statValue}
                />
              </Col>
            </Row>
          </Card>

          <Card title="Tài khoản" style={{ ...styles.statsCard, marginTop: 24 }} bordered={false}>
            <Descriptions column={1} colon={false} labelStyle={styles.descriptionLabel}>
              {accountDetails.map((item) => (
                <Descriptions.Item key={item.key} label={item.label}>
                  <Text style={styles.descriptionValue}>{item.value}</Text>
                </Descriptions.Item>
              ))}
            </Descriptions>
          </Card>
        </Col>
      </Row>

      <Modal
        title={<span style={styles.modalTitle}>Cập nhật hồ sơ</span>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnClose
        bodyStyle={styles.modalBody}
        style={styles.modal}
        width={560}
      >
        {user && (
          <UpdateProfile
            user={user}
            onSubmit={handleUpdateProfile}
          />
        )}
      </Modal>
    </SectionLayout>
  );
};

export default Profile;

const styles: Record<string, CSSProperties> = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #071C1C 0%, #102E2E 45%, #071C1C 100%)",
    position: "relative",
    overflow: "hidden",
    padding: "48px 24px",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Cpath d='M0 100 Q50 50 100 100 T200 100' stroke='%234ECDC4' stroke-width='1' fill='none' opacity='0.05'/%3E%3Cpath d='M0 140 Q60 90 120 140 T240 140' stroke='%23FFFFFF' stroke-width='1' fill='none' opacity='0.02'/%3E%3C/svg%3E")`,
    backgroundSize: "380px 380px",
  },
  profileCard: {
    background: "rgba(6, 36, 36, 0.78)",
    border: "1px solid rgba(78, 205, 196, 0.25)",
    borderRadius: 20,
    padding: 28,
    boxShadow: "0 20px 35px rgba(0, 0, 0, 0.45)",
  },
  avatar: {
    backgroundColor: "#4ECDC4",
    color: "#0A2E2E",
    boxShadow: "0 12px 28px rgba(78, 205, 196, 0.35)",
  },
  fullName: {
    color: "#E0FFFF",
    margin: 0,
  },
  badgeText: {
    color: "#8de3dd",
  },
  bioText: {
    color: "#9ED5D1",
    marginBottom: 0,
  },
  infoText: {
    color: "#B0E0E6",
  },
  icon: {
    color: "#4ECDC4",
  },
  editButton: {
    marginTop: 28,
    background: "linear-gradient(45deg, #4ECDC4 0%, #1A4A4A 100%)",
    border: "none",
    color: "#042929",
    fontWeight: 600,
    padding: "14px 16px",
    borderRadius: 14,
    boxShadow: "0 18px 30px rgba(78, 205, 196, 0.25)",
  },
  secondaryCard: {
    background: "rgba(5, 28, 28, 0.82)",
    borderRadius: 18,
    border: "1px solid rgba(78, 205, 196, 0.2)",
    color: "#D0F0EF",
  },
  descriptionLabel: {
    color: "#7BD7CF",
    fontWeight: 600,
  },
  descriptionValue: {
    color: "#C8F3F0",
  },
  courseName: {
    color: "#E3FBF9",
    fontWeight: 600,
    fontSize: 16,
  },
  courseMetaText: {
    color: "#8CCECE",
  },
  courseAvatar: {
    background: "linear-gradient(135deg, rgba(78,205,196,0.85) 0%, rgba(10,46,46,0.9) 100%)",
    color: "#052020",
    fontWeight: 700,
  },
  progressLabel: {
    color: "#8de3dd",
    fontWeight: 600,
    marginBottom: 6,
    display: "block",
  },
  statsCard: {
    background: "rgba(5, 26, 26, 0.85)",
    borderRadius: 18,
    border: "1px solid rgba(78, 205, 196, 0.18)",
    color: "#E0FFFF",
  },
  statIcon: {
    color: "#4ECDC4",
    fontSize: 18,
    marginRight: 8,
  },
  statValue: {
    color: "#E3FBF9",
    fontWeight: 700,
  },
  modal: {
    background: "rgba(12, 38, 38, 0.95)",
    borderRadius: 18,
  },
  modalTitle: {
    color: "#E0FFFF",
    fontWeight: 600,
    fontSize: 18,
  },
  modalBody: {
    padding: 0,
    background: "transparent",
  },
};