// import { RouterProvider } from 'react-router-dom'
// import router from './router/router'

// function App() {
  // const [messages, setMessages] = useState<Message[]>([])
  // const [inputMessage, setInputMessage] = useState<string>('')
  // const [room, setRoom] = useState<string>('')
  // const [connected, setConnected] = useState<boolean>(false)
  // const ws = useRef<WebSocket | null>(null)

  // async function connectToRoom () {
    
  //   if (room) {
  //     console.log("trying to connect to room", room);
  //     ws.current = new WebSocket(`${websocketPrefix}${apiUrl}/ws/${encodeURIComponent(room)}`)
  //     console.log("connected to room", room);
      
  //     ws.current.onmessage = (event: MessageEvent) => {
  //       console.log(event.data);
  //       const response:MessageResponse = JSON.parse(event.data)
  //       console.log(response);
        
  //       if (response.msgs) {
  //         const decodedMsgs = response.msgs.map((msg) => {  
  //           return {
  //             ...msg,
  //             message: msg.sender === 'System' ? msg.message : decoder(msg.message, room),
  //           }
  //         })
  //         setMessages(decodedMsgs)
  //       }
        
  //     }
  //     ws.current.onopen = () => {
        
  //       setConnected(true)
  //       setMessages([])
  //     }
  //     ws.current.onclose = () => {
  //       setConnected(false)
  //       setRoom('')
  //     }
  //   }
  // }

  // function sendMessage (e: React.FormEvent){
  //   e.preventDefault()
  //   if (inputMessage && ws.current) {
  //     ws.current.send(
  //       JSON.stringify({
  //         message: encoder(inputMessage, room),
  //         kind: 'message',
  //       }),
  //     )
  //     setInputMessage('')
  //   }
  // }

  // async function createRoom () {
  //   const response = await fetch(`${fetchPrefix}${apiUrl}/create_room`,{
  //     method: 'POST',
  //     headers: {'Content-Type': 'application/json',},
  //     body: JSON.stringify({
  //     fast_chat: false,
  //     once_view_photos_and_videos: false,
  //     mandatory_focus: false
  //     }),
  //   })
  //   const data: { room_code: string } = await response.json()
  //   setRoom(data.room_code)

  // }

  // useEffect(() => {
  //   if (room?.length >= 6) {
  //     connectToRoom()
  //   }
  // }, [room])

  // useEffect(() => {
  //   return () => {
  //     if (ws.current) {
  //       ws.current.close()
  //     }
  //   }
  // }, [])

  // return (
  //   <RouterProvider router={router} />
  // )
// }

// export default App