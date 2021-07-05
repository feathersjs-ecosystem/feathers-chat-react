import React, { useState, useEffect } from 'react';
import Login from './login';
import Chat from './chat';
import client from './feathers';

const messagesService = client.service('messages');
const usersService = client.service('users');

const Application = () => {
  const [login, setLogin] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Try to authenticate with the JWT stored in localStorage
    client.authenticate().catch(() => {
      setLogin(null);
    });

    // On successfull login
    client.on('authenticated', loginResult => {
      // Get all users and messages
      Promise.all([
        messagesService.find({
          query: {
            $sort: { createdAt: -1 },
            $limit: 25,
          },
        }),
        usersService.find(),
      ]).then(([messagePage, userPage]) => {
        // We want the latest messages but in the reversed order
        const messagesResult = messagePage.data.reverse();
        const usersResult = userPage.data;

        // Once both return, update the state
        setLogin(loginResult);
        setMessages(messagesResult);
        setUsers(usersResult);
      });
    });

    // On logout reset all all local state (which will then show the login screen)
    client.on('logout', () =>
      this.setState({
        login: null,
        messages: null,
        users: null,
      })
    );

    // Add new messages to the message list
    messagesService.on('created', message =>
      setMessages(currentMessages => currentMessages.concat(message))
    );

    // Add new users to the user list
    usersService.on('created', user =>
      setUsers(currentUsers => currentUsers.concat(user))
    );
  }, []);

  if (login === undefined) {
    return (
      <main className="container text-center">
        <h1>Loading...</h1>
      </main>
    );
  } else if (login) {
    return <Chat messages={messages} users={users} />;
  }

  return <Login />;
};

export default Application;
