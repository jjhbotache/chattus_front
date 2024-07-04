import styled from "styled-components";
import { colors } from "../globalStyle";
import { Message } from "../interface/msgInterface";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import encoder from "../helpers/encoder";
import { useNavigate } from "react-router-dom";
import decoder from "../helpers/decoder";

  

export default function Chat() {
  const [textToSend, setTextToSend] = useState<string>("");
  const [msgs, setMsgs] = useState<Message[]>([]);
  const ws:WebSocket = useSelector((state: any) => state.websocket);
  const room:string = useSelector((state: any) => state.room);
  const navigate = useNavigate();

  useEffect(() => {
    if (ws !== null) {
      ws.onmessage = (event:MessageEvent) => {
        const response = JSON.parse(event.data);
        console.log(response);
        
        if (response.msgs) {
          const decodedMsgs = response.msgs.map((msg:Message) => {  
            return {
              ...msg,
              message: msg.sender === 'System' ? msg.message : decoder(msg.message, room),
            }
          })
          setMsgs(decodedMsgs);
        }
      }

      ws.onclose = () => {
        console.log("ws connection closed");
        navigate('/');
      }

    }else{
      console.log("No ws connection found");
      navigate('/');
    }


    const onKeydown = (e:KeyboardEvent) => {
      if (e.key === "Enter") {
        sendMessage();
      }
    }

    // listen to the enter key
    window.addEventListener("keydown", onKeydown);

    return () => {
      window.removeEventListener("keydown", onKeydown);
    }
  }, []);

  function sendMessage(){
    if (textToSend.length > 0) {
      ws.send(
          JSON.stringify({
            message: encoder(textToSend, room),
            kind: 'message',
          }),
        )
      setTextToSend("");
    }
  }

  return(
    <Container>
      <div className="msgsContainer">
        {msgs.map((msg, index) => (
          <div key={index} className={`msg ${msg.sender === "You" && "myMessage"}`}>
            <small>{msg.sender}</small>
            {msg.message}
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="triangle">
              <polygon points="0,0 100,0 0,100" />
            </svg>
          </div>
        ))}

      </div>
      
      <div className="msgContainer">
        <i className="fi fi-rr-square-plus"></i>
        <input type="text" className="msg" value={textToSend} onChange={(e) => setTextToSend(e.target.value)} />
        {
          textToSend.length > 0 
          ?<i onClick={sendMessage} className=" fi fi-ss-paper-plane-top"></i>
          :<i className="fi fi-rr-microphone"></i>
        }
      </div>
    </Container>
  )
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 90%;
  padding: .1em;
  box-sizing: border-box;

  .msgsContainer{
    display: flex;
    flex-direction: column;
    gap: .5em;
    height: 100%;
    padding: .5em;
    overflow-y: auto;
    background: ${colors.primary};
    border-radius: 1em;
    margin: .4em;
    box-shadow: 0 0 1em ${colors.shadow};
    margin-bottom: .8em;

    

    .msg{
      display: flex;
      flex-direction: column;

      position: relative;
      padding: .5em;
      border-radius: .5em;
      background: ${colors.accent};
      /* box-shadow: 0 0 .4em ${colors.shadow}; */
      max-width: 80%;
      align-self: flex-start;
      color: ${colors.light};

      overflow-wrap: break-word;

      max-width: 70%;
      small{
        opacity: .5;
        font-family: "Nazalization";
      }

      .triangle{
        height: 1em;
        aspect-ratio: 1;
        fill: ${colors.accent};
        position: absolute;
        bottom: -.5em;
        left: 0;
      }

      &.myMessage{
        small{text-align: end;}
        justify-content: flex-end;
        align-self: flex-end;
        background: ${colors.secondary};
        color: ${colors.light};
        .triangle{
          left: unset;
          right: 0;
          transform: rotateY(180deg);
          fill: ${colors.secondary};
        }
      }
      
      
    }

  }
  .msgContainer{
    margin: .4em;
    display: flex;
    gap: .2em;
    padding:  .2em .5em;
    border-radius: .5em;
    background: ${colors.accent};
    box-shadow: 0 0 .4em ${colors.shadow};
    min-height: 1.3em;

    i{
      font-size: 1.5em;
      color: ${colors.secondary};
      cursor: pointer;
      margin: .2em;
    }

    .msg{
      flex: 1;
      /* background: rgba(255,255,255,.1); */
      background: transparent;
      border: none;
      margin: 0;
      padding: 0;
      padding-top: auto;
      padding-left: .5em;
      color: ${colors.light};
      height: 100%;

      &:focus{
        outline: none;
      }
    }
  }
`;
