import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    outline: 0;
    box-sizing: border-box;
  }

  body {
    background: #f0f0f0;
    -webkit-font-smoothing: antialiased;
  }

  html, body, #root {
    height: 100%;
  }
  
  body, input, button {
    font: 16px "Roboto", sans-serif;
  }
  
  button {
    cursor: pointer;
  }
`;
