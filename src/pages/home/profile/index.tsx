import React, { useEffect, useState } from "react";
import { Avatar, Card, Col, Row, Typography, Progress, Button, Space, Tag, Divider, Modal } from "antd";
import { EditOutlined, MailOutlined, PhoneOutlined, HomeOutlined, CalendarOutlined, UserOutlined, DashboardOutlined } from "@ant-design/icons";
import { CSSProperties } from "react";
import { RootState, useSelector, dispatch } from "../../../redux/store";
import SectionLayout from "../../../layouts/SectionLayout";
import { useParams } from "react-router-dom";
import UpdateProfile from "./UpdateProfile";
import ItemLayout from "../../../layouts/ItemLayout";
// import { updateUser } from "../../../redux/slices/auth"; 

const { Title, Text } = Typography;

// Mock enrolled courses data
const enrolledCourses = [
    {
        name: "Website Basic (T4)",
        progress: 75,
        instructor: "Jane Smith",
        duration: "8 weeks",
    },
    {
        name: "React Native (THU 2)",
        progress: 40,
        instructor: "Michael Brown",
        duration: "6 weeks",
    },
];

const Profile: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const { id } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (user && id !== user._id) {
            // Fetch user data if viewing another user's profile (not implemented here)
        }
    }, [id, user]);

    const handleUpdateProfile = (updatedData: any) => {
        if (user) {
            //   dispatch(updateUser(user._id, updatedData)); // Update user in Redux store
            setIsModalOpen(false); // Close the modal after updating
        }
    };

    return (
        <SectionLayout style={styles.container} title={user ? `${user.fullName}'s Profile` : "Profile"}>
            <Row gutter={[32, 32]} justify="center">
                {/* Profile Card */}
                <Col xs={24} md={12} style={{ height: "100%" }}>
                    {user && (
                        <Card style={styles.profileCard}>
                            <Row gutter={[16, 16]} align="middle">
                                <Col>
                                    <Avatar
                                        size={120}
                                        src={user.avatar || "/images/landing/sections/fakeImages/avatarStudent.png"}
                                        icon={<UserOutlined />}
                                        style={styles.avatar}
                                    />
                                </Col>
                                <Col>
                                    <Title level={3} style={styles.fullName}>
                                        {user.fullName}
                                    </Title>
                                    <Tag color="#4ECDC4" style={styles.roleTag}>
                                        {user.role}
                                    </Tag>
                                </Col>
                            </Row>
                            <Divider style={styles.divider} />
                            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                                <Text style={styles.infoText}>
                                    <MailOutlined style={styles.icon} /> {user.email}
                                </Text>
                                {user.phone && (
                                    <Text style={styles.infoText}>
                                        <PhoneOutlined style={styles.icon} /> {user.phone.country} {user.phone.number}
                                    </Text>
                                )}
                                {user.address && (
                                    <Text style={styles.infoText}>
                                        <HomeOutlined style={styles.icon} /> {user.address.ward}, {user.address.district}, {user.address.province}
                                    </Text>
                                )}
                                {user.birthday && (
                                    <Text style={styles.infoText}>
                                        <CalendarOutlined style={styles.icon} /> {new Date(user.birthday).toLocaleDateString()}
                                    </Text>
                                )}
                                {user.gender && (
                                    <Text style={styles.infoText}>
                                        <UserOutlined style={styles.icon} /> {user.gender}
                                    </Text>
                                )}
                                {user.createdAt && (
                                    <Text style={styles.infoText}>
                                        <DashboardOutlined style={styles.icon} /> {new Date(user.createdAt).toLocaleDateString()}
                                    </Text>
                                )}
                            </Space>
                            {user && id === user._id && (
                                <Button
                                    type="primary"
                                    icon={<EditOutlined />}
                                    style={styles.editButton}
                                    block
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    Edit Profile
                                </Button>
                            )}
                        </Card>
                    )}
                </Col>

                {/* Enrolled Courses */}
                <Col xs={24} md={12}>
                    {enrolledCourses.map((course, index) => (
                        <Card key={index} style={styles.courseCard}>
                            <Row gutter={[16, 16]}>
                                <Col span={24}>
                                    <Title level={4} style={styles.courseTitle}>
                                        {course.name}
                                    </Title>
                                    <Text style={styles.courseInfo}>
                                        Instructor: {course.instructor}
                                    </Text>
                                    <Text style={styles.courseInfo}>
                                        Duration: {course.duration}
                                    </Text>
                                    <Progress
                                        percent={course.progress}
                                        strokeColor="#4ECDC4"
                                        trailColor="rgba(78, 205, 196, 0.2)"
                                        style={styles.progress}
                                    />
                                </Col>
                            </Row>
                        </Card>
                    ))}
                </Col>
            </Row>

            {/* Edit Profile Modal */}
            <Modal
                title={<span style={styles.modalTitle}>Edit Profile</span>}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                bodyStyle={styles.modalBody}
                style={styles.modal}
            >
                {user && <UpdateProfile user={user} onSubmit={handleUpdateProfile} />}
            </Modal>
        </SectionLayout>
    );
};

export default Profile;

const styles: {
    container: CSSProperties;
    profileCard: CSSProperties;
    avatar: CSSProperties;
    fullName: CSSProperties;
    roleTag: CSSProperties;
    divider: CSSProperties;
    infoText: CSSProperties;
    icon: CSSProperties;
    editButton: CSSProperties;
    sectionTitle: CSSProperties;
    courseCard: CSSProperties;
    courseTitle: CSSProperties;
    courseInfo: CSSProperties;
    progress: CSSProperties;
    modal: CSSProperties;
    modalTitle: CSSProperties;
    modalBody: CSSProperties;
} = {
    container: {
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0A2E2E 0%, #1A4A4A 100%)", // Dark teal gradient
        position: "relative",
        overflow: "hidden",
        padding: "40px 20px",
        // Subtle circuit pattern in lighter teal
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M10 10h80v80H10z' fill='none' stroke='%234ECDC4' stroke-opacity='0.05' stroke-width='1'/%3E%3Cpath d='M20 20h60v60H20z' fill='none' stroke='%234ECDC4' stroke-opacity='0.05' stroke-width='1'/%3E%3C/svg%3E")`,
        backgroundSize: "200px 200px",
    },
    profileCard: {
        background: "rgba(78, 205, 196, 0.05)", // Teal undertone for glassmorphism
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(78, 205, 196, 0.2)", // Teal border
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5), 0 0 10px rgba(78, 205, 196, 0.2)", // Teal glow
        borderRadius: 16,
        padding: 20,
        transition: "box-shadow 0.3s, transform 0.3s",
    },
    avatar: {
        backgroundColor: "#4ECDC4", // Brighter teal for avatar
        color: "#0A2E2E", // Dark teal for text
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5), 0 0 10px rgba(78, 205, 196, 0.2)", // Teal glow
    },
    fullName: {
        color: "#B0E0E6", // Pale teal for text
        textShadow: "0 0 5px rgba(78, 205, 196, 0.3)", // Subtle teal glow
        margin: 0,
    },
    roleTag: {
        color: "#0A2E2E", // Dark teal for text
        border: "none",
        fontWeight: "bold",
    },
    divider: {
        background: "linear-gradient(90deg, transparent, #4ECDC4, transparent)", // Teal gradient for divider
        boxShadow: "0 0 15px rgba(78, 205, 196, 0.5)", // Glowing teal shadow
        margin: "20px 0",
    },
    infoText: {
        color: "#B0E0E6", // Pale teal for text
        fontSize: "16px",
        display: "flex",
        alignItems: "center",
        gap: 8,
    },
    icon: {
        color: "#4ECDC4", // Brighter teal for icons
    },
    editButton: {
        marginTop: 20,
        background: "linear-gradient(45deg, #4ECDC4, #1A4A4A)", // Teal gradient
        border: "none",
        color: "#B0E0E6", // Pale teal for text
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5), 0 0 10px rgba(78, 205, 196, 0.2)", // Teal glow
        transition: "box-shadow 0.3s",
    },
    sectionTitle: {
        color: "#B0E0E6", // Pale teal for text
        textShadow: "0 0 5px rgba(78, 205, 196, 0.3)", // Subtle teal glow
        marginBottom: 20,
    },
    courseCard: {
        background: "rgba(78, 205, 196, 0.05)", // Teal undertone for glassmorphism
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(78, 205, 196, 0.2)", // Teal border
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5), 0 0 10px rgba(78, 205, 196, 0.2)", // Teal glow
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        transition: "box-shadow 0.3s, transform 0.3s",
    },
    courseTitle: {
        color: "#B0E0E6", // Pale teal for text
        textShadow: "0 0 5px rgba(78, 205, 196, 0.3)", // Subtle teal glow
        margin: 0,
    },
    courseInfo: {
        color: "#B0E0E6", // Pale teal for text
        display: "block",
        marginBottom: 8,
    },
    progress: {
        marginTop: 10,
    },
    modal: {
        background: "linear-gradient(135deg, #0A2E2E 0%, #1A4A4A 100%)", // Dark teal gradient
    },
    modalTitle: {
        color: "#B0E0E6", // Pale teal for title
        textShadow: "0 0 5px rgba(78, 205, 196, 0.3)", // Subtle teal glow
    },
    modalBody: {
        background: "linear-gradient(135deg, #0A2E2E 0%, #1A4A4A 100%)", // Dark teal gradient
        position: "relative",
        overflow: "hidden",
        // Subtle circuit pattern in lighter teal
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M10 10h80v80H10z' fill='none' stroke='%234ECDC4' stroke-opacity='0.05' stroke-width='1'/%3E%3Cpath d='M20 20h60v60H20z' fill='none' stroke='%234ECDC4' stroke-opacity='0.05' stroke-width='1'/%3E%3C/svg%3E")`,
        backgroundSize: "200px 200px",
    },
};

// Add hover effects and animations using CSS
const styleSheetProfile = document.createElement("style");
styleSheetProfile.innerText = `
  .profile-card:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6), 0 0 15px rgba(78, 205, 196, 0.4);
    transform: translateY(-5px);
  }
  .course-card:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6), 0 0 15px rgba(78, 205, 196, 0.4);
    transform: translateY(-5px);
  }
  .edit-button:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6), 0 0 15px rgba(78, 205, 196, 0.4);
  }
  .divider::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(78, 205, 196, 0.7), transparent);
    animation: glow 3s infinite;
  }
  @keyframes glow {
    0% {
      left: -100%;
    }
    50% {
      left: 100%;
    }
    100% {
      left: -100%;
    }
  }
`;
document.head.appendChild(styleSheetProfile);