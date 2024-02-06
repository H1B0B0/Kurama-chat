import styled from 'styled-components';
import { darken, lighten } from 'polished';

export const Container = styled.div`
  height: 100%;
  background-image: url("bg.png");
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
 

  form {
    width: 100%;
    max-width: 350px;
    display: flex;
    flex-direction: column;
    background-color:
    

    
    h2 {
      align-self: center;
      color: #222;
      color: #E20000;
      font-size: 30px;
      padding: 0.5rem;
      
    }

     p {
      align-self: center;
      color: #474749;
      margin: 10px;
    }

    h2 {
      align-self: center;
      color: #222;
      color: #E20000;
      font-size: 30px;
      padding: 0.2rem;
    }

    input {
      margin-top: 10px;
      border: 1px solid #ddd;
      border-radius: 14px;
      height: 48px;
      padding: 0 20px;
      font-size: 16px;
      color: #66

      & + input {
        margin-top: 5px;
        
      }
    }
    
   

    
    button {
      margin-top: 10px;
      border: 0;
      border-radius: 4px;
      height: 48px;
      font-size: 16px;
      background: #C70039;
      font-weight: bold;
      color: #fff;
      border-radius: 30px;

      &:hover {
        background-color: ${darken(0.08, '#C70039')};
      }
    }
  }

  a {
    margin-top: 5px;
    text-decoration: none;
    color: #222;
    padding: 1rem;
       
    span{
      color: #E20000;
      text-decoration: underline;

    }


    &:hover {
      color: ${lighten(0.08, '#222')};
    }
  }
  
`;
