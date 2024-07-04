import { createGlobalStyle } from 'styled-components';

export const colors = {
  primary: '#1C0221',
  secondary: '#7B5E7B',
  light: '#E0DEE3',
  accent: '#1C023D',
  shadow: '#6A0BFF',
};

export const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Nasalization';
    src: url('/fonts/nasalization-rg.otf') ;
  }
  @font-face {
    font-family: 'King';
    src: url('/fonts/KIN668.TTF') ;
  }

  body,html,#root {
    margin: 0;
    padding: 0;
    font-family: 'King', sans-serif;
    color: ${colors.light};
    height: 100%;
    width: 100vw;
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
    color: ${colors.secondary};
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
  }

`;