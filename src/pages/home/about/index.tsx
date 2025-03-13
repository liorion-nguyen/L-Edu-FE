import { Row, Col, Typography, Card, Button, Carousel, Flex } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const AboutUs = () => {
    const navigate = useNavigate();
    const team = [
        {
            name: "Nguyễn Thanh Tùng",
            image: 'https://png.pngtree.com/png-vector/20240314/ourmid/pngtree-cartoon-of-thai-male-teacher-holding-a-stick-in-front-of-png-image_11960362.png',
            description: "Là một lập trình viên tại L Edu, Nguyễn Thanh Tùng có nhiều năm kinh nghiệm trong phát triển web và ứng dụng. Với tư duy sáng tạo và kỹ năng chuyên môn vững vàng, anh luôn mang đến những bài giảng thực tế và dễ hiểu cho học viên.",
            link: 'https://www.facebook.com/chungg.203',
        },
        {
            name: "Trần Minh Đức",
            image: 'https://png.pngtree.com/png-vector/20240314/ourmid/pngtree-cartoon-of-thai-male-teacher-holding-a-stick-in-front-of-png-image_11960363.png',
            description: "Giảng viên Trần Minh Đức tại L Edu không chỉ có nền tảng vững chắc về công nghệ mà còn có khả năng truyền đạt xuất sắc. Anh giúp học viên tiếp cận lập trình một cách dễ dàng, từ cơ bản đến nâng cao, với nhiều ví dụ thực tế.",
            link: 'https://www.facebook.com/chungg.203',
        },
        {
            name: "Lê Thị Hồng Nhung",
            image: 'https://img.pikbest.com/png-images/qiantu/original-cute-cartoon-teacher-classroom-hand-drawn-free-buckle-element_2732027.png!sw800',
            description: "Lê Thị Hồng Nhung, Tech Lead tại L Edu, là chuyên gia trong lĩnh vực phát triển phần mềm. Với nhiều năm kinh nghiệm quản lý dự án và xây dựng hệ thống lớn, anh mang đến cho học viên những kiến thức chuyên sâu và kỹ năng thực chiến.",
            link: 'https://www.facebook.com/chungg.203',
        },
    ];
    return (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem' }}>
            <Title level={1} style={{ textAlign: "center" }}>About Us</Title>
            <Title level={4}>Welcome to our programming learning platform! 🚀</Title>
            <Paragraph>We are committed to helping you master web development, Python, and various other programming disciplines. Whether you're a beginner taking your first steps in coding or an experienced developer looking to enhance your skills, our platform provides comprehensive tutorials, hands-on projects, and expert guidance to support your journey.</Paragraph>
            <Paragraph>From building modern web applications to mastering data science with Python, we make learning interactive, practical, and accessible. Let's code, create, and innovate together! 💻✨.</Paragraph>

            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <Card
                        cover={<img alt="Our Courses" src="/images/landing/about/cover-course.png" style={{ height: 300, objectFit: 'cover' }} />}
                    >
                        <Card.Meta title="Our Courses" description="We offer a wide range of programming courses designed to equip you with the skills needed to thrive in the tech industry. Whether you want to build modern web applications, develop mobile apps, or dive into data science with Python, our structured courses provide hands-on projects, real-world applications, and in-depth knowledge.

From HTML, CSS, JavaScript, React, and Next.js to Python, AI, and backend development with NestJS, our curriculum is tailored for both beginners and advanced learners. No matter your starting point, you’ll gain practical experience and confidence in coding!" />
                        <Button type="primary" style={{ marginTop: 16 }} onClick={() => navigate('/hotels')}>
                            Learn More
                        </Button>
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card
                        cover={<img alt="Our Teachers" src="/images/landing/about/cover-teacher.png" style={{ height: 300, objectFit: 'cover' }} />}
                    >
                        <Card.Meta title="Our Teachers" description="Our instructors are experienced developers and industry professionals passionate about sharing their knowledge. With years of real-world experience in software development, they provide practical insights, best practices, and hands-on mentorship.

Each lesson is designed to be engaging and easy to follow, ensuring you learn not just the theory but also how to apply it effectively. Whether you need guidance on debugging, optimizing performance, or preparing for job interviews, our dedicated teachers are here to support you every step of the way! 🚀" />
                        <Button type="primary" style={{ marginTop: 16 }} onClick={() => navigate('/tours')}>
                            Learn More
                        </Button>
                    </Card>
                </Col>
            </Row>

            <div style={{ marginTop: 40, backgroundColor: '#f5f5f5', padding: 24, borderRadius: 8 }}>
                <Title level={2} style={{ color: '#003366', textAlign: "center" }}>Unlock Your Coding Potential</Title>
                <Paragraph>We believe that learning to code opens up endless opportunities for creativity and innovation.</Paragraph>
                <Paragraph>With expert instructors and hands-on projects, we are committed to providing high-quality programming courses, from web development to Python and beyond.</Paragraph>
            </div>


            <div style={{ marginTop: 40 }}>
                <Title level={2} style={{ textAlign: "center" }}>Meet Our Team</Title>
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

            <div style={{ marginTop: 40, backgroundColor: '#f5f5f5', padding: 24, borderRadius: 8 }}>
                <Title level={2} style={{ textAlign: "center", color: "#003366" }}>Contact Us</Title>
                <Paragraph style={{ textAlign: "center" }}>
                    Have questions? Feel free to reach out to us at <a href="mailto:liorion.nguyen@gmail.com">liorion.nguyen@gmail.com</a>
                </Paragraph>
                <Paragraph style={{ textAlign: "center" }}>
                    📍 Address: Hanoi National University of Education, Hanoi, Vietnam
                </Paragraph>
                <Paragraph style={{ textAlign: "center" }}>
                    📞 Phone: +84 123 456 789
                </Paragraph>
                <Paragraph style={{ textAlign: "center" }}>
                    🌐 Follow us on:
                    <a href="https://www.facebook.com/chungg.203" target="_blank" rel="noopener noreferrer" style={{ marginLeft: 8 }}>Facebook</a> |
                    <a href="mailto:stu715105031@hnue.edu.vn" target="_blank" rel="noopener noreferrer" style={{ marginLeft: 8 }}>Gmail</a> |
                    <a href="https://zalo.me/your-zalo-id" target="_blank" rel="noopener noreferrer" style={{ marginLeft: 8 }}>Zalo</a>
                </Paragraph>

            </div>

        </div>
    );
};

export default AboutUs;