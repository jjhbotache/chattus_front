import { createGlobalStyle, keyframes } from 'styled-components';

export const colors = {
  primary: '#1C0221',
  secondary: '#7B5E7B',
  light: '#E0DEE3',
  accent: '#1C023D',
  shadow: '#6A0BFF',
};

const shining_shadow = keyframes`
  0%,100%{
    box-shadow: 0 0 .2em ${colors.shadow};
  }
  50%{
    box-shadow: 0 0 .7em ${colors.shadow};
  }
`;

export const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Nasalization';
    src: url('/fonts/nasalization-rg.otf' ) format('truetype');
  }
  @font-face {
    font-family: 'King';
    src: url('/fonts/KIN668.TTF') format('truetype') ;
  }

  body,html,#root {
    margin: 0;
    padding: 0;
    font-family: 'King', sans-serif;
    color: ${colors.light};
    height: 100%;
    width: 100vw;
    overflow-x: hidden;
    background: linear-gradient(
    90deg,
    ${colors.primary} 0%,
    ${colors.accent} 50%,
    ${colors.primary} 100%
  );
  }

  h1, h2, h3, h4, h5, h6{
    font-family: "Nasalization";
    color: ${colors.light};
    margin: 0;
    padding: 0;
    word-break: normal;
  }

  i,i::before,i::after{
    display: grid;
    place-items: center;
  }

  .title{
    font-family: "Nasalization";
    font-weight: 100;
    font-size: 4em;
    text-align: center;
  }

  .small{
    font-size: 0.8em;
    font-family: "King";
    color: ${colors.light};

  }

  .btn{
    font-weight: 100;
    font-size: 1.5em;
    font-family: "Nasalization";
    padding: 10px 20px;
    color: ${colors.light};
    background: ${colors.accent};
    border-radius: 9999em;
    border: none;
    box-shadow: 0 0 .4em ${colors.shadow};
    cursor: pointer;
    animation: ${shining_shadow} 4s infinite;
  }


  .htlmModalContainer{
    ul{
      list-style: none;
      padding: 0;
      margin: 0;
    }
    li{
      font-family: "King";
      font-size: .8em;
      margin: .5em 0;
    }
  }

  .tooltip {
    position: absolute;
    opacity: 0;
    z-index: 9999;
    background: #222;
    border-radius: 1em;
    padding: .5em;
    margin: .5em;
    transition: all .3s;
    cursor: pointer;
    display:none;

    &.open{
      display: block;
      opacity: 1;
      transform: translateY(0);

    }
  }

`;