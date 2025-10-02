import { Col, Row, Spin } from "antd";
import Title from "antd/es/typography/Title";
import { CSSProperties, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslationWithRerender } from "../../hooks/useLanguageChange";
import { COLORS, RADIUS, SPACING } from "../../constants/colors";
import SectionLayout from "../../layouts/SectionLayout";
import { categoryService, Category } from "../../services/categoryService";

const ExploreCategories = () => {
  const { t } = useTranslationWithRerender();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        // Now student can access the original endpoint with authentication
        const response = await categoryService.getCategories({ 
          limit: 1000,
          isActive: true 
        });
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        // Fallback to empty array if API fails
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    // Navigate to courses page with category filter
    navigate(`/course?category=${categoryId}`);
  };

  return (
    <SectionLayout style={styles.sectionLayout}>
      <Title level={2} style={styles.title}>
        {t('categories.title')}
      </Title>
      {loading ? (
        <div style={styles.loadingContainer}>
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[24, 24]} justify="center">
          {categories.map((category) => (
            <Col key={category._id} xs={24} sm={12} md={8} lg={6}>
              <div 
                style={styles.categoryCard}
                onClick={() => handleCategoryClick(category._id)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.15)";
                  e.currentTarget.style.borderColor = "var(--accent-color)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "var(--border-color)";
                }}
              >
                <div style={styles.imageContainer}>
                  {category.icon ? (
                    <img src={category.icon} alt={category.name} style={styles.image} />
                  ) : (
                    <div style={styles.defaultIcon}>
                      <span style={styles.defaultIconText}>
                        {category.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div style={styles.cardContent}>
                  <h3 style={styles.categoryName}>{category.name}</h3>
                  <p style={styles.courseCount}>
                    {category.courseCount} {t('categories.courses')}
                  </p>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      )}
    </SectionLayout>
  );
};

export default ExploreCategories;

const styles: {
  sectionLayout: CSSProperties;
  title: CSSProperties;
  loadingContainer: CSSProperties;
  categoryCard: CSSProperties;
  imageContainer: CSSProperties;
  image: CSSProperties;
  defaultIcon: CSSProperties;
  defaultIconText: CSSProperties;
  cardContent: CSSProperties;
  categoryName: CSSProperties;
  courseCount: CSSProperties;
} = {
  sectionLayout: {
    background: "var(--bg-primary)",
    padding: `${SPACING.xl} 0`,
  },
  title: {
    textAlign: "center",
    color: "var(--text-primary)",
    marginBottom: SPACING.xl,
    fontSize: "2.5rem",
    fontWeight: 600,
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "200px",
  },
  categoryCard: {
    background: "var(--bg-secondary)",
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    textAlign: "center",
    height: "100%",
    border: "1px solid var(--border-color)",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  imageContainer: {
    marginBottom: SPACING.md,
  },
  image: {
    width: "60px",
    height: "60px",
    objectFit: "cover",
    borderRadius: RADIUS.md,
  },
  defaultIcon: {
    width: "60px",
    height: "60px",
    borderRadius: RADIUS.md,
    background: "var(--accent-color)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto",
  },
  defaultIconText: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "white",
  },
  cardContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: SPACING.xs,
  },
  categoryName: {
    fontSize: "1.1rem",
    fontWeight: 600,
    color: "var(--text-primary)",
    margin: 0,
  },
  courseCount: {
    fontSize: "0.9rem",
    color: "var(--text-secondary)",
    margin: 0,
  },
};