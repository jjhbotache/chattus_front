import React, { useState, useEffect, useRef } from 'react'
import './App.css'
import { Message } from './interface/msgInterface'
import { apiUrl } from './appConstants'

function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState<string>('')
  const [room, setRoom] = useState<string>('')
  const [connected, setConnected] = useState<boolean>(false)
  const ws = useRef<WebSocket | null>(null)

  const connectToRoom = async () => {
    console.log("trying to connect to room", room);
    
    if (room) {
      ws.current = new WebSocket(`wss://${apiUrl}/ws/${room}`)
      console.log("connected to room", room);
      
      ws.current.onmessage = (event: MessageEvent) => {
        const parsedData:Message[] = JSON.parse(event.data)
        console.log(parsedData );
        setMessages(parsedData)
        
      }
      ws.current.onopen = () => {
        setConnected(true)
      }
      ws.current.onclose = () => {
        setConnected(false)
      }
    }
  }

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputMessage && ws.current) {
      ws.current.send(
        JSON.stringify({
          message: inputMessage,
          kind: 'message',
        }),
      )
      setInputMessage('')
    }
  }

  const createRoom = async () => {
    const response = await fetch(`https://${apiUrl}/create_room`)
    const data: { room_code: string } = await response.json()
    setRoom(data.room_code)
  }

  useEffect(() => {
    return () => {
      if (ws.current) {
        ws.current.close()
      }
    }
  }, [])

  return (
    <div className="chat-container">
      <h1>WebSocket Chat</h1>
      {!connected ? (
        <div>
          <input
            type="text"
            value={room}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRoom(e.target.value)}
            placeholder="Enter room code"
          />
          <button onClick={connectToRoom}>Join Room</button>
          <button onClick={createRoom}>Create Room</button>
        </div>
      ) : (
        <div>
          <div className="messages">
            {messages.map((msg, index) => (
              <div key={index}>
                <strong>{msg.sender}:</strong>
                <p>{msg.message}</p>
              </div>
            ))}
          </div>
          <form onSubmit={sendMessage}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </div>
  )
}

export default App