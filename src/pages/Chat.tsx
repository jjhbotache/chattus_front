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
import { motion } from "framer-motion";
import AudioCustomComponent from "../components/global/AudioCustomComponent";

  

export default function Chat() {
  const [textToSend, setTextToSend] = useState<string>("");
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [optionsDeployed, setOptionsDeployed] = useState<boolean>(false);
  const ws:WebSocket = useSelector((state: any) => state.websocket);
  const room:string = useSelector((state: any) => state.room);
  const navigate = useNavigate();
  const msgsContainerRef = useRef<HTMLDivElement>(null);
  const [msgToReply, setMsgToReply] = useState<Message | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    if (ws !== null) {
      ws.onmessage = (event:MessageEvent) => {
        const response = JSON.parse(event.data);
        console.log(response);
        
        if (response.msgs) {
          const decodedMsgs = response.msgs.map((msg:Message) => {  
            let msgText = msg.sender === 'System' ? msg.message : decoder(msg.message, room)

            const msgObjToReturn = {
              ...msg,
              message: msgText,
            }

            if(msgText.includes("REPLYINGTO(")){
              const [replayedText, realMsg] = msgText.replace("REPLYINGTO(","").split(")");
              msgObjToReturn.message = realMsg;
              msgObjToReturn.replyingTo = replayedText;
            }
            
            
            return msgObjToReturn;
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
      let msgToSend = textToSend;
      if (msgToReply){
        const replayedText = msgToReply.kind === "message" ? msgToReply.message.substring(0, 15) : msgToReply.kind;
        msgToSend = `REPLYINGTO(${replayedText})${msgToSend}`;
      }
      ws.send(
          JSON.stringify({
            message: encoder(msgToSend, room),
            kind: 'message',
          }),
        )
      setTextToSend("");
      setOptionsDeployed(false);
      setMsgToReply(null);
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


  function onAddFile(){
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "*/*";
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

  function recordAndSendAud() {

    // ask permission to use the microphone
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream:MediaStream) => {
        record(stream);
      })

    function record(stream:MediaStream) {
      mediaRecorder.current = new MediaRecorder(stream);
      
      
      let audioChunks:Blob[] = [];

      mediaRecorder.current.ondataavailable = (e) => {audioChunks.push(e.data);}
      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onloadend = () => {
          // if the recording is less than 3 secs, don't send it
          const seconds = audioBlob.size/19655;

          
          if (seconds < 1) {
            console.log("Recording is less than 1 secs");
            return;
          }

          const base64String = reader.result;
          ws.send(
            JSON.stringify({
              message: encoder(base64String as string, room),
              kind: 'audio',
              extension: "webm",
            }),
          )
          setTextToSend("");
          setOptionsDeployed(false);
        }
        reader.readAsDataURL(audioBlob);
      }

      mediaRecorder.current.start();
    }


  }

  function stopRecording() {
    mediaRecorder.current && mediaRecorder.current.stop();
  }

  return(
    <Container>
      <div className="msgsContainer" ref={msgsContainerRef}>
        {msgs.map((msg, index) => (
          <motion.div 
          drag="x"
          whileDrag={{ scale: 1.1 }}
          dragSnapToOrigin={true}
          dragConstraints={
            msg.sender === "You"
            ? { right: 0, left: -100}
            : { right: 100, left: 0}
          }
          onDragEnd={(_, info) => {if (info.point.x > 50 || info.point.x < -50) setMsgToReply(msg);}}
          dragElastic={0.01}
          key={index} className={`msg ${msg.sender === "You" && "myMessage"}`}>
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="triangle"><polygon points="0,0 100,0 0,100" /></svg>
          
            <i  onClick={() => setMsgToReply(msg)} className={`fi fi-br-reply-all replyIcon ${msg.sender === "You" && "left"}`}></i>

            <small>{msg.sender}</small>
            {
              msg.replyingTo && <span className="reply">
                <span>Replying to:</span>
                {msg.replyingTo}...
              </span>
            }
            

            {
              msg.kind === "message" 
              ?<span>{msg.message}</span>
              :msg.kind === "image" 
              ?<img src={msg.message} alt="img" />
              :msg.kind === "video" 
              ?<video src={msg.message} controls></video>
              :msg.kind === "audio" 
              ?<AudioCustomComponent src={msg.message} />
              // <audio src={msg.message} controls ></audio>
              :<button onClick={()=>downloadFile(msg.message)}>
                <i className="fi fi-sr-down-to-line"></i>
                Download file
              </button>
            }

            
            
          </motion.div>
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
          :<motion.div
          onTapStart={recordAndSendAud}

          onPointerUp={stopRecording}
          whileTap={{
            scale: 5,
            backgroundColor: colors.secondary,
            borderRadius: "50%",
          }}
          
          >
            <i className={`fi fi-rr-microphone voiceIcon `}></i>
          </motion.div>
        }

        {
          msgToReply && <div className="toReplyMsg">
            <i className="fi fi-sr-cross-circle" onClick={() => setMsgToReply(null)}></i>
            <small>Replying to:</small>
            <span className="txt"> {msgToReply.kind === "message" ? msgToReply.message : msgToReply.kind} </span>
          </div>
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
  overflow: hidden; 

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
    audio{
      width: 50vw;
      max-width: 100%;
      font-size: .3em;
      height: clamp(4em, 15vw, 5em);
      /* make smaller */
      &::-webkit-media-controls-volume-slider-container,
      &::-webkit-media-controls-volume-slider,
      &::-webkit-media-controls-mute-button
      {
        display: none;
      }
      
      
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

      small{
        opacity: .5;
        font-family: "Nazalization";
      }

      .reply{
        display: flex;
        flex-direction: column;
        
        background: rgba(0,0,0,.1);
        box-shadow: 0 0 .2em black inset;
        color: ${colors.light}bb;
        padding: .2em;
        font-size: .8em;
        border-radius: .5em;
        margin: .2em 0;
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
      
      .replyIcon{
        position: absolute;
        top: -.5em;
        right: -.5em;
        font-size: .6em;
        padding: .3em;
        background: rgba(255,255,255,.6);
        color: ${colors.primary};
        border-radius: 50%;
        cursor: pointer;
        &.left{
          right: unset;
          left: -.5em;
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
    position: relative;

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

    .toReplyMsg{
      small{
        color: ${colors.light}aa;
      }
      display: flex;
      flex-direction: column;
      position: absolute;
      top: -4em;
      left: 0;
      background: ${colors.secondary};
      padding: .5em;
      width: 80%;
      border-radius: .5em;
      .txt{
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      i{
        position: absolute;
        top: -.5em;
        right: -.5em;
        font-size: 1.2em;
        color: ${colors.light};
        background-color: ${colors.secondary};
        border-radius: 50%;
        cursor: pointer;
      }
    }

    .voiceIcon{
      background: ${colors.accent};
      padding: .1em;
      border-radius: 50%;

    }
  }
`;
