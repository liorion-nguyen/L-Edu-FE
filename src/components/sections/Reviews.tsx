import { Col, Row, Space, Typography } from "antd";
import Title from "antd/es/typography/Title";
import SectionLayout from "../../layouts/SectionLayout";
import React, { CSSProperties } from "react";

const Text = Typography.Text;

const Review = () => {
    const reviews = [
        {
            name: "Jane Doe",
            learn: "React Native",
            review: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget sapien egestas tincidunt. Nullam nec nunc nec libero ultricies ultricies. Nullam nec nunc nec libero ultricies ultricies.",
            avatar: "/images/landing/sections/fakeImages/avatarStudent.png",
        },
        {
            name: "Jane Doe",
            learn: "React Native",
            review: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget sapien egestas tincidunt. Nullam nec nunc nec libero ultricies ultricies. Nullam nec nunc nec libero ultricies ultricies.",
            avatar: "/images/landing/sections/fakeImages/avatarStudent.png",
        },
        {
            name: "Jane Doe",
            learn: "React Native",
            review: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget sapien egestas tincidunt. Nullam nec nunc nec libero ultricies ultricies. Nullam nec nunc nec libero ultricies ultricies.",
            avatar: "/images/landing/sections/fakeImages/avatarStudent.png",
        }
    ]
    return (
        <SectionLayout bg="#6259E8">
            <Row style={{ paddingBottom: "50px" }} justify="center">
                <Col span={24}>
                    <Title level={2} style={{ textAlign: "center", color: "#ffffff" }}>Our Students Reviews</Title>
                </Col>
                <Col span={24}>
                    <Row justify="center" gutter={[40, 20]}>
                        {
                            reviews.map((review, index) => (
                                <Col key={index} lg={8} md={12} sm={24} xs={24}>
                                    <Space direction="vertical" style={styles.card} >
                                        <img src={review.avatar} alt={review.name} style={styles.avatar} />
                                        <Text style={{ ...styles.text, fontWeight: 500, fontSize: "18px" }}>{review.name}</Text>
                                        <Text style={{ ...styles.text, color: "#6259E8" }}>{review.learn}</Text>
                                        <Text style={{ ...styles.text }}>{review.review}</Text>
                                    </Space>
                                </Col>
                            ))
                        }
                    </Row>
                </Col>
            </Row >
        </SectionLayout >
    );
};

const styles: { card: CSSProperties, text: CSSProperties, avatar: CSSProperties } = {
    card: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center" as React.CSSProperties["alignItems"],
        background: "#ffffff",
        borderRadius: "30px",
        padding: "70px 20px 20px 20px",
        position: "relative",
        marginTop: "50px"
    },
    text: {
        textAlign: "center",
        marginTop: "10px",
        color: "black"
    },
    avatar: {
        height: "100px", 
        borderRadius: "50%",
        position: "absolute",
        top: "-50px",
        border: "5px solid #6259E8",
        left: "50%",
        transform: "translateX(-50%)",
    }
}

export default Review;