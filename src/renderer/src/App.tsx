import { HashRouter, Link, Route, Routes } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import { Content, Header } from 'antd/es/layout/layout'
import Home from '@renderer/pages/Home'
import TodoPage from '@renderer/pages/TodoPage'

function App(): React.JSX.Element {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <>
      {/*<a target="_blank" rel="noreferrer" onClick={ipcHandle}>*/}
      {/*  Send IPC*/}
      {/*</a>*/}

      <HashRouter>
        <Layout style={{ minHeight: '100vh' }}>
          <Header>
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['home']}>
              <Menu.Item key="home">
                <Link to="/">首页</Link>
              </Menu.Item>
              <Menu.Item key="todo">
                <Link to="/todo">Todo</Link>
              </Menu.Item>
              <Menu.Item key="views">
                <Link to="/views">视图</Link>
              </Menu.Item>
            </Menu>
          </Header>
          <Content style={{ padding: 24 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/todo" element={<TodoPage />} />
              <Route path="/views" element={<Home />} />
            </Routes>
          </Content>
        </Layout>
      </HashRouter>
    </>
  )
}

export default App
