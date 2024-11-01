import Head from 'next/head';
import { Message, User } from '../types';
import ChatWindow from '../components/chatWindow';

const messages: Message[] = [
  {
      id: 1,
      content: 'Hello, world!',
      deleted: false,
      sender: {
          username: 'Yorick',
          role: 'user',
          password: 'password01',
      },
  },
  {
      id: 2,
      content: 'Hi, Yorick! 😅',
      deleted: false,
      sender: {
          username: 'Sofie',
          role: 'user',
          password: 'password01',
      },
  },
];

const Home: React.FC = () => {
  return (
      <div>
          <Head>
              <title>Public Chat</title>
          </Head>
          <main>
              <h1>Welcome to the Public Chat</h1>
              <ChatWindow messages={messages} />
          </main>
      </div>
  );
};

export default Home;