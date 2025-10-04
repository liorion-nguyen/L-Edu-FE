import React, { useState } from 'react';
import { Select, Row, Col, Card, Typography, Space, Input } from 'antd';
import { ALL_ICONS, getIconByType, IconOption } from '../../constants/icons';

const { Text } = Typography;
const { Search } = Input;

interface IconSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  type?: 'email' | 'phone' | 'address' | 'social';
  placeholder?: string;
  style?: React.CSSProperties;
}

const IconSelector: React.FC<IconSelectorProps> = ({
  value,
  onChange,
  type,
  placeholder = "Select an icon",
  style
}) => {
  const [searchText, setSearchText] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const availableIcons = type ? getIconByType(type) : ALL_ICONS;
  
  const filteredIcons = availableIcons.filter(icon =>
    icon.name.toLowerCase().includes(searchText.toLowerCase()) ||
    icon.description.toLowerCase().includes(searchText.toLowerCase())
  );

  const selectedIcon = availableIcons.find(icon => icon.value === value);

  const handleIconSelect = (iconValue: string) => {
    onChange?.(iconValue);
    setIsOpen(false);
    setSearchText('');
  };

  const dropdownRender = () => (
    <div style={{ padding: '8px', maxHeight: '300px', overflow: 'auto' }}>
      <Search
        placeholder="Search icons..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: '8px' }}
        size="small"
      />
      <Row gutter={[8, 8]}>
        {filteredIcons.map((icon) => (
          <Col span={8} key={icon.value}>
            <Card
              hoverable
              size="small"
              style={{
                textAlign: 'center',
                cursor: 'pointer',
                border: value === icon.value ? '2px solid #1890ff' : '1px solid #d9d9d9',
                backgroundColor: value === icon.value ? '#f0f8ff' : 'transparent'
              }}
              onClick={() => handleIconSelect(icon.value)}
            >
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>
                {icon.emoji}
              </div>
              <Text style={{ fontSize: '10px', display: 'block' }}>
                {icon.name}
              </Text>
            </Card>
          </Col>
        ))}
      </Row>
      {filteredIcons.length === 0 && (
        <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
          No icons found
        </div>
      )}
    </div>
  );

  return (
    <Select
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={style}
      open={isOpen}
      onDropdownVisibleChange={setIsOpen}
      dropdownRender={dropdownRender}
      suffixIcon={
        selectedIcon ? (
          <span style={{ fontSize: '16px' }}>{selectedIcon.emoji}</span>
        ) : null
      }
    >
      {/* Empty options since we're using dropdownRender */}
    </Select>
  );
};

export default IconSelector;


