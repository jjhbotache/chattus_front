import styled from "styled-components";
import { colors } from "../globalStyle";
import { Message } from "../interface/msgInterface";

const mockMessages: Message[] = [
  {
    message: "Hello",
    sender: "you",
    kind: "message",
  },
  {
    message: "Hi",
    sender: "me",
    kind: "message",
  },
  {
    message: "How are you?",
    sender: "you",
    kind: "message",
  },
  {
    message: "I'm fine, thanks",
    sender: "me",
    kind: "message",
  },
]
  

export default function Chat() {

  return(
    <Container>
      <div className="msgsContainer">
        {mockMessages.map((msg, index) => (
          <div key={index} className={`msg ${msg.sender === "you" && "myMessage"}`}>
            {msg.message}
            <i className="triangle fi fi-sr-triangle"></i>
          </div>
        ))}

      </div>
      <div className="msgContainer">
        <i className="fi fi-rr-square-plus"></i>
        <input type="text" className="msg" />
        <i className="fi fi-sr-microphone"></i>
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
      position: relative;
      padding: .5em;
      border-radius: .5em;
      background: ${colors.accent};
      /* box-shadow: 0 0 .4em ${colors.shadow}; */
      max-width: 80%;
      align-self: flex-start;
      color: ${colors.light};

      i,i::before,i::after{
        position: absolute;
        bottom: -2px;
        left: 0;
        font-size: .7em;
        rotate: -15deg;
        color: ${colors.accent};
      }
      
      
      &.myMessage{
        align-self: flex-end;
        background: ${colors.secondary};
        color: ${colors.light};
        i,i::before,i::after{
          left: unset;
          right: -0.33px;
          rotate: 15deg;
          color: ${colors.secondary};
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
