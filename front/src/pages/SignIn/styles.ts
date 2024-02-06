import styled from 'styled-components';
import { darken, lighten } from 'polished';

export const Container = styled.div`
  height: 100%;
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  form {
    width: 100%;
    max-width: 250px;
    display: flex;
    flex-direction: column;

    h2 {
      align-self: center;
      color: #222;
    }

    input {
      margin-top: 20px;
      border: 1px solid #ddd;
      border-radius: 4px;
      height: 48px;
      padding: 0 20px;
      font-size: 16px;
      color: #666;

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
      background: #3bafda;
      font-weight: bold;
      color: #fff;

      &:hover {
        background-color: ${darken(0.08, '#3bafda')};
      }
    }
  }

  a {
    margin-top: 5px;
    text-decoration: none;
    color: #222;

    &:hover {
      color: ${lighten(0.08, '#222')};
    }
  }
`;
