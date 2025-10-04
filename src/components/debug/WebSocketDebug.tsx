import React, { useState, useEffect } from 'react';
import { Button, Card, Typography, Space, Tag } from 'antd';
import { io, Socket } from 'socket.io-client';

const { Title, Text } = Typography;

const WebSocketDebug: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>('Disconnected');
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const connectSocket = () => {
    const token = localStorage.getItem('jwt-access-token');
    if (!token) {
      addLog('❌ No JWT token found');
      return;
    }

    addLog('🔌 Connecting to WebSocket...');
    
    const newSocket = io('http://localhost:8000', {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      setConnectionStatus('Connected');
      addLog(`✅ Connected: ${newSocket.id}`);
    });

    newSocket.on('disconnect', (reason) => {
      setConnectionStatus('Disconnected');
      addLog(`❌ Disconnected: ${reason}`);
    });

    newSocket.on('connect_error', (error) => {
      addLog(`❌ Connection error: ${error.message}`);
    });

    newSocket.on('streaming_message', (message) => {
      addLog(`📨 Received message: ${JSON.stringify(message)}`);
    });

    newSocket.on('error', (error) => {
      addLog(`❌ Socket error: ${error.message}`);
    });

    setSocket(newSocket);
  };

  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setConnectionStatus('Disconnected');
      addLog('🔌 Disconnected manually');
    }
  };

  const sendTestMessage = () => {
    if (!socket || !socket.connected) {
      addLog('❌ Socket not connected');
      return;
    }

    addLog('📤 Sending test message...');
    socket.emit('send_message', {
      conversationId: 'test-conversation',
      content: 'Test message from debug tool',
      imageUrls: []
    });
    addLog('✅ Test message sent');
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>WebSocket Debug Tool</Title>
      
      <Card style={{ marginBottom: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Text strong>Connection Status: </Text>
            <Tag color={connectionStatus === 'Connected' ? 'green' : 'red'}>
              {connectionStatus}
            </Tag>
          </div>
          
          <Space>
            <Button 
              type="primary" 
              onClick={connectSocket}
              disabled={connectionStatus === 'Connected'}
            >
              Connect
            </Button>
            <Button 
              onClick={disconnectSocket}
              disabled={connectionStatus === 'Disconnected'}
            >
              Disconnect
            </Button>
            <Button 
              onClick={sendTestMessage}
              disabled={connectionStatus === 'Disconnected'}
            >
              Send Test Message
            </Button>
            <Button onClick={clearLogs}>
              Clear Logs
            </Button>
          </Space>
        </Space>
      </Card>

      <Card title="Debug Logs">
        <div style={{ 
          height: 400, 
          overflow: 'auto', 
          backgroundColor: '#f5f5f5', 
          padding: 12,
          fontFamily: 'monospace',
          fontSize: 12
        }}>
          {logs.length === 0 ? (
            <Text type="secondary">No logs yet...</Text>
          ) : (
            logs.map((log, index) => (
              <div key={index} style={{ marginBottom: 4 }}>
                {log}
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default WebSocketDebug;
