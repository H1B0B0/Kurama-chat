import styled, { css } from 'styled-components';

interface MessageAuthorProps {
  isUserAuth?: boolean;
}

export const Container = styled.div`
  max-height: calc(100vh - 60px);
  width: calc(100% - 200px);

  background: #333;
`;

export const Header = styled.div`
  background: #444;
  height: 44px;
`;

export const Title = styled.strong`
  height: 100%;

  color: #fff;
  display: flex;
  align-items: center;
  margin-left: 15px;
`;

export const Main = styled.div`
  height: calc(100vh - 60px - 44px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const MessageContainer = styled.div`
  height: 100%;

  overflow-y: scroll;

  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #999;
    border-radius: 4px;
  }
  ::-webkit-scrollbar-track {
    background-color: #222;
  }
  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: #555 #999;
`;

export const Message = styled.div`
  display: flex;
  flex-direction: column;

  padding: 10px 25px;

  border-bottom: 1px solid #444;
`;

export const MessageAuthor = styled.span<MessageAuthorProps>`
  font-weight: 500;
  color: #fff;

  ${(props) =>
    props.isUserAuth &&
    css`
      color: #63f542;
    `}
`;

export const MessageContent = styled.span`
  margin-top: 10px;
  color: #ececec;
`;

export const InputContainer = styled.form`
  border-top: 1px solid #555;
  width: 100%;
  padding: 10px;

  display: flex;
  align-items: center;

  input {
    margin-top: 5px;
    width: 100%;
    height: 44px;
    border-radius: 8px;
    border: none;
    background-color: #222;
    padding: 0 10px;
    color: #fff;
  }

  button {
    background: transparent;
    border: none;
    margin-left: 15px;

    svg {
      color: #fff;
    }
  }
`;
