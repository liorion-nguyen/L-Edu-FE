import React, { useEffect, useState } from 'react';
import { Card, Button, Space, Typography, Alert } from 'antd';

const { Title, Text, Paragraph } = Typography;

const DebugAuthPage: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [apiTest, setApiTest] = useState<string>('');

  useEffect(() => {
    // Get token from localStorage
    const jwt = localStorage.getItem('jwt-access-token');
    setToken(jwt);

    // Get user info
    const user = localStorage.getItem('user_info');
    if (user) {
      try {
        setUserInfo(JSON.parse(user));
      } catch (e) {
        console.error('Error parsing user info:', e);
      }
    }
  }, []);

  const testAPI = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/chat/conversations`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setApiTest(`✅ API Success: ${JSON.stringify(data, null, 2)}`);
      } else {
        setApiTest(`❌ API Error: ${response.status} ${response.statusText}`);
      }
    } catch (error: any) {
      setApiTest(`❌ Network Error: ${error.message}`);
    }
  };

  const decodeJWT = (token: string) => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      
      const payload = JSON.parse(atob(parts[1]));
      return payload;
    } catch (e) {
      return null;
    }
  };

  const decodedToken = token ? decodeJWT(token) : null;

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Card>
        <Title level={2}>🔍 Debug Authentication</Title>

        <Space direction="vertical" style={{ width: '100%' }} size="large">
          {/* Token Status */}
          <div>
            <Title level={4}>1. JWT Token Status</Title>
            {token ? (
              <Alert
                type="success"
                message="Token Found"
                description={
                  <div>
                    <Text code style={{ wordBreak: 'break-all' }}>
                      {token.substring(0, 100)}...
                    </Text>
                  </div>
                }
              />
            ) : (
              <Alert
                type="error"
                message="No Token"
                description="Please login first"
              />
            )}
          </div>

          {/* Decoded Token */}
          {decodedToken && (
            <div>
              <Title level={4}>2. Decoded Token</Title>
              <Alert
                type="info"
                message="Token Payload"
                description={
                  <pre style={{ margin: 0, fontSize: '12px' }}>
                    {JSON.stringify(decodedToken, null, 2)}
                  </pre>
                }
              />
              <Paragraph style={{ marginTop: 8 }}>
                <Text strong>User ID (sub): </Text>
                <Text code>{decodedToken.sub}</Text>
                <br />
                <Text strong>Email: </Text>
                <Text code>{decodedToken.email}</Text>
                <br />
                <Text strong>Role: </Text>
                <Text code>{decodedToken.role}</Text>
                <br />
                <Text strong>Issued At: </Text>
                <Text code>{new Date(decodedToken.iat * 1000).toLocaleString()}</Text>
                <br />
                <Text strong>Expires At: </Text>
                <Text code>{new Date(decodedToken.exp * 1000).toLocaleString()}</Text>
                <br />
                <Text strong>Is Expired: </Text>
                <Text type={decodedToken.exp * 1000 < Date.now() ? 'danger' : 'success'}>
                  {decodedToken.exp * 1000 < Date.now() ? '❌ Yes (EXPIRED!)' : '✅ No'}
                </Text>
              </Paragraph>
            </div>
          )}

          {/* User Info */}
          {userInfo && (
            <div>
              <Title level={4}>3. User Info from localStorage</Title>
              <Alert
                type="info"
                message="User Data"
                description={
                  <pre style={{ margin: 0, fontSize: '12px' }}>
                    {JSON.stringify(userInfo, null, 2)}
                  </pre>
                }
              />
            </div>
          )}

          {/* API Test */}
          <div>
            <Title level={4}>4. Test API Call</Title>
            <Space>
              <Button type="primary" onClick={testAPI} disabled={!token}>
                Test GET /chat/conversations
              </Button>
            </Space>
            {apiTest && (
              <Alert
                type={apiTest.includes('✅') ? 'success' : 'error'}
                message="API Response"
                description={<pre style={{ margin: 0, fontSize: '12px' }}>{apiTest}</pre>}
                style={{ marginTop: 16 }}
              />
            )}
          </div>

          {/* Environment */}
          <div>
            <Title level={4}>5. Environment</Title>
            <Alert
              type="info"
              message="Configuration"
              description={
                <>
                  <Text strong>API URL: </Text>
                  <Text code>{process.env.REACT_APP_API_URL || 'http://localhost:5000'}</Text>
                </>
              }
            />
          </div>

          {/* Instructions */}
          <Alert
            type="warning"
            message="How to Fix Socket Issues"
            description={
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                <li>If token is expired, please login again</li>
                <li>If token format is wrong, check backend JWT_SECRET</li>
                <li>If API test fails, check backend is running on correct port</li>
                <li>Check backend console for detailed error messages</li>
              </ul>
            }
          />
        </Space>
      </Card>
    </div>
  );
};

export default DebugAuthPage;
