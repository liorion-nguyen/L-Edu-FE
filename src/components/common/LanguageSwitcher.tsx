import React, { useState } from 'react';
import { Button, Dropdown, Spin } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { useTranslationWithRerender } from '../../hooks/useLanguageChange';
import { CSSProperties } from 'react';

interface LanguageSwitcherProps {
  style?: CSSProperties;
  showIcon?: boolean;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  style, 
  showIcon = true 
}) => {
  const { t, i18n } = useTranslationWithRerender();
  const [isChanging, setIsChanging] = useState(false);

  const handleLanguageChange = async (language: string) => {
    if (language === i18n.language) return;
    
    setIsChanging(true);
    try {
      await i18n.changeLanguage(language);
      // Force re-render by updating a dummy state
      setTimeout(() => {
        setIsChanging(false);
      }, 100);
    } catch (error) {
      console.error('Error changing language:', error);
      setIsChanging(false);
    }
  };

  const getCurrentLanguage = () => {
    return i18n.language === 'vi' ? 'vi' : 'en';
  };

  const getCurrentLanguageName = () => {
    return i18n.language === 'vi' ? t('language.vietnamese') : t('language.english');
  };

  const menuItems = [
    {
      key: 'vi',
      label: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🇻🇳</span>
          <span>{t('language.vietnamese')}</span>
          {getCurrentLanguage() === 'vi' && <span style={{ color: 'var(--accent-color)' }}>✓</span>}
        </div>
      ),
      onClick: () => handleLanguageChange('vi'),
      disabled: isChanging,
    },
    {
      key: 'en',
      label: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🇺🇸</span>
          <span>{t('language.english')}</span>
          {getCurrentLanguage() === 'en' && <span style={{ color: 'var(--accent-color)' }}>✓</span>}
        </div>
      ),
      onClick: () => handleLanguageChange('en'),
      disabled: isChanging,
    },
  ];

  return (
    <Dropdown
      menu={{ items: menuItems }}
      placement="bottomRight"
      trigger={['click']}
      disabled={isChanging}
    >
      <Button
        type="text"
        icon={showIcon ? (isChanging ? <Spin size="small" /> : <GlobalOutlined />) : undefined}
        style={{
          color: 'var(--text-primary)',
          fontSize: '16px',
          width: showIcon ? '40px' : 'auto',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isChanging ? 0.7 : 1,
          ...style,
        }}
        title={isChanging ? t('common.loading') : t('language.switchLanguage')}
        loading={isChanging}
      >
        {!showIcon && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {isChanging ? (
              <Spin size="small" />
            ) : (
              <>
                <span>{getCurrentLanguage() === 'vi' ? '🇻🇳' : '🇺🇸'}</span>
                <span>{getCurrentLanguageName()}</span>
              </>
            )}
          </div>
        )}
      </Button>
    </Dropdown>
  );
};

export default LanguageSwitcher;
