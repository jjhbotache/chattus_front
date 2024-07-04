import styled from "styled-components";
import { colors } from "../globalStyle";
import { Message } from "../interface/msgInterface";
import { useState } from "react";

const mockMessages: Message[] = [
  {
    message: "Hello",
    sender: "you",
    kind: "message",
  },
  {
    message: "Hi",
    sender: "123544231",
    kind: "message",
  },
  {
    message: "How are you?",
    sender: "123544231",
    kind: "message",
  },
  {
    message: "I'm fine, thanks",
    sender: "123544231",
    kind: "message",
  },
]
  

export default function Chat() {
  const [textToSend, setTextToSend] = useState<string>("");

  return(
    <Container>
      <div className="msgsContainer">
        {mockMessages.map((msg, index) => (
          <div key={index} className={`msg ${msg.sender === "you" && "myMessage"}`}>
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
          ?<i className=" fi fi-ss-paper-plane-top"></i>
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
