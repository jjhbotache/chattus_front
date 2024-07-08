import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { colors } from '../globalStyle';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setRoom } from '../redux/slices/roomSlice';
import { setWebsocket } from '../redux/slices/websocketSlice';

export default function Main() {
  const navigate = useNavigate();
  const dispacher = useDispatch();

  useEffect(() => {
    dispacher(setRoom(""))
    dispacher(setWebsocket(null))
  }, []);
  
  return (
    <Container>
      <div className="mainText">
        <h1 className='title'>Chattus</h1>
        <h2 className="subtitle">Temporary chat</h2>
      </div>
      <div className="btns">
        <button className='btn' onClick={() => navigate('/create-room')}>
          Create Room
        </button>
        <button className='btn' onClick={() => navigate('/join-room')}>
          Join Room
        </button>
      </div>
    </Container>
  );
};


const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-top: 1em;
  align-items: center;
  height: 60%;
  box-sizing: border-box;
  

  .mainText{
    .subtitle{
      font-family: "King";
      font-size: 1.2em;
      color: ${colors.light};
    }
  }

  .btns{
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
`;