import React, { useState, useEffect, useRef } from 'react'
import './App.css'
import { Message } from './interface/msgInterface'
import { apiUrl, fetchPrefix, websocketPrefix } from './appConstants'
import { MessageResponse } from './interface/responses'
import encoder from './helpers/encoder'
import decoder from './helpers/decoder'

function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState<string>('')
  const [room, setRoom] = useState<string>(localStorage.getItem('room') || '')
  const [connected, setConnected] = useState<boolean>(false)
  const ws = useRef<WebSocket | null>(null)

  const connectToRoom = async () => {
    console.log("trying to connect to room", room);
    
    if (room) {
      ws.current = new WebSocket(`${websocketPrefix}${apiUrl}/ws/${encodeURIComponent(room)}`)
      console.log("connected to room", room);
      
      ws.current.onmessage = (event: MessageEvent) => {
        console.log(event.data);
        const response:MessageResponse = JSON.parse(event.data)
        console.log(response);
        
        if (response.msgs) {
          const decodedMsgs = response.msgs.map((msg) => {  
            return {
              ...msg,
              message: decoder(msg.message, room),
            }
          })
          setMessages(decodedMsgs)
        }
        
      }
      ws.current.onopen = () => {
        setConnected(true)
        setMessages([])
      }
      ws.current.onclose = () => {
        setConnected(false)
        localStorage.removeItem('room')
        setRoom('')
      }
    }
  }

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputMessage && ws.current) {
      ws.current.send(
        JSON.stringify({
          message: encoder(inputMessage, room),
          kind: 'message',
        }),
      )
      setInputMessage('')
    }
  }

  const createRoom = async () => {
    const response = await fetch(`${fetchPrefix}${apiUrl}/create_room`)
    const data: { room_code: string } = await response.json()
    setRoom(data.room_code)
    // save in LS
    localStorage.setItem('room', data.room_code)
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