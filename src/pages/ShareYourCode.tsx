import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components"
import { MessageResponse } from "../interface/responses";
import { toast } from "react-toastify";
import QRCode from "react-qr-code";

export default function ShareYourCode() {
  const code = useSelector((state: any) => state.room);
  const wsUrl:string = useSelector((state: any) => state.websocket);
  const [visibleCode, setvisibleCode] = useState<boolean>(false);
  const navigate = useNavigate();
  const link = useRef<string>(`${window.location.origin}/join-room?code=${code}`);


  useEffect(() => {
    // connect to websocket and wait for someone to join

    const ws = new WebSocket(wsUrl);
    ws.onopen = () => {
      console.log('ws connected')
    }
    ws.onmessage = (event:MessageEvent) => {
      const response:MessageResponse = JSON.parse(event.data)
      console.log('ws message', response);
      
      if (response.msgs) {
        navigate('/chat')
      }
    }
    ws.onerror = (event) => {
      console.log('ws error', event)
    }
  }, [code, navigate])

  function onCopyUrl() {
    navigator.clipboard.writeText(link.current)
    toast.success('Link copied to clipboard')
  }

  return(
    <Container>
      <h1 className="title">Share your code</h1>
      <div className="middleContent">
        <div className="qrContainer">
          <QRCode value={link.current} />
        </div>
        <span className="code">{visibleCode ? code : '******'}</span>
        <div className="icons">
          <i className={`fi fi-sr-eye${visibleCode
            ? '-crossed'
            : ''}`}
            onClick={() => setvisibleCode (!visibleCode) }
          ></i>
          <i 
          onClick={onCopyUrl}
          className="fi fi-sr-copy-alt"></i>
        </div>
      </div>
      <small> waiting for somebody to join the chat</small>
    </Container>
  )
};


const blinkingMsg = keyframes`
  0%, 100% { opacity: .5; }
  50% { opacity: 1; }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 90%;
  padding: 1em .1em;
  box-sizing: border-box;
  .title{
    font-size: 2em;
  }

  .middleContent{
    display: flex;
    flex-direction: column;
    align-items: center;
    .qrContainer{
      width: 95%;
      max-width: 300px;
      aspect-ratio: 1/1;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: .2em;
      background-color: white;
      box-sizing: border-box;
      border-radius: .2em;
    }
    .code{
      font-size: 3em;
      padding: .1em;
      box-sizing: border-box;
      font-family: "King";
      text-align: center;
      width: 100%;
      letter-spacing: 0.2em;
    }
    .icons{
      display: flex;
      justify-content: space-around;
      width: 100%;
      i{
        font-size: 2em;
        cursor: pointer;
      }
    }
  }
  small{
    font-size: 1.5em;
    text-align: center;
    animation: ${blinkingMsg} 2s infinite;
  }
`;
  