const sendMessage = async () => {
  const response = await fetch('http://localhost:4111/api/agents/coordinatorAgent/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: [
        {
          role: 'user',
          content: 'Hello',
        },
      ],
    }),
  });

  const data = await response.json();
  console.log(data);
};

sendMessage();