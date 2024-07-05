import styled from "styled-components";
import { colors } from "../globalStyle";
import { Message } from "../interface/msgInterface";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import encoder from "../helpers/encoder";
import { useNavigate } from "react-router-dom";
import decoder from "../helpers/decoder";
import base64ToBlob from "../helpers/base64ToBlob";
import getMimeType from "../helpers/getMimeTipe";

  

export default function Chat() {
  const [textToSend, setTextToSend] = useState<string>("");
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [optionsDeployed, setOptionsDeployed] = useState<boolean>(false);
  const ws:WebSocket = useSelector((state: any) => state.websocket);
  const room:string = useSelector((state: any) => state.room);
  const navigate = useNavigate();
  const msgsContainerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    // scroll to the bottom of the messages container
    if (msgsContainerRef.current !== null) {
      msgsContainerRef.current.scrollTop = msgsContainerRef.current.scrollHeight;
    }
  }, [msgs]);

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

  function downloadFile(base64:string) {
    const [prefix, base64Content] = base64.split(',');
    const mimeType = getMimeType(prefix);
    console.log(mimeType);
    

    // Convierte base64 a Blob
    const blob = base64ToBlob(base64Content, mimeType || "");
    console.log(blob);
    

    const url = URL.createObjectURL(blob);
    console.log(url);
    

    // download the file
    const a = document.createElement("a");
    a.href = url;
    a.download = `file.${mimeType?.split('/')[1] || "txt"}`;
    a.click();


  }


  function onAddVideo(){
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "video/*";
    input.click();
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const fileExtension = file.name.split('.').pop();
        // convert the file to a base64 string
        const reader = new FileReader();
        reader.onloadend = () => {
          // reader.result contains the base64 string
          const base64String = reader.result;
          console.log(base64String); // Aquí puedes hacer lo que necesites con la cadena base64
          ws.send(
            JSON.stringify({
              message: encoder(base64String as string, room),
              kind: 'video',
              extension: fileExtension,
            }),
          )
          setTextToSend("");
          setOptionsDeployed(false);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  function onAddAudio(){
    console.log("add audio");
  }

  function onAddFile(){
    const input = document.createElement("input");
    input.type = "file";
    input.click();
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const fileExtension = file.name.split('.').pop();
        // convert the file to a base64 string
        const reader = new FileReader();
        reader.onloadend = () => {
          // reader.result contains the base64 string
          const base64String = reader.result;
          console.log(base64String); // Aquí puedes hacer lo que necesites con la cadena base64
          ws.send(
            JSON.stringify({
              message: encoder(base64String as string, room),
              kind: 'file',
              extension: fileExtension,
            }),
          )
          setTextToSend("");
          setOptionsDeployed(false);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  function onAddImg(){
    // open the gallery
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const fileExtension = file.name.split('.').pop();
        // convert the file to a base64 string
        const reader = new FileReader();
        reader.onloadend = () => {
          // reader.result contains the base64 string
          const base64String = reader.result;
          console.log(base64String); // Aquí puedes hacer lo que necesites con la cadena base64
          ws.send(
            JSON.stringify({
              message: encoder(base64String as string, room),
              kind: 'image',
              extension: fileExtension,
            }),
          )
          setTextToSend("");
          setOptionsDeployed(false);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  return(
    <Container>
      <div className="msgsContainer" ref={msgsContainerRef}>
        {msgs.map((msg, index) => (
          <div key={index} className={`msg ${msg.sender === "You" && "myMessage"}`}>
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="triangle"><polygon points="0,0 100,0 0,100" /></svg>


            <small>{msg.sender}</small>
            {
              msg.kind === "message" 
              ?<span>{msg.message}</span>
              :msg.kind === "image" 
              ?<img src={msg.message} alt="img" />
              :msg.kind === "video" 
              ?<video src={msg.message} controls></video>
              :msg.kind === "audio" 
              ?<audio src={msg.message} controls></audio>
              :<button onClick={()=>downloadFile(msg.message)}>
                <i className="fi fi-sr-down-to-line"></i>
                Download file
              </button>

            }
            
          </div>
        ))}

      </div>
      
      <div className="msgContainer">
        {optionsDeployed ? <>
          <i onClick={onAddImg} className="fi fi-sr-picture"></i>
          <i onClick={onAddVideo} className="fi fi-rr-film"></i>
          <i onClick={onAddFile} className="fi fi-rr-square-plus"></i>
          <i onClick={()=>setOptionsDeployed(false)} className="fi fi-sr-angle-circle-left"></i>
        </>:<>
          <i onClick={()=>setOptionsDeployed(true)} className="fi fi-sr-angle-circle-right"></i>
        </>
        }
        <input type="text" className="msg" value={textToSend} onChange={(e) => setTextToSend(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (sendMessage())}  />
        {
          textToSend.length > 0 
          ?<i onClick={sendMessage} className=" fi fi-ss-paper-plane-top"></i>
          :<i onClick={onAddAudio} className="fi fi-rr-microphone"></i>
        }
      </div>
    </Container>
  )
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding: .1em;
  box-sizing: border-box;

  .msgsContainer{
    flex: 1;
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

    /* hide the scroll bar */
    &::-webkit-scrollbar {
      display: none;
    }

    img{
      max-height: 100vh;
    }
    button{
      display: flex;
      gap: .5em;
      align-items: center;
      background: ${colors.light};
      color: ${colors.secondary};
      padding: .5em;
      border-radius: .5em;
      border: none;
      cursor: pointer;
    }

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
      width: 100%;
      /* background: rgba(255,255,255,.1); */
      background: transparent;
      border: none;
      margin: 0;
      padding: 0;
      padding-left: .5em;
      color: ${colors.light};
      height: 100%;

      &:focus{
        outline: none;
      }
    }
  }
`;
