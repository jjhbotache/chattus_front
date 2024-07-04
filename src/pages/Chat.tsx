import styled from "styled-components";

export default function Chat() {
  return(
    <Container>
      <h1 className="title">Chat</h1>
      <div className="middleContent">
        <span className="code">123456</span>
        <div className="icons">
          <i className="fi fi-sr-eye-crossed"></i>
          <i className="fi fi-sr-copy-alt"></i>
        </div>
      </div>
      <small> waiting for somebody to join the chat</small>
    </Container>
  )
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding: 1em .1em;
  box-sizing: border-box;

`;
