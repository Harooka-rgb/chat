import { ConfigProvider, theme } from 'antd'
import { MessageCircle } from 'lucide-react'
import Chat from "./components/chat"
import './App.css'

function App() {
  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <div className="app">
        <header className="header">
          <div className="logo">
            <MessageCircle size={32} />
            <span className="logo-text">beka</span>
          </div>
        </header>
        <Chat />
      </div>
    </ConfigProvider>
  )
}

export default App