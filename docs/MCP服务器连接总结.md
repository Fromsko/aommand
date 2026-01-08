# MCP服务器连接总结

## 连接信息
- **服务器地址**: `http://192.168.196.200:3000/mcp`
- **连接模式**: Streamable HTTP (Server-Sent Events)
- **服务器类型**: MCP TypeScript Server v0.1.0
- **协议版本**: 2024-11-05

## 连接过程
1. ✅ 成功连接到本地MCP服务
2. 🔧 配置正确的HTTP头信息：
   - `Content-Type: application/json`
   - `Accept: application/json, text/event-stream`
3. 📡 使用JSON-RPC 2.0协议进行通信

## 可用工具

### 1. help工具
- **用途**: 获取所有注册命令的帮助信息
- **参数**: 无参数
- **调用方式**:
```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "help",
    "arguments": {}
  },
  "id": 请求ID
}
```

### 2. executeCommand工具
- **用途**: 执行注册的MCP命令
- **参数**:
  - `type`: 命令类型标识符 (如 'math.add')
  - `params`: 命令特定参数 (可选)
- **调用方式**:
```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "executeCommand",
    "arguments": {
      "type": "命令类型",
      "params": {}
    }
  },
  "id": 请求ID
}
```

## 服务器能力
- ✅ 支持tools功能 (`"tools":{"listChanged":true}`)
- 🔄 支持Server-Sent Events流式传输
- 📋 完整的JSON-RPC 2.0协议支持

## 使用示例

### 初始化连接
```bash
curl -X POST http://192.168.196.200:3000/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc": "2.0",
    "method": "initialize",
    "params": {
      "protocolVersion": "2024-11-05",
      "capabilities": {},
      "clientInfo": {
        "name": "claude-code",
        "version": "1.0.0"
      }
    },
    "id": 1
  }'
```

### 调用工具
```bash
curl -X POST http://192.168.196.200:3000/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "help",
      "arguments": {}
    },
    "id": 3
  }'
```

## 注意事项
1. ⚠️ 必须包含正确的Accept头信息
2. 🔧 使用标准的JSON-RPC 2.0格式
3. 📝 每个请求需要唯一的id
4. 🔄 响应通过Server-Sent Events格式返回

## 当前状态
- ✅ MCP服务器正常运行
- 🛠️ 基础工具可用
- 🔧 可通过executeCommand注册更多功能
- 📡 Streamable HTTP模式工作正常
