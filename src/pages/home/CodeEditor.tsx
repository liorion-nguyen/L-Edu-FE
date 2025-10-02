import React, { useState, useRef } from "react";
import { Editor } from "@monaco-editor/react";
import { 
  Button, 
  Tabs, 
  Select, 
  Tooltip, 
  Space, 
  Typography, 
  Row, 
  Col, 
  Switch,
  Card,
  Badge,
  Modal,
  Input,
  message,
  Tree,
  Collapse,
  Divider,
  Spin
} from "antd";
import {
  PlayCircleOutlined,
  SaveOutlined,
  DownloadOutlined,
  PlusOutlined,
  ClearOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  StopOutlined,
  BugOutlined,
  ShareAltOutlined,
  FolderOpenOutlined,
  FileOutlined,
  SettingOutlined,
  CodeOutlined,
  ConsoleSqlOutlined,
  DatabaseOutlined,
  EyeOutlined,
  CloseCircleOutlined,
  EditOutlined
} from "@ant-design/icons";
import { COLORS, RADIUS, SPACING } from "../../constants/colors";
import { getLanguageIcon, TerminalIcon } from "../../components/common/CodeIcons";
import './CodeEditor.css';
import { useTranslationWithRerender } from "../../hooks/useLanguageChange";

const { Text, Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { Panel } = Collapse;

// Project file structure interface
interface ProjectFile {
  key: string;
  title: string;
  isLeaf: boolean;
  icon?: React.ReactNode;
  children?: ProjectFile[];
}

// Breakpoint interface
interface Breakpoint {
  line: number;
  file: string;
  enabled: boolean;
}

// Debug state interface
interface DebugState {
  isDebugging: boolean;
  currentLine?: number;
  callStack: string[];
  localVariables: { [key: string]: any };
}

// Language templates
const languageTemplates = {
  javascript: `// JavaScript Code
console.log("Hello, World!");

// Function example
function greet(name) {
    return \`Hello, \${name}!\`;
}

const result = greet("Developer");
console.log(result);`,

  python: `# Python Code
print("Hello, World!")

# Function example
def greet(name):
    return f"Hello, {name}!"

result = greet("Developer")
print(result)`,

  cpp: `#include <iostream>
#include <string>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    
    // Function example
    string name = "Developer";
    cout << "Hello, " << name << "!" << endl;
    
    return 0;
}`,

  html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HTML Template</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 40px;
            background: #f5f5f5;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Hello, World!</h1>
        <p>This is a sample HTML template.</p>
        <button onclick="alert('Hello!')">Click me!</button>
    </div>
</body>
</html>`,

  css: `/* CSS Styles */
body {
    font-family: 'Segoe UI', Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    background: white;
    border-radius: 12px;
    padding: 30px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.title {
    color: #333;
    text-align: center;
    margin-bottom: 20px;
    font-size: 2.5rem;
}

.button {
    background: #667eea;
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.3s ease;
}

.button:hover {
    background: #764ba2;
    transform: translateY(-2px);
}`
};

interface FileTab {
  key: string;
  title: string;
  language: string;
  content: string;
  modified: boolean;
}

interface CodeEditorProps {
  className?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ className = "" }) => {
  const { t } = useTranslationWithRerender();
  const [files, setFiles] = useState<FileTab[]>([
    {
      key: "main.cpp",
      title: "main.cpp", 
      language: "cpp",
      content: languageTemplates.cpp,
      modified: false
    }
  ]);
  
  const [activeFileKey, setActiveFileKey] = useState<string>("main.cpp");
  const [theme, setTheme] = useState<'vs-dark' | 'light'>('vs-dark');
  const [fontSize, setFontSize] = useState<number>(14);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [output, setOutput] = useState<string>("");
  const [input, setInput] = useState<string>("");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isDebugging, setIsDebugging] = useState<boolean>(false);
  const [newFileModal, setNewFileModal] = useState<boolean>(false);
  const [newFileName, setNewFileName] = useState<string>("");
  const [newFileLanguage, setNewFileLanguage] = useState<string>("cpp");
  const [leftPanelWidth, setLeftPanelWidth] = useState<number>(250);
  const [rightPanelWidth, setRightPanelWidth] = useState<number>(350);
  const [activeRightTab, setActiveRightTab] = useState<string>("output");
  
  // Debug state
  const [breakpoints, setBreakpoints] = useState<Breakpoint[]>([]);
  const [debugState, setDebugState] = useState<DebugState>({
    isDebugging: false,
    callStack: [],
    localVariables: {}
  });
  
  // Project structure
  const [projectFiles] = useState<ProjectFile[]>([
    {
      key: 'project',
      title: 'My Project',
      isLeaf: false,
      icon: <FolderOpenOutlined />,
      children: [
        { key: 'main.cpp', title: 'main.cpp', isLeaf: true, icon: getLanguageIcon('cpp', 14) },
        { key: 'utils.h', title: 'utils.h', isLeaf: true, icon: <FileOutlined /> },
        { key: 'README.md', title: 'README.md', isLeaf: true, icon: <FileOutlined /> }
      ]
    }
  ]);
  
  const editorRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get current active file
  const activeFile = files.find(file => file.key === activeFileKey);

  // Handle editor mount
  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    
    // Set editor theme
    monaco.editor.setTheme(theme);
    
    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      handleSaveFile();
    });
    
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      handleRunCode();
    });
  };

  // Handle editor content change
  const handleEditorChange = (value: string | undefined) => {
    if (!activeFile || value === undefined) return;
    
    setFiles(prev => prev.map(file => 
      file.key === activeFileKey 
        ? { ...file, content: value, modified: true }
        : file
    ));
  };

  // Create new file
  const handleCreateFile = () => {
    if (!newFileName.trim()) {
      message.error("Please enter a file name");
      return;
    }
    
    const fileExtension = getFileExtension(newFileLanguage);
    const fileName = newFileName.includes('.') ? newFileName : `${newFileName}${fileExtension}`;
    
    // Check if file already exists
    if (files.some(file => file.key === fileName)) {
      message.error("File already exists");
      return;
    }
    
    const newFile: FileTab = {
      key: fileName,
      title: fileName,
      language: newFileLanguage,
      content: languageTemplates[newFileLanguage as keyof typeof languageTemplates] || "",
      modified: false
    };
    
    setFiles(prev => [...prev, newFile]);
    setActiveFileKey(fileName);
    setNewFileModal(false);
    setNewFileName("");
    message.success(`File "${fileName}" created successfully`);
  };

  // Get file extension based on language
  const getFileExtension = (language: string): string => {
    const extensions: { [key: string]: string } = {
      javascript: '.js',
      typescript: '.ts',
      python: '.py',
      cpp: '.cpp',
      c: '.c',
      html: '.html',
      css: '.css',
      java: '.java',
      php: '.php'
    };
    return extensions[language] || '.txt';
  };

  // Close file tab
  const handleCloseFile = (fileKey: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (files.length === 1) {
      message.warning("Cannot close the last file");
      return;
    }
    
    const fileToClose = files.find(file => file.key === fileKey);
    if (fileToClose?.modified) {
      Modal.confirm({
        title: 'Unsaved Changes',
        content: `File "${fileToClose.title}" has unsaved changes. Do you want to close it anyway?`,
        onOk: () => {
          closeFile(fileKey);
        }
      });
    } else {
      closeFile(fileKey);
    }
  };

  const closeFile = (fileKey: string) => {
    const newFiles = files.filter(file => file.key !== fileKey);
    setFiles(newFiles);
    
    // Switch to first available file if closing active file
    if (activeFileKey === fileKey) {
      setActiveFileKey(newFiles[0]?.key || "");
    }
  };

  // Save current file
  const handleSaveFile = () => {
    if (!activeFile) return;
    
    setFiles(prev => prev.map(file => 
      file.key === activeFileKey 
        ? { ...file, modified: false }
        : file
    ));
    
    message.success(`File "${activeFile.title}" saved successfully`);
  };

  // Download current file
  const handleDownloadFile = () => {
    if (!activeFile) return;
    
    const blob = new Blob([activeFile.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile.title;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    message.success(`File "${activeFile.title}" downloaded successfully`);
  };

  // Simulate code execution
  const handleRunCode = async () => {
    if (!activeFile) return;
    
    setIsRunning(true);
    setOutput("Running code...\n");
    
    // Simulate code execution delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let result = "";
    
    switch (activeFile.language) {
      case 'javascript':
        result = simulateJavaScript(activeFile.content);
        break;
      case 'python':
        result = simulatePython(activeFile.content);
        break;
      case 'cpp':
      case 'c':
        result = simulateCpp(activeFile.content);
        break;
      case 'html':
        result = "HTML code ready for preview. Use browser to view output.";
        break;
      default:
        result = `Code execution simulation for ${activeFile.language} completed.`;
    }
    
    setOutput(prev => prev + result);
    setIsRunning(false);
  };

  // Simple JavaScript simulation
  const simulateJavaScript = (code: string): string => {
    try {
      // Simple console.log capture
      const logs: string[] = [];
      const mockConsole = {
        log: (...args: any[]) => {
          logs.push(args.join(' '));
        }
      };
      
      // Replace console with mock
      const wrappedCode = code.replace(/console\.log/g, 'mockConsole.log');
      
      // Evaluate (unsafe in production, just for demo)
      // eslint-disable-next-line no-new-func
      const func = new Function('mockConsole', wrappedCode);
      func(mockConsole);
      
      return logs.length > 0 ? logs.join('\n') : "Code executed successfully (no output)";
    } catch (error) {
      return `Error: ${error}`;
    }
  };

  // Simple Python simulation
  const simulatePython = (code: string): string => {
    const lines = code.split('\n');
    const output: string[] = [];
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('print(')) {
        const match = trimmed.match(/print\(["'](.+?)["']\)/);
        if (match) {
          output.push(match[1]);
        }
      }
    });
    
    return output.length > 0 ? output.join('\n') : "Python code executed successfully";
  };

  // Simple C++ simulation
  const simulateCpp = (code: string): string => {
    const lines = code.split('\n');
    const output: string[] = [];
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.includes('cout') && trimmed.includes('<<')) {
        const match = trimmed.match(/cout\s*<<\s*["'](.+?)["']/);
        if (match) {
          output.push(match[1]);
        }
      }
    });
    
    return output.length > 0 ? output.join('\n') : "C++ code compiled and executed successfully";
  };

  // Handle debug actions
  const handleDebugStart = () => {
    setIsDebugging(true);
    setDebugState({
      isDebugging: true,
      currentLine: 1,
      callStack: ['main()'],
      localVariables: { 'argc': 1, 'argv': '["main.cpp"]' }
    });
    message.success('Debug session started');
  };

  const handleDebugStop = () => {
    setIsDebugging(false);
    setDebugState({
      isDebugging: false,
      callStack: [],
      localVariables: {}
    });
    message.info('Debug session stopped');
  };

  const handleToggleBreakpoint = (line: number) => {
    if (!activeFile) return;
    
    const existingBreakpoint = breakpoints.find(bp => bp.line === line && bp.file === activeFile.key);
    
    if (existingBreakpoint) {
      setBreakpoints(prev => prev.filter(bp => !(bp.line === line && bp.file === activeFile.key)));
    } else {
      setBreakpoints(prev => [...prev, { line, file: activeFile.key, enabled: true }]);
    }
  };

  // Handle file selection from project tree
  const handleFileSelect = (selectedKeys: React.Key[]) => {
    const key = selectedKeys[0] as string;
    if (key && key.includes('.')) {
      const existingFile = files.find(f => f.key === key);
      if (existingFile) {
        setActiveFileKey(key);
      } else {
        // Create new file if not exists
        const extension = key.split('.').pop();
        const language = getLanguageFromExtension(extension || '');
        const newFile: FileTab = {
          key,
          title: key,
          language,
          content: languageTemplates[language as keyof typeof languageTemplates] || '',
          modified: false
        };
        setFiles(prev => [...prev, newFile]);
        setActiveFileKey(key);
      }
    }
  };

  const getLanguageFromExtension = (ext: string): string => {
    const extMap: { [key: string]: string } = {
      'js': 'javascript',
      'ts': 'typescript', 
      'py': 'python',
      'cpp': 'cpp',
      'c': 'c',
      'html': 'html',
      'css': 'css',
      'java': 'java',
      'h': 'cpp'
    };
    return extMap[ext] || 'plaintext';
  };

  // Share code functionality
  const handleShareCode = () => {
    if (!activeFile) return;
    
    const shareUrl = `${window.location.origin}/shared/${btoa(activeFile.content)}`;
    navigator.clipboard.writeText(shareUrl);
    message.success('Share URL copied to clipboard!');
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  // Clear output
  const clearOutput = () => {
    setOutput("");
  };

  // Handle language change
  const handleLanguageChange = (language: string) => {
    if (!activeFile) return;
    
    setFiles(prev => prev.map(file => 
      file.key === activeFileKey 
        ? { ...file, language, modified: true }
        : file
    ));
  };

  return (
    <div 
      ref={containerRef}
      className={`code-editor-container ${className}`} 
      style={isFullscreen ? styles.fullscreenContainer : styles.container}
    >
      {/* Top Toolbar - OnlineGDB Style */}
      <Card style={styles.topToolbar} bodyStyle={{ padding: '8px 16px' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space size="large">
              <Title level={4} style={{ margin: 0, color: COLORS.primary[500] }}>
                🔧 {t('codeEditor.title')}
              </Title>
              <Text type="secondary">{t('codeEditor.subtitle')}</Text>
            </Space>
          </Col>
          
          <Col>
            <Space>
              {/* Language Selector */}
              <Text strong>{t('codeEditor.language')}</Text>
              <Select
                value={activeFile?.language}
                onChange={handleLanguageChange}
                style={{ width: 140 }}
              >
                <Option value="cpp">{t('codeEditor.languages.cpp')}</Option>
                <Option value="c">{t('codeEditor.languages.c')}</Option>
                <Option value="javascript">{t('codeEditor.languages.javascript')}</Option>
                <Option value="python">{t('codeEditor.languages.python')}</Option>
                <Option value="java">{t('codeEditor.languages.java')}</Option>
                <Option value="html">{t('codeEditor.languages.html')}</Option>
                <Option value="css">{t('codeEditor.languages.css')}</Option>
              </Select>
              
              {/* Main Action Buttons */}
              <Button
                type="primary" 
                icon={<PlayCircleOutlined />}
                loading={isRunning}
                onClick={handleRunCode}
                size="large"
                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
              >
                {t('codeEditor.run')}
              </Button>
              
              <Button
                icon={<BugOutlined />}
                onClick={isDebugging ? handleDebugStop : handleDebugStart}
                size="large"
                type={isDebugging ? "default" : "primary"}
                style={isDebugging ? {} : { backgroundColor: '#1890ff' }}
              >
                {isDebugging ? 'Stop' : 'Debug'}
              </Button>
              
              <Button
                icon={<StopOutlined />}
                disabled={!isRunning && !isDebugging}
                size="large"
                danger
              >
                Stop
              </Button>
              
              <Button
                icon={<ShareAltOutlined />}
                onClick={handleShareCode}
                size="large"
              >
                Share
              </Button>
              
              <Button
                icon={<SaveOutlined />}
                onClick={handleSaveFile}
                disabled={!activeFile?.modified}
                size="large"
              >
                Save
              </Button>
              
              <Button
                icon={<EditOutlined />}
                size="large"
              >
                Beautify
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Main 3-Panel Layout */}
      <div style={styles.mainLayout}>
        {/* Left Panel - File Explorer */}
        <div style={{ ...styles.leftPanel, width: leftPanelWidth }}>
          <Card 
            title={
              <Space>
                <FolderOpenOutlined />
                <Text strong>Project Files</Text>
              </Space>
            }
            size="small"
            style={styles.panelCard}
            extra={
              <Button 
                icon={<PlusOutlined />} 
                size="small" 
                onClick={() => setNewFileModal(true)}
              />
            }
          >
            <Tree
              treeData={projectFiles}
              onSelect={handleFileSelect}
              selectedKeys={[activeFileKey]}
              showIcon
              defaultExpandAll
            />
          </Card>
        </div>

        {/* Center Panel - Code Editor */}
        <div style={styles.centerPanel}>
          <Card style={styles.editorCard} bodyStyle={{ padding: 0 }}>
            {/* File Tabs */}
            <div style={styles.fileTabsWrapper}>
              <Tabs
                type="editable-card"
                activeKey={activeFileKey}
                onChange={setActiveFileKey}
                onEdit={(targetKey, action) => {
                  if (action === 'remove') {
                    handleCloseFile(targetKey as string, {} as React.MouseEvent);
                  }
                }}
                size="small"
                items={files.map(file => ({
                  key: file.key,
                  label: (
                    <Space size={4}>
                      {getLanguageIcon(file.language, 12)}
                      <Text style={{ fontSize: '12px' }}>
                        {file.title}
                        {file.modified && <span style={{ color: '#faad14' }}>*</span>}
                      </Text>
                    </Space>
                  ),
                  children: null // Content will be rendered separately
                }))}
              />
            </div>
            
            {/* Editor Area */}
            <div style={styles.editorArea}>
              {activeFile && (
                <Editor
                  height="100%"
                  language={activeFile.language}
                  value={activeFile.content}
                  onChange={handleEditorChange}
                  onMount={handleEditorDidMount}
                  theme={theme}
                  options={{
                    fontSize: fontSize,
                    minimap: { enabled: true },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    insertSpaces: true,
                    wordWrap: 'on',
                    lineNumbers: 'on',
                    glyphMargin: true,
                    folding: true,
                    renderLineHighlight: 'all',
                    bracketPairColorization: { enabled: true },
                  }}
                />
              )}
            </div>
          </Card>
        </div>

        {/* Right Panel - Output & Debug */}
        <div style={{ ...styles.rightPanel, width: rightPanelWidth }}>
          <Card style={styles.panelCard} bodyStyle={{ padding: 0 }}>
            <Tabs
              activeKey={activeRightTab}
              onChange={setActiveRightTab}
              size="small"
              items={[
                {
                  key: 'output',
                  label: (
                    <Space>
                      <ConsoleSqlOutlined />
                      Output
                    </Space>
                  ),
                  children: (
                    <div style={styles.tabContent}>
                      {/* Standard Input */}
                      <div style={styles.inputSection}>
                        <Text strong style={{ fontSize: '12px' }}>Standard Input:</Text>
                        <TextArea
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          placeholder="Enter input for your program..."
                          rows={3}
                          style={{ fontSize: '12px', marginTop: '4px' }}
                        />
                      </div>
                      
                      <Divider style={{ margin: '8px 0' }} />
                      
                      {/* Output Display */}
                      <div style={styles.outputSection}>
                        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                          <Text strong style={{ fontSize: '12px' }}>Output:</Text>
                          <Button
                            icon={<ClearOutlined />}
                            size="small"
                            onClick={clearOutput}
                            disabled={!output}
                          >
                            Clear
                          </Button>
                        </Space>
                        <pre style={styles.outputDisplay}>
                          {output || "No output yet. Click 'Run' to execute your code."}
                        </pre>
                      </div>
                    </div>
                  )
                },
                {
                  key: 'debug',
                  label: (
                    <Space>
                      <BugOutlined />
                      Debug
                    </Space>
                  ),
                  children: (
                    <div style={styles.tabContent}>
                      <Collapse size="small" ghost>
                        <Panel header="Call Stack" key="callstack">
                          <div style={styles.debugPanel}>
                            {debugState.callStack.length > 0 ? (
                              debugState.callStack.map((call, index) => (
                                <div key={index} style={styles.debugItem}>
                                  <Text style={{ fontSize: '12px' }}>{call}</Text>
                                </div>
                              ))
                            ) : (
                              <Text type="secondary" style={{ fontSize: '12px' }}>
                                No active debug session
                              </Text>
                            )}
                          </div>
                        </Panel>
                        
                        <Panel header="Local Variables" key="variables">
                          <div style={styles.debugPanel}>
                            {Object.keys(debugState.localVariables).length > 0 ? (
                              Object.entries(debugState.localVariables).map(([key, value]) => (
                                <div key={key} style={styles.debugItem}>
                                  <Text style={{ fontSize: '12px' }}>
                                    <strong>{key}:</strong> {String(value)}
                                  </Text>
                                </div>
                              ))
                            ) : (
                              <Text type="secondary" style={{ fontSize: '12px' }}>
                                No variables in scope
                              </Text>
                            )}
                          </div>
                        </Panel>
                        
                        <Panel header="Breakpoints" key="breakpoints">
                          <div style={styles.debugPanel}>
                            {breakpoints.length > 0 ? (
                              breakpoints.map((bp, index) => (
                                <div key={index} style={styles.debugItem}>
                                  <Space>
                                    <Badge status={bp.enabled ? "success" : "default"} />
                                    <Text style={{ fontSize: '12px' }}>
                                      {bp.file}:{bp.line}
                                    </Text>
                                    <Button 
                                      icon={<CloseCircleOutlined />} 
                                      size="small" 
                                      type="text"
                                      onClick={() => {
                                        setBreakpoints(prev => prev.filter((_, i) => i !== index));
                                      }}
                                    />
                                  </Space>
                                </div>
                              ))
                            ) : (
                              <Text type="secondary" style={{ fontSize: '12px' }}>
                                No breakpoints set
                              </Text>
                            )}
                          </div>
                        </Panel>
                      </Collapse>
                    </div>
                  )
                },
                {
                  key: 'settings',
                  label: (
                    <Space>
                      <SettingOutlined />
                      Settings
                    </Space>
                  ),
                  children: (
                    <div style={styles.tabContent}>
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <div>
                          <Text strong style={{ fontSize: '12px' }}>Theme:</Text>
                          <br />
                          <Switch
                            checked={theme === 'vs-dark'}
                            onChange={(checked) => setTheme(checked ? 'vs-dark' : 'light')}
                            checkedChildren="Dark"
                            unCheckedChildren="Light"
                          />
                        </div>
                        
                        <div>
                          <Text strong style={{ fontSize: '12px' }}>Font Size:</Text>
                          <br />
                          <Select
                            value={fontSize}
                            onChange={setFontSize}
                            style={{ width: '100%' }}
                            size="small"
                          >
                            {[10, 12, 14, 16, 18, 20, 22].map(size => (
                              <Option key={size} value={size}>{size}px</Option>
                            ))}
                          </Select>
                        </div>
                        
                        <Button
                          icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                          onClick={toggleFullscreen}
                          block
                          size="small"
                        >
                          {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                        </Button>
                      </Space>
                    </div>
                  )
                }
              ]}
            />
          </Card>
        </div>
      </div>
      
      {/* New File Modal */}
      <Modal
        title="Create New File"
        open={newFileModal}
        onOk={handleCreateFile}
        onCancel={() => setNewFileModal(false)}
        okText="Create"
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Text>File Name:</Text>
            <Input
              placeholder="Enter file name (e.g., main.cpp)"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onPressEnter={handleCreateFile}
            />
          </div>
          
          <div>
            <Text>Language:</Text>
            <Select
              value={newFileLanguage}
              onChange={setNewFileLanguage}
              style={{ width: '100%' }}
            >
              <Option value="cpp">C++</Option>
              <Option value="c">C</Option>
              <Option value="javascript">JavaScript</Option>
              <Option value="python">Python</Option>
              <Option value="java">Java</Option>
              <Option value="html">HTML</Option>
              <Option value="css">CSS</Option>
            </Select>
          </div>
        </Space>
      </Modal>
    </div>
  );
};

const styles = {
  container: {
    height: 'calc(100vh - 100px)',
    display: 'flex',
    flexDirection: 'column' as const,
    background: COLORS.background.primary,
  },
  fullscreenContainer: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
    background: COLORS.background.primary,
  },
  topToolbar: {
    borderRadius: 0,
    borderBottom: `1px solid ${COLORS.border.light}`,
    backgroundColor: COLORS.background.secondary,
    marginBottom: 0,
  },
  mainLayout: {
    display: 'flex',
    flex: 1,
    gap: '8px',
    padding: '8px',
    minHeight: 0,
  },
  leftPanel: {
    minWidth: '200px',
    maxWidth: '400px',
    backgroundColor: COLORS.background.secondary,
    borderRadius: RADIUS.md,
  },
  centerPanel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    minWidth: 0,
  },
  rightPanel: {
    minWidth: '300px',
    maxWidth: '500px',
    backgroundColor: COLORS.background.secondary,
    borderRadius: RADIUS.md,
  },
  panelCard: {
    height: '100%',
    borderRadius: RADIUS.md,
  },
  editorCard: {
    height: '100%',
    borderRadius: RADIUS.md,
    display: 'flex',
    flexDirection: 'column' as const,
  },
  fileTabsWrapper: {
    borderBottom: `1px solid ${COLORS.border.light}`,
  },
  editorArea: {
    flex: 1,
    minHeight: 0,
  },
  tabContent: {
    padding: '12px',
    height: 'calc(100vh - 250px)',
    overflowY: 'auto' as const,
  },
  inputSection: {
    marginBottom: '12px',
  },
  outputSection: {
    flex: 1,
  },
  outputDisplay: {
    background: '#1e1e1e',
    color: '#d4d4d4',
    padding: '8px',
    margin: '4px 0 0 0',
    fontSize: '12px',
    fontFamily: 'Monaco, Consolas, "Courier New", monospace',
    height: '200px',
    overflowY: 'auto' as const,
    whiteSpace: 'pre-wrap' as const,
    border: `1px solid ${COLORS.border.light}`,
    borderRadius: '4px',
  },
  debugPanel: {
    maxHeight: '150px',
    overflowY: 'auto' as const,
  },
  debugItem: {
    padding: '4px 0',
    borderBottom: `1px solid ${COLORS.border.light}`,
  },
  toolbar: {
    borderRadius: 0,
    borderBottom: `1px solid ${COLORS.border.light}`,
    backgroundColor: COLORS.background.secondary,
  },
  tabs: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
  },
  editorWrapper: {
    height: '400px',
    border: `1px solid ${COLORS.border.light}`,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
  outputPanel: {
    marginTop: SPACING.md,
    maxHeight: '200px',
    borderRadius: RADIUS.md,
  },
  output: {
    background: '#1e1e1e',
    color: '#d4d4d4',
    padding: SPACING.md,
    margin: 0,
    fontSize: '13px',
    fontFamily: 'Monaco, Consolas, "Courier New", monospace',
    maxHeight: '150px',
    overflowY: 'auto' as const,
    whiteSpace: 'pre-wrap' as const,
  },
};

export default CodeEditor;
