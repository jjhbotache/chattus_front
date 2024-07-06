import styled, { keyframes } from 'styled-components';
import { colors } from '../globalStyle';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { websocketAPI } from '../appConstants';
import { setWebsocket } from '../redux/slices/websocketSlice';
import { setRoom } from '../redux/slices/roomSlice';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from './LoadingScreen';
import { toast } from 'react-toastify';
const codeLength = 6;
export default function JoinRoom() {
  const [inputCode, setInputCode] = useState<string>('');
  const [focusInput, setfocusInput] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const dispacher = useDispatch();
  const navigate = useNavigate();
  
  async function joinRoom(){
    // set the room code in the store and the ws
    if (inputCode.length === codeLength) {
      setLoading(true)
      const wsConnection = new WebSocket(websocketAPI + `/${encodeURIComponent(inputCode)}`);
      wsConnection.onopen = () => {
        setLoading(false)
        dispacher(setWebsocket(wsConnection))
        dispacher(setRoom(inputCode))
        navigate('/chat')
      };
      wsConnection.onclose = () => {
        dispacher(setWebsocket(null))
        dispacher(setRoom(""))
        navigate('/')
      };
      wsConnection.onerror = (error) => {
        setLoading(false)
        toast.error("Failed to connect to the room. Verify the code and try again.");
        console.log(error);
        
      };
    }
  }

  return loading ? <LoadingScreen />:
  (
    <Container>
      <h1 className='title'>Join Room</h1>
      <div className="codeInputContainer">
        <input type="text" 
          value={inputCode} 
          onChange={(e) => {setInputCode(e.target.value)}}
          maxLength={codeLength}
          onFocus={() => setfocusInput(true)}
          onBlur={() => setfocusInput(false)}
         />
        {
          Array.from({ length: codeLength }).map((_, i) => (
            <div className={`
              codeChar 
              ${inputCode.length === codeLength ? 'completed' : ''}
              ${inputCode[i] ? 'fullfiled' : ''} 
              ${i === inputCode.length ? 'active' : ''}
              ${i === inputCode.length && focusInput ? 'next' : ''}
            `} key={i}>
              <span>{inputCode[i]}</span>
            </div>
          ))
        }
      </div>
      <button className='btn' 
        onClick={joinRoom}
        disabled={inputCode.length !== codeLength}
       >
        Join
      </button>
    </Container>
  );
};

const blinking_border = keyframes`
  0%{
    border-color: ${colors.light}22;
  }
  50%{
    border-color: ${colors.light};
  }
  100%{
    border-color: ${colors.light}22;
  }
`;

const completed_border = keyframes`
  0%{
    border-color: ${colors.secondary};
  }
  50%{
    border-color: ${colors.shadow};
  }
  100%{
    border-color: ${colors.secondary};
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 90%;
  padding: 1em;
  box-sizing: border-box;
  color: ${colors.light};

  .codeInputContainer{
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
    position: relative;

    input{
      width: 100%;
      height: 5em;
      opacity: 0;
      position: absolute;
      z-index: 2;
    }
  
    .codeChar{
      width: 2em;
      height: 3em;
      border-bottom: .4em solid ${colors.light}22;
      display: flex;
      flex-direction: column;
      justify-content: end;
      span{
        font-size: 2em;
        text-align: center;
      }

      &.fullfiled{
        border-color: ${colors.light};
      }
      &.active{
        border-color: ${colors.secondary};
      }
      &.completed{
        animation: ${completed_border} 1s infinite;
      }
      &.next{
        animation: ${blinking_border} .7s infinite;
      }
    }
  }
`;
