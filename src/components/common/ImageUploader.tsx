import React, { useState } from 'react';
import { Upload, Button, Image, message, Space } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { envConfig } from '../../config';

interface ImageUploaderProps {
  value?: string;
  onChange?: (url: string) => void;
  placeholder?: string;
  style?: React.CSSProperties;
  maxSize?: number; // MB
  acceptedTypes?: string[];
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  placeholder = "Upload image",
  style,
  maxSize = 2,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
}) => {
  const [loading, setLoading] = useState(false);

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    showUploadList: false,
    accept: acceptedTypes.join(','),
    beforeUpload: (file) => {
      const isValidType = acceptedTypes.includes(file.type);
      if (!isValidType) {
        message.error(`You can only upload ${acceptedTypes.join(', ')} files!`);
        return false;
      }
      
      const isValidSize = file.size / 1024 / 1024 < maxSize;
      if (!isValidSize) {
        message.error(`Image must be smaller than ${maxSize}MB!`);
        return false;
      }
      
      return true;
    },
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        setLoading(true);
        
        // Create FormData
        const formData = new FormData();
        formData.append('file', file);
        
        // Upload to your backend endpoint
        const response = await fetch(`${envConfig.serverURL}/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt-access-token')}`,
          },
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error('Upload failed');
        }
        
        const result = await response.json();
        
        if (result.secure_url) {
          onChange?.(result.secure_url);
          onSuccess?.(result);
          message.success('Image uploaded successfully!');
        } else {
          throw new Error(result.message || 'Upload failed');
        }
      } catch (error) {
        console.error('Upload error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Please try again.';
        message.error(`Failed to upload image: ${errorMessage}`);
        onError?.(error as Error);
      } finally {
        setLoading(false);
      }
    },
  };

  const handleRemove = () => {
    onChange?.('');
  };

  return (
    <div style={style}>
      {value ? (
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <Image
            src={value}
            alt="Uploaded"
            style={{ 
              width: '100px', 
              height: '100px', 
              objectFit: 'cover',
              borderRadius: '8px',
              border: '1px solid #d9d9d9'
            }}
            preview={{
              mask: 'Preview'
            }}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={handleRemove}
            style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              backgroundColor: '#fff',
              border: '1px solid #ff4d4f',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          />
        </div>
      ) : (
        <Upload {...uploadProps}>
          <Button 
            loading={loading}
            icon={<UploadOutlined />}
            style={{ width: '100%' }}
          >
            {placeholder}
          </Button>
        </Upload>
      )}
      
      {value && (
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
          <Space>
            <span>Image URL:</span>
            <code style={{ 
              background: '#f5f5f5', 
              padding: '2px 4px', 
              borderRadius: '3px',
              fontSize: '11px',
              wordBreak: 'break-all'
            }}>
              {value}
            </code>
          </Space>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
