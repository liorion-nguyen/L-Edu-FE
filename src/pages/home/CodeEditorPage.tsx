import React from 'react';
import { Typography, Space, Card } from 'antd';
import { CodeOutlined } from '@ant-design/icons';
import CodeEditor from './CodeEditor';
import { COLORS, SPACING } from '../../constants/colors';

const { Title, Paragraph } = Typography;

const CodeEditorPage: React.FC = () => {
  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <Space align="center" size={16}>
          <div style={styles.iconWrapper}>
            <CodeOutlined style={styles.headerIcon} />
          </div>
          <div>
            <Title level={2} style={styles.title}>
              Code Editor Online
            </Title>
            <Paragraph style={styles.subtitle}>
              Professional online code editor with multi-language support, syntax highlighting, and real-time execution
            </Paragraph>
          </div>
        </Space>
      </div>

      {/* Features Overview */}
      <div style={styles.featuresSection}>
        <Space size={24} wrap>
          <div style={styles.feature}>
            <div style={styles.featureIcon}>🚀</div>
            <div>
              <div style={styles.featureTitle}>Multi-Language Support</div>
              <div style={styles.featureDesc}>JavaScript, Python, C++, HTML/CSS</div>
            </div>
          </div>
          
          <div style={styles.feature}>
            <div style={styles.featureIcon}>⚡</div>
            <div>
              <div style={styles.featureTitle}>Real-time Execution</div>
              <div style={styles.featureDesc}>Run and test your code instantly</div>
            </div>
          </div>
          
          <div style={styles.feature}>
            <div style={styles.featureIcon}>🎨</div>
            <div>
              <div style={styles.featureTitle}>Modern Interface</div>
              <div style={styles.featureDesc}>Dark/Light theme, customizable</div>
            </div>
          </div>
          
          <div style={styles.feature}>
            <div style={styles.featureIcon}>💾</div>
            <div>
              <div style={styles.featureTitle}>File Management</div>
              <div style={styles.featureDesc}>Multiple tabs, auto-save, download</div>
            </div>
          </div>
        </Space>
      </div>

      {/* Code Editor Component */}
      <CodeEditor />
      
      {/* Quick Start Guide */}
      <Card style={styles.guideCard} title="Quick Start Guide">
        <div style={styles.guideContent}>
          <div style={styles.guideStep}>
            <span style={styles.stepNumber}>1</span>
            <span>Choose your programming language from the dropdown</span>
          </div>
          <div style={styles.guideStep}>
            <span style={styles.stepNumber}>2</span>
            <span>Write or paste your code in the editor</span>
          </div>
          <div style={styles.guideStep}>
            <span style={styles.stepNumber}>3</span>
            <span>Click the "Run" button or press Ctrl+Enter to execute</span>
          </div>
          <div style={styles.guideStep}>
            <span style={styles.stepNumber}>4</span>
            <span>View the output in the console below</span>
          </div>
        </div>
        
        <div style={styles.shortcuts}>
          <Title level={5}>Keyboard Shortcuts:</Title>
          <Space direction="vertical" size={4}>
            <span><code>Ctrl+S</code> - Save file</span>
            <span><code>Ctrl+Enter</code> - Run code</span>
            <span><code>Ctrl+N</code> - New file</span>
            <span><code>F11</code> - Toggle fullscreen</span>
          </Space>
        </div>
      </Card>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: COLORS.background.primary,
    padding: SPACING.lg,
  },
  header: {
    marginBottom: SPACING.xl,
    padding: SPACING.lg,
    background: COLORS.background.secondary,
    borderRadius: '12px',
    border: `1px solid ${COLORS.border.light}`,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: '12px',
    background: `linear-gradient(135deg, ${COLORS.primary[500]} 0%, ${COLORS.primary[600]} 100%)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(127, 182, 127, 0.3)',
  },
  headerIcon: {
    fontSize: '32px',
    color: COLORS.background.primary,
  },
  title: {
    margin: 0,
    color: COLORS.text.heading,
    fontSize: '2rem',
    fontWeight: 700,
  },
  subtitle: {
    margin: 0,
    color: COLORS.text.secondary,
    fontSize: '16px',
    maxWidth: '600px',
  },
  featuresSection: {
    marginBottom: SPACING.xl,
    padding: SPACING.lg,
    background: COLORS.background.primary,
    borderRadius: '8px',
    border: `1px solid ${COLORS.border.light}`,
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    minWidth: '200px',
  },
  featureIcon: {
    fontSize: '24px',
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    background: COLORS.background.secondary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    fontWeight: 600,
    color: COLORS.text.heading,
    marginBottom: '4px',
  },
  featureDesc: {
    fontSize: '13px',
    color: COLORS.text.secondary,
  },
  guideCard: {
    marginTop: SPACING.xl,
    borderRadius: '8px',
    border: `1px solid ${COLORS.border.light}`,
  },
  guideContent: {
    marginBottom: SPACING.lg,
  },
  guideStep: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '12px',
    padding: '8px 0',
  },
  stepNumber: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: COLORS.primary[500],
    color: COLORS.background.primary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 600,
  },
  shortcuts: {
    background: COLORS.background.secondary,
    padding: SPACING.md,
    borderRadius: '6px',
    marginTop: SPACING.md,
  },
};

export default CodeEditorPage;
