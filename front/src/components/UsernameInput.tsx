import React from "react";

type Props = {
    onInput: (username: string) => void;
    
};

function UsernameInput(props: Props) {
  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = event.currentTarget.querySelector("input");
    if (input) {
        props.onInput(input.value);
    }
  }
  return (
    <>
      <p>Wprowadź nazwę użytkownika</p>
      <form onSubmit={onSubmit}>
        <input type="text" />
        <button type="submit">Zatwierdź</button>
      </form>
    </>
  );
}

export default UsernameInput;
