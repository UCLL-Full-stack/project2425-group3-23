
import { useEffect, useState } from 'react';

type Message = {
  id: number;
  content: string;
  sender: {
    username: string;
  };
};

const PublicChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/messages')
      .then((response) => response.json())
      .then((data) => {
        setMessages(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching messages:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading messages...</div>;

  return (
    <div>
      <h1>Public Chat</h1>
      <ul>
        {messages.map((message) => (
          <li key={message.id}>
            <strong>{message.sender.username}</strong>: {message.content}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PublicChat;
