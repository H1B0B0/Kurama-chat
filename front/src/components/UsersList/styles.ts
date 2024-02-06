import styled, { css } from 'styled-components';

interface StatusProps {
  status: string;
  isUserAuth?: boolean;
}

export const Container = styled.div`
  height: 100vh;
  max-height: calc(100vh - 60px);
  width: 200px;

  background-color: #ffff;

  overflow-y: scroll;
  ::-webkit-scrollbar {
    width: 4px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #222;
    border-radius: 4px;
  }
  ::-webkit-scrollbar-track {
    background-color: #999;
  }
  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: #555 #999;
`;

export const Title = styled.span`
  width: 100%;

  font-size: 24px;

  display: flex;
  justify-content: center;
  background-color: #333;
  color: #fff;

  padding: 10px;
`;

export const Separator = styled.div`
  width: 100%;
  height: 1px;
  background-color: #555;
`;

export const UserContent = styled.div<StatusProps>`
  background-color: #222;
  padding: 10px;
  color: #fff;

  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #333;

  strong {
    span {
      font-size: 12px;
      padding: 2px 4px;
      background: #666;
      border-radius: 4px;
      font-weight: normal;
      color: #ccc;
    }

    ${(props) =>
      props.status === 'online' &&
      css`
        color: #fff;
      `}

    ${(props) =>
      props.status === 'offline' &&
      css`
        color: #555;
      `}
  }

  button {
    height: 8px;
    width: 8px;
    border-radius: 50%;
    border: none;
    cursor: default;

    ${(props) =>
      props.isUserAuth &&
      css`
        cursor: pointer;
      `}

    ${(props) =>
      props.status === 'online' &&
      css`
        background-color: #63f542;
      `}

    ${(props) =>
      props.status === 'offline' &&
      css`
        background-color: #555;
      `}
  }
`;
