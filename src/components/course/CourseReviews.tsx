import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Rate, 
  Button, 
  Input, 
  Avatar, 
  Typography, 
  Row, 
  Col, 
  Space, 
  Modal, 
  Form, 
  message, 
  Pagination, 
  Spin,
  Empty,
} from 'antd';
import { 
  StarOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  UserOutlined,
  MessageOutlined
} from '@ant-design/icons';
import { useTranslationWithRerender } from '../../hooks/useLanguageChange';
import { reviewService, Review, ReviewStats, CreateReviewData, UpdateReviewData } from '../../services/reviewService';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface CourseReviewsProps {
  courseId: string;
}

const CourseReviews: React.FC<CourseReviewsProps> = ({ courseId }) => {
  const { t } = useTranslationWithRerender();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  
  const [form] = Form.useForm();

  useEffect(() => {
    fetchReviews();
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, pagination.current]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewService.getCourseReviews(courseId, {
        page: pagination.current,
        limit: pagination.pageSize,
        // Remove status filter since reviews are now auto-approved
      });
      
      if (response.success) {
        console.log('Reviews fetched:', response.data);
        console.log('Reviews length:', response.data.length);
        setReviews(response.data);
        setPagination(prev => ({
          ...prev,
          total: response.pagination.total,
        }));
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await reviewService.getReviewStats(courseId);
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch review stats:', error);
    }
  };

  const handleSubmitReview = async (values: any) => {
    try {
      setSubmitting(true);
      
      if (editingReview) {
        // Update existing review
        const updateData: UpdateReviewData = {
          rating: values.rating,
          comment: values.comment,
          isAnonymous: values.isAnonymous,
        };
        await reviewService.updateReview(editingReview._id, updateData);
        message.success(t('reviews.updateSuccess'));
      } else {
        // Create new review
        const createData: CreateReviewData = {
          courseId,
          rating: values.rating,
          comment: values.comment,
          isAnonymous: values.isAnonymous,
        };
        await reviewService.createReview(createData);
        message.success(t('reviews.createSuccess'));
      }
      
      setIsModalVisible(false);
      form.resetFields();
      setEditingReview(null);
      fetchReviews();
      fetchStats();
    } catch (error: any) {
      message.error(error.response?.data?.message || t('reviews.error'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    form.setFieldsValue({
      rating: review.rating,
      comment: review.comment,
      isAnonymous: review.isAnonymous,
    });
    setIsModalVisible(true);
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await reviewService.deleteReview(reviewId);
      message.success(t('reviews.deleteSuccess'));
      fetchReviews();
      fetchStats();
    } catch (error: any) {
      message.error(error.response?.data?.message || t('reviews.error'));
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingReview(null);
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, current: page }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Debug log for render state
  console.log('Render state - loading:', loading, 'reviews:', reviews, 'reviews.length:', reviews.length);

  // Check if user can edit or delete review
  const canEditOrDelete = (review: Review) => {
    if (!user) return false;
    const isOwner = user._id === (typeof review.userId === 'string' ? review.userId : review.userId._id);
    return isOwner;
  };

  const canEdit = (review: Review) => {
    if (!canEditOrDelete(review)) return false;
    
    // Check edit count (max 1 edit)
    if ((review.editCount || 0) >= 1) return false;
    
    // Check if review is older than 1 day
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    const reviewDate = new Date(review.createdAt);
    
    return reviewDate >= oneDayAgo;
  };

  const canDelete = (review: Review) => {
    if (!canEditOrDelete(review)) return false;
    
    // Check if review is older than 1 day
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    const reviewDate = new Date(review.createdAt);
    
    return reviewDate >= oneDayAgo;
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return '#52c41a';
    if (rating >= 3) return '#faad14';
    return '#ff4d4f';
  };

  return (
    <div style={styles.container}>
      <Title level={3} style={styles.title}>
        {t('reviews.title')}
      </Title>

      {/* Review Stats */}
      {stats && (
        <Card style={styles.statsCard}>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} md={8}>
              <div style={styles.statItem}>
                <div style={styles.statValue}>
                  <StarOutlined style={{ color: '#faad14', marginRight: 8 }} />
                  {stats.averageRating.toFixed(1)}
                </div>
                <Text style={styles.statLabel}>
                  {t('reviews.averageRating')} ({stats.totalReviews} {t('reviews.reviews')})
                </Text>
              </div>
            </Col>
            <Col xs={24} sm={12} md={16}>
              <div style={styles.ratingDistribution}>
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution] || 0;
                  return (
                    <div key={rating} style={styles.ratingBar}>
                      <Text style={styles.ratingLabel}>{rating}★</Text>
                      <div style={styles.barContainer}>
                        <div 
                          style={{
                            ...styles.bar,
                            width: `${stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0}%`,
                            backgroundColor: getRatingColor(rating),
                          }}
                        />
                      </div>
                      <Text style={styles.ratingCount}>{count}</Text>
                    </div>
                  );
                })}
              </div>
            </Col>
          </Row>
        </Card>
      )}

      {/* Add Review Button */}
      {user && (
        <div style={styles.addReviewSection}>
          <Button
            type="primary"
            icon={<MessageOutlined />}
            onClick={() => setIsModalVisible(true)}
            style={styles.addReviewButton}
          >
            {t('reviews.addReview')}
          </Button>
        </div>
      )}

      {/* Reviews List */}
      <div style={styles.reviewsSection}>
        {loading ? (
          <div style={styles.loadingContainer}>
            <Spin size="large" />
          </div>
        ) : reviews.length === 0 ? (
          <Empty description={t('reviews.noReviews')} />
        ) : (
          <>
            {reviews.map((review) => (
              <Card key={review._id} style={styles.reviewCard}>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={4}>
                    <div style={styles.userInfo}>
                      <Avatar
                        size={48}
                        src={review.isAnonymous ? undefined : (typeof review.userId === 'object' ? review.userId.avatar : review.user?.avatar)}
                        icon={<UserOutlined />}
                        style={styles.avatar}
                      />
                      <div style={styles.userDetails}>
                        <Text strong style={styles.userName}>
                          {review.isAnonymous ? t('reviews.anonymous') : (typeof review.userId === 'object' ? review.userId.fullName : review.user?.fullName)}
                        </Text>
                        <Text style={styles.reviewDate}>
                          {formatDate(review.createdAt)}
                        </Text>
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} sm={20}>
                    <div style={styles.reviewContent}>
                      <div style={styles.reviewHeader}>
                        <Rate
                          disabled
                          value={review.rating}
                          style={styles.rating}
                        />
                        {user && user._id === (typeof review.userId === 'string' ? review.userId : review.userId._id) && canEditOrDelete(review) && (
                          <Space>
                            {canEdit(review) && (
                              <Button
                                type="text"
                                icon={<EditOutlined />}
                                onClick={() => handleEditReview(review)}
                                size="small"
                              >
                                {t('reviews.edit')}
                              </Button>
                            )}
                            {canDelete(review) && (
                              <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => handleDeleteReview(review._id)}
                                size="small"
                              >
                                {t('reviews.delete')}
                              </Button>
                            )}
                          </Space>
                        )}
                      </div>
                      <Paragraph style={styles.comment}>
                        {review.comment}
                      </Paragraph>
                      {/* Show edit info if review was edited */}
                      {review.editCount && review.editCount > 0 && review.lastEditedAt && (
                        <Text style={{ fontSize: '12px', color: '#999', fontStyle: 'italic' }}>
                          {t('reviews.edited')}: {formatDate(review.lastEditedAt)} ({review.editCount} {t('reviews.editCount')})
                        </Text>
                      )}
                      {/* Show restriction message if user can't edit/delete */}
                      {user && user._id === (typeof review.userId === 'string' ? review.userId : review.userId._id) && !canEditOrDelete(review) && (
                        <Text style={{ fontSize: '12px', color: '#ff4d4f' }}>
                          {t('reviews.cannotModify')}
                        </Text>
                      )}
                    </div>
                  </Col>
                </Row>
              </Card>
            ))}

            {/* Pagination */}
            {pagination.total > pagination.pageSize && (
              <div style={styles.paginationContainer}>
                <Pagination
                  current={pagination.current}
                  pageSize={pagination.pageSize}
                  total={pagination.total}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                  showQuickJumper
                  showTotal={(total, range) =>
                    `${range[0]}-${range[1]} ${t('reviews.of')} ${total} ${t('reviews.reviews')}`
                  }
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Review Modal */}
      <Modal
        title={editingReview ? t('reviews.editReview') : t('reviews.addReview')}
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        width={600}
        style={{
          backgroundColor: 'var(--background-color)',
          color: 'var(--text-color)',
        }}
        styles={{
          body: {
            backgroundColor: 'var(--background-color)',
            color: 'var(--text-color)',
          },
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmitReview}
          initialValues={{
            rating: 5,
            isAnonymous: false,
          }}
        >
          <Form.Item
            name="rating"
            label={t('reviews.rating')}
            rules={[{ required: true, message: t('reviews.ratingRequired') }]}
          >
            <Rate />
          </Form.Item>

          <Form.Item
            name="comment"
            label={t('reviews.comment')}
            rules={[
              { required: true, message: t('reviews.commentRequired') },
              { min: 10, message: t('reviews.commentMinLength') },
            ]}
          >
            <TextArea
              rows={4}
              placeholder={t('reviews.commentPlaceholder')}
              maxLength={1000}
              showCount
            />
          </Form.Item>

          <Form.Item
            name="isAnonymous"
            valuePropName="checked"
          >
            <div style={styles.checkboxContainer}>
              <input type="checkbox" id="anonymous" />
              <label htmlFor="anonymous" style={styles.checkboxLabel}>
                {t('reviews.postAnonymously')}
              </label>
            </div>
          </Form.Item>

          <Form.Item style={styles.submitButton}>
            <Space>
              <Button onClick={handleModalCancel}>
                {t('reviews.cancel')}
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
              >
                {editingReview ? t('reviews.update') : t('reviews.submit')}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

const styles: {
  [key: string]: React.CSSProperties;
} = {
  container: {
    marginTop: '40px',
  },
  title: {
    color: 'var(--text-primary)',
    marginBottom: '24px',
  },
  statsCard: {
    background: 'var(--bg-primary)',
    border: '1px solid var(--border-color)',
    marginBottom: '24px',
  },
  statItem: {
    textAlign: 'center',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'var(--text-primary)',
    marginBottom: '8px',
  },
  statLabel: {
    color: 'var(--text-secondary)',
  },
  ratingDistribution: {
    padding: '16px 0',
  },
  ratingBar: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '8px',
  },
  ratingLabel: {
    width: '30px',
    fontSize: '12px',
    color: 'var(--text-secondary)',
  },
  barContainer: {
    flex: 1,
    height: '8px',
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: '4px',
    margin: '0 8px',
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.3s ease',
  },
  ratingCount: {
    width: '20px',
    fontSize: '12px',
    color: 'var(--text-secondary)',
    textAlign: 'right',
  },
  addReviewSection: {
    marginBottom: '24px',
    textAlign: 'center',
  },
  addReviewButton: {
    background: 'var(--accent-color)',
    borderColor: 'var(--accent-color)',
  },
  reviewsSection: {
    marginTop: '24px',
  },
  loadingContainer: {
    textAlign: 'center',
    padding: '40px',
  },
  reviewCard: {
    background: 'var(--bg-primary)',
    border: '1px solid var(--border-color)',
    marginBottom: '16px',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  avatar: {
    marginBottom: '8px',
  },
  userDetails: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  userName: {
    color: 'var(--text-primary)',
    fontSize: '14px',
  },
  reviewDate: {
    color: 'var(--text-secondary)',
    fontSize: '12px',
  },
  reviewContent: {
    paddingLeft: '16px',
  },
  reviewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  rating: {
    fontSize: '16px',
  },
  comment: {
    color: 'var(--text-primary)',
    margin: 0,
    lineHeight: '1.6',
  },
  paginationContainer: {
    textAlign: 'center',
    marginTop: '24px',
  },
  checkboxContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  checkboxLabel: {
    marginLeft: '8px',
    color: 'var(--text-primary)',
  },
  submitButton: {
    textAlign: 'right',
    marginTop: '24px',
  },
};

export default CourseReviews;
