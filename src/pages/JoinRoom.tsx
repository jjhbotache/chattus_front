import styled, { keyframes } from 'styled-components';
import { colors } from '../globalStyle';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchAPI, websocketAPI } from '../appConstants';
import { setWebsocket } from '../redux/slices/websocketSlice';
import { setRoom } from '../redux/slices/roomSlice';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoadingScreen from './LoadingScreen';
import { toast } from 'react-toastify';
import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';
import Swal from 'sweetalert2';


const codeLength = 6;
export default function JoinRoom() {
  const [inputCode, setInputCode] = useState<string>('');
  const [focusInput, setfocusInput] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const [scanning, setScanning] = useState<boolean>(false);

  const dispacher = useDispatch();
  const navigate = useNavigate();
  
  async function joinRoom(code: string) {
    // set the room code in the store and the ws
    if (code.length === codeLength ) {
      setLoading(true)
      const url = websocketAPI + `/${encodeURIComponent(code)}`;
      const response = await fetch(fetchAPI + `/verify_room/${encodeURIComponent(code)}`);
      const data = await response.json();
      console.log(data);
      

      if (data.room_exists && data.room_data) {

        let settingsHtml = `<h5>Settings:</h5><ul>`

        Object.keys(data.room_data).forEach((setting:string)=>{
          // replace _ with spaces and uppercase the first letter
          
          const parsedSetting = setting.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase());
          const value = data.room_data[setting];

          settingsHtml += `
          <li>
          <strong>
            ${parsedSetting}:
          </strong>
           ${typeof value== "boolean" 
              ?value ? "✅" : "❌"
              :value == 0 ? "♾️" : value
          }
           </li>`

        })

        settingsHtml += `</ul>`


        const answ = await Swal.fire({
          title: 'Joining Room!',
          icon: 'warning',
          iconColor: colors.secondary,
          showCancelButton: true,
          background: colors.primary,
          color: colors.light,
          confirmButtonColor: colors.secondary,
          cancelButtonColor: colors.accent,
          confirmButtonText: 'Join',
          html: settingsHtml,
          customClass: {
            htmlContainer: 'htlmModalContainer',
          }

        })
        if (answ.isConfirmed) {
          dispacher(setWebsocket(url));
          dispacher(setRoom(code));
          navigate('/chat');
        }else{
          setLoading(false)
          dispacher(setWebsocket(null));
          dispacher(setRoom(""));
          toast.info("Room not joined!");  
        }
      }else{
        setLoading(false)
        dispacher(setWebsocket(null));
        dispacher(setRoom(""));
        toast.error("Room not found!");  
      }
    }
  }

  function scaned(data:IDetectedBarcode[]) {
    console.log('scanned', data);
    const url = new URL(data[0].rawValue);
    const code = url.searchParams.get('code');
    
    setInputCode(code as string);
    setScanning(false);
    joinRoom(code as string);    
  }

  useEffect(() => {
    if (searchParams.has('code')) {
      setInputCode(searchParams.get('code') as string);
      joinRoom(searchParams.get('code') as string);
    }
  }, []);

  return loading ? <LoadingScreen />:
  (
    <Container>
      {scanning && <Scanner onScan={scaned}  />}

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
      <div className='btnsContainer'>
        <button className='btn qrBtn' onClick={()=>setScanning(!scanning)} >
          <i className='fi fi-ss-qr-scan'></i>
        </button>
        <button className='btn' 
          onClick={()=>joinRoom(inputCode)}
          disabled={inputCode.length !== codeLength}
        >
          Join
        </button>
      </div>
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

  .btnsContainer{
    display: flex;
    justify-content: space-evenly;
    width: 100%;
    margin-top: 1em;
    .qrBtn{
      padding: .5em;
      border-radius: .5em;
      i{
        font-size: 1em;
      }
    }
  }

`;
