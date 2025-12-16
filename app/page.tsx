const TestData = {
  messages: [
    {
      id: 1,
      user: "test_user",
      message: "Hello First Message",
      userPosition: "Aspiring Data Engineer",
    },
    {
      id: 2,
      user: "Anonymous Mouse",
      message: "Hey man",
      userPosition: "Aspiring Data Nerd",
    },
  ],
};

export default function Home() {
  return (
    <>
      <div className="h-screen w-screen flex justify-center items-center">
        <div className="h-full w-100 border-white border-1 ">
          <ul>
            {TestData.messages.map((message) => {
              return <li key={message.id}>{message.message}</li>;
            })}
          </ul>
        </div>
      </div>
    </>
  );
}
