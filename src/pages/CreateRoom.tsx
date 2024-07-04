import styled from 'styled-components';
import { colors } from '../globalStyle';
import { useState } from 'react';
// import { Container, Title, Button, Input } from '../styles';

interface Features {
  "Fast chat": boolean;
  "Mandatory focus": boolean;
  "Only watch once videos & photos": boolean;
}



export default function CreateRoom() {
  // const [fastChat, setFastChat] = useState(false);
  // const [mandatoryFocus, setMandatoryFocus] = useState(false);
  // const [onlyOncePhotos, setOnlyOncePhotos] = useState(false);
  const [features, setFeatures] = useState<Features>({
    "Fast chat": false,
    "Mandatory focus": false,
    "Only watch once videos & photos": false,
  });



  return (
    <Container>
      <div className='mainContent'>
        <h1 className='title'>Create Room</h1>
        {
          Object.keys(features).map((key) => (
            <div className="featureRow" key={key}>
              <label htmlFor={key}>
                <div>
                  <i className='fi fi-sr-info'></i>
                  {key}
                  <input type="checkbox" id={key} checked={features[key as keyof Features]} onChange={(e) => setFeatures({ ...features, [key]: e.target.checked })} />
                </div>
                <span className={`statusText ${features[key as keyof Features] ? 'enabled' : 'disabled'}`}>{features[key as keyof Features] ? 'enabled' : 'disabled'}</span>
              </label>
            </div>
          ))
        }
      </div>
      <button className='btn'>Create</button>
    </Container>
  );
};


const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100vh;
  padding: 1em;
  box-sizing: border-box;
  background: ${colors.primary};
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
        display: none;
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

