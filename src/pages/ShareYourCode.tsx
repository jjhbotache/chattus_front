import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components"

export default function ShareYourCode() {
  const [code, setCode] = useState<string>('123456');
  const [visibleCode, setvisibleCode] = useState<boolean>(false);

  useEffect(() => {
    const code = Math.random().toString().slice(2, 8);
    setCode(code);
  }, []);
  return(
    <Container>
      <h1 className="title">Share your code</h1>
      <div className="middleContent">
        <span className="code">{visibleCode ? code : '******'}</span>
        <div className="icons">
          <i className={`fi fi-sr-eye${visibleCode
            ? '-crossed'
            : ''}`}
            onClick={() => setvisibleCode (!visibleCode) }
          ></i>
          <i 
          onClick={() => navigator.clipboard.writeText(code)}
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
  height: 100%;
  padding: 1em .1em;
  box-sizing: border-box;

  .middleContent{
    display: flex;
    flex-direction: column;
    align-items: center;
    .code{
      font-size: 4em;
      margin: .1em;
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
  