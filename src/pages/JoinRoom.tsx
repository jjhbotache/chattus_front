import styled, { keyframes } from 'styled-components';
import { colors } from '../globalStyle';
import { useState } from 'react';
const codeLength = 6;
export default function JoinRoom() {
  const [code, setcode] = useState<string>('');
  const [focusInput, setfocusInput] = useState<boolean>(false);
  
  return (
    <Container>
      <h1 className='title'>Join Room</h1>
      <div className="codeInputContainer">
        <input type="text" 
          value={code} 
          onChange={(e) => {setcode(e.target.value)}}
          maxLength={codeLength}
          onFocus={() => setfocusInput(true)}
          onBlur={() => setfocusInput(false)}
         />
        {
          Array.from({ length: codeLength }).map((_, i) => (
            <div className={`
              codeChar 
              ${code.length === codeLength ? 'completed' : ''}
              ${code[i] ? 'fullfiled' : ''} 
              ${i === code.length ? 'active' : ''}
              ${i === code.length && focusInput ? 'next' : ''}
            `} key={i}>
              <span>{code[i]}</span>
            </div>
          ))
        }
      </div>
      <button className='btn'>
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
  background: ${colors.primary};
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
