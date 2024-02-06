import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  FormEvent,
} from 'react';
import { MdSend } from 'react-icons/md';
import { parseISO } from 'date-fns';

import api from '../../services/api';
import Socket from '../../services/socket';

import { useAuth } from '../../hooks/auth';

import {
  Container,
  Header,
  Title,
  Main,
  MessageContainer,
  Message,
  MessageAuthor,
  MessageContent,
  InputContainer,
} from './styles';

interface Message {
  _id: string;
  user: {
    user_id: string;
    name: string;
    username: string;
  };
  content: string;
  createdAt: Date;
  formattedDate: Date;
}

const Chat: React.FC = () => {
  const messagesRef = useRef() as React.MutableRefObject<HTMLDivElement>;

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const { user: userAuth } = useAuth();

  const scrollToBottom = useCallback(() => {
    let div = messagesRef.current;

    if (div) {
      div.scrollTop = div.scrollHeight;
    }
  }, [messagesRef]);

  const loadMessages = useCallback(async () => {
    const response = await api.get('chat');

    setMessages(
      response.data.map((message: Message) => ({
        _id: message._id,
        user: {
          user_id: message.user.user_id,
          name: message.user.name,
          username: message.user.username,
        },
        content: message.content,
        createdAt: message.createdAt,
        formattedDate: parseISO(message.createdAt.toString()),
      }))
    );
  }, []);

  useEffect(() => {
    loadMessages().then(() => {
      scrollToBottom();
    });
  }, [loadMessages, scrollToBottom]);

  const socket = Socket({ user_id: userAuth._id });

  useEffect(() => {
    socket.on(
      'message',
      (newMessage: Omit<{ message: Message }, 'formattedDate'>) => {
        setMessages([
          ...messages,
          {
            _id: newMessage.message._id,
            user: {
              user_id: newMessage.message.user.user_id,
              name: newMessage.message.user.name,
              username: newMessage.message.user.username,
            },
            content: newMessage.message.content,
            createdAt: newMessage.message.createdAt,
            formattedDate: parseISO(newMessage.message.createdAt.toString()),
          },
        ] as Message[]);
      }
    );
    scrollToBottom();
  }, [messages, scrollToBottom, socket]);

  const handleSendNewMessage = useCallback(
    async (event: FormEvent) => {
      event?.preventDefault();

      if (newMessage.trim().length === 0) {
        setNewMessage('');
        return;
      }

      await api.post('chat', {
        content: newMessage.trim(),
      });

      setNewMessage('');
    },
    [newMessage]
  );

  return (
    <Container>
      <Header>
        <Title># Chat Livre</Title>
      </Header>
      <Main>
        <MessageContainer ref={messagesRef}>
          {messages.map((message) => (
            <Message key={message._id}>
              <MessageAuthor isUserAuth={message.user.user_id === userAuth._id}>
                {message.formattedDate
                  .getDate()
                  .toString()
                  .padStart(2, '0')
                  .concat('/')
                  .concat(
                    (message.formattedDate.getMonth() + 1)
                      .toString()
                      .padStart(2, '0')
                      .concat('/')
                      .concat(message.formattedDate.getFullYear().toString())
                  )}{' '}
                - {message.user.username} -{' '}
                {message.formattedDate
                  .getHours()
                  .toString()
                  .padStart(2, '0')
                  .concat(':')
                  .concat(
                    message.formattedDate
                      .getMinutes()
                      .toString()
                      .padStart(2, '0')
                      .concat('h')
                  )}
              </MessageAuthor>
              <MessageContent>{message.content}</MessageContent>
            </Message>
          ))}
        </MessageContainer>
        <InputContainer onSubmit={handleSendNewMessage}>
          <input
            type='text'
            placeholder='Digite sua mensagem'
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button type='submit'>
            <MdSend size={25} />
          </button>
        </InputContainer>
      </Main>
    </Container>
  );
};

export default Chat;
