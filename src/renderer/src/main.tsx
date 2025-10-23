import './assets/App.css'
// antd v5 默认兼容 React 16 ~ 18 版本，绝大多数功能也兼容于 React 19 版本。
import '@ant-design/v5-patch-for-react-19'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { ConfigProvider } from 'antd'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider
      theme={{ token: {} }}
      componentSize="small" // ⬅️ 全局紧凑
    >
      <App />
    </ConfigProvider>
  </StrictMode>
)
