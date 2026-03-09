import { useEffect, useRef, useState } from "react"
import { supabase } from "../service/supabase"
import { Button, Card, Empty, Input, List, Typography } from "antd"
import { MessageCircle, SendHorizonal, Delete } from "lucide-react"

const { Text } = Typography

type Message = {
  id: number
  text: string
  created_at: string
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    loadMessages()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  async function loadMessages() {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Ошибка загрузки сообщений:", error.message)
      return
    }

    if (data) {
      setMessages(data)
    }
  }

  async function sendMessage() {
    const trimmedText = text.trim()

    if (!trimmedText) return

    setLoading(true)

    const { error } = await supabase.from("messages").insert({
      text: trimmedText,
    })

    if (error) {
      console.error("Ошибка отправки сообщения:", error.message)
      setLoading(false)
      return
    }

    setText("")
    await loadMessages()
    setLoading(false)
  }

  async function deleteMessage(id: number) {
    const { error } = await supabase.from("messages").delete().eq("id", id)

    if (error) {
      console.error("Ошибка удаления сообщения:", error.message)
      return
    }

    await loadMessages()
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  function handlePressEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      sendMessage()
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
        background:
          "linear-gradient(135deg, rgb(15, 23, 42), rgb(30, 41, 59))",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 700,
          borderRadius: 24,
          boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
        styles={{
          body: {
            padding: 20,
          },
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#1677ff",
              color: "#fff",
            }}
          >
            <MessageCircle size={22} />
          </div>

          <div>
            <Text type="secondary" style={{ color: '#ccc' }}>Beka messanger</Text>
          </div>
        </div>

        <div
          style={{
            height: 420,
            overflowY: "auto",
            padding: 12,
            borderRadius: 18,
            background: "#1f1f1f",
            border: "1px solid #333",
            marginBottom: 16,
          }}
        >
          {messages.length === 0 ? (
            <div
              style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Empty description="Сообщений пока нет" />
            </div>
          ) : (
            <List
              dataSource={messages}
              split={false}
              renderItem={(message) => (
                <List.Item 
                  style={{ padding: "8px 0", border: "none" }}
                  actions={[<Button type="text" icon={<Delete size={16} />} onClick={() => deleteMessage(message.id)} danger />]}
                >
                  <div
                    style={{
                      maxWidth: "80%",
                      background: "#1677ff",
                      color: "#fff",
                      padding: "12px 16px",
                      borderRadius: 18,
                      boxShadow: "0 8px 20px rgba(22,119,255,0.18)",
                      wordBreak: "break-word",
                    }}
                  >
                    <div style={{ fontSize: 15 }}>{message.text}</div>

                    <div
                      style={{
                        marginTop: 6,
                        fontSize: 11,
                        opacity: 0.8,
                        textAlign: "right",
                      }}
                    >
                      {new Date(message.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </List.Item>
              )}
            />
          )}

          <div ref={messagesEndRef} />
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
          }}
        >
          <Input
            size="large"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handlePressEnter}
            placeholder="Напиши сообщение..."
            style={{
              borderRadius: 14,
              height: 48,
            }}
          />

          <Button
            type="primary"
            size="large"
            loading={loading}
            onClick={sendMessage}
            icon={<SendHorizonal size={18} />}
            style={{
              height: 48,
              borderRadius: 14,
              paddingInline: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Send
          </Button>
        </div>
      </Card>
    </div>
  )
}