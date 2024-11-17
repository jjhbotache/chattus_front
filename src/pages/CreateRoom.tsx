import styled from 'styled-components';
import { colors } from '../globalStyle';
import { useState } from 'react';
import { fetchAPI, websocketAPI } from '../appConstants';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setRoom } from '../redux/slices/roomSlice';
import { setWebsocket } from '../redux/slices/websocketSlice';
import LoadingScreen from './LoadingScreen';
import { toast } from 'react-toastify';
import { RoomConfigInterface } from '../interface/roomConfigInterface';
import Tooltip from '../components/createRoom/Tooltip';

const tooltipInfo = {
  "Max number users in room": "Set the maximum number of users allowed in the room. (Maximum: 10)",
  "Max secs of inactivity": "Set the maximum seconds of inactivity allowed in the room. If any message is sent after this time, the room will be closed.",
  "Max msgs in room": "Set the maximum number of messages allowed in the room. After this number, the first messages will be deleted (Maximum: 100)",
  "Mandatory focus": "Enable or disable mandatory focus in the room. If any user loses focus, the room will be closed."
};



export default function CreateRoom() {
  const [features, setFeatures] = useState<RoomConfigInterface>({
    "Max number users in room": 2,// max 10
    "Max secs of inactivity": 0,
    "Max msgs in room": 25, // max 100
    "Mandatory focus": false
  });
  const [loading, setLoading] = useState<boolean>(false);


  const navigate = useNavigate()
  const dispacher = useDispatch()

  function createRoom() {
    setLoading(true)
    fetch(fetchAPI + '/create_room',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        max_number_users_in_room : features["Max number users in room"],
        max_secs_of_inactivity : features["Max secs of inactivity"],
        max_msgs_in_room : features["Max msgs in room"],
        mandatory_focus : features["Mandatory focus"],
      })
    }).then(res => res.json()).then(async res => {
      if (res.room_code) {
        const wsUrl = websocketAPI + `/${encodeURIComponent(res.room_code)}`
        dispacher(setWebsocket(wsUrl))
        dispacher(setRoom(res.room_code))
        navigate('/share-code')
      }else{
        throw new Error('Failed to create room')
      }
      }).catch(err => {
      toast.error('Failed to create room')
      console.error(err)
    })
    .finally(() => {
      setLoading(false)
    })
  }


  return loading ? <LoadingScreen />:
  (
    <Container>
      <div className='mainContent'>
        <h1 className='title'>Create Room</h1>
        {
          Object.keys(features).map((key) => {
            const featureName = key as keyof RoomConfigInterface
            const value = features[featureName]


            const minValue = featureName === "Max number users in room" ? 2 : 0;
            const maxValue = featureName === "Max number users in room" ? 10 : 100;
            
            return(
            <div className="featureRow" key={featureName}>
              <label htmlFor={featureName}>
                <div>
                  <Tooltip label={tooltipInfo[featureName]}>
                    <i className='fi fi-sr-info'></i>
                  </Tooltip>
                  {featureName}
                  {
                    typeof value === "boolean" && <input type="checkbox" id={featureName} checked={value} onChange={(e) => setFeatures({ ...features, [key]: e.target.checked })} />
                  }                  
                </div>
                {
                  typeof value === "number"
                    ? <div className='numberWrapper'>
                      <input
                        type="number"
                        min={minValue}
                        max={maxValue}
                        value={value}
                        onChange={(e) => setFeatures({
                            ...features,
                            [key as keyof RoomConfigInterface]: parseInt(e.target.value) > minValue ? parseInt(e.target.value) : minValue 
                         })}
                        className='numberInput' />
                      <span className="numberText">{
                        value === 0 ? <i className='fi fi-br-infinity'></i> : value
                        }</span>
                      {/* + and - btns */}
                      <div className='btns'>
                        <i className='fi fi-br-plus' onClick={() => setFeatures({ ...features, [key as keyof RoomConfigInterface]: value + 1 <= maxValue ? value + 1 : value })}></i>
                        <i className='fi fi-br-minus' onClick={() => setFeatures({ ...features, [key as keyof RoomConfigInterface]: value - 1 >= minValue ? value - 1 : value })}></i>
                      </div>
                      
                    </div>
                    : <>
                    <span className={`statusText ${features[key as keyof RoomConfigInterface] ? 'enabled' : 'disabled'}`}>{value ? 'enabled' : 'disabled'}</span>
                    </>
                }
                
              </label>
            </div>
          )})
        }
      </div>
      <button onClick={createRoom} className='btn'>Create</button>
    </Container>
  );
};


const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 90%;
  padding: 1em;
  box-sizing: border-box;
  color: ${colors.light};

  .mainContent{
    width: 100%;
    .title{
      margin-bottom: .8em;
    }
  }

  .featureRow{
    
    display: flex;
    justify-content: center;
    align-items: center;
    padding: .8em 0;
    width: 100%;
    box-sizing: border-box;
    
    label{
      font-family: "Nasalization";
      &>div{
        display: flex;
        gap: .4em;
        width: 100%;
      }
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;

      input{
        opacity: 0;
        width: 100%;
        height: 100%;
      }
      .numberWrapper{
        position: relative;
        input{
          z-index: 2;
        }

        .numberText{
          position: absolute;
          top: 50%;
          right: 0;
          transform: translateY(-50%);
          font-size: large;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .btns{
          z-index: 3;
          display: flex;
          flex-direction: column;
          gap: .4em;
          position: absolute;
          top: 50%;
          right: 3em;
          transform: translateY(-50%);

          i{
            cursor: pointer;
            font-size: .5em;
            background-color: ${colors.secondary};
            padding: .3em;
            border-radius: 10%;
          }
        
        }
      }
      i{
        font-size: 1.2em;
      }

      .statusText{
        font-family: "King";
        width: 30%;
        margin-left: 1em;
        text-align: end;

        &.enabled{
          color: #b3ffb3;
        }
        &.disabled{
          color: #ffb4b4;
        }
      }
    }
  }
`;

