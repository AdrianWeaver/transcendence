// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
// import "./App.css";

// const	LogoBase = () =>
// {
// 	return (
// 		<div>
// 			<a href="https://vitejs.dev" target="_blank">
// 				<img src={viteLogo} className="logo" alt="Vite logo" />
// 			</a>
// 			<a href="https://react.dev" target="_blank">
// 				<img src={reactLogo} className="logo react" alt="React logo" />
// 			</a>
// 		</div>
// 	);
// };

// const	TitleBase = () =>
// {
// 	return (<h1>Vite + React</h1>);
// };

// const	CardBase = () =>
// {
// 	const	[
// 		count,
// 		setCount
// 	] = useState(0);

// 	return (
// 		<div className="card">
// 			<button onClick={() =>
// 			{
// 				setCount((count) =>
// 				{
// 					return (count + 1);
// 				});
// 			}}>
// 				count is {count}
// 			</button>
// 			<p>
// 				Edit <code>src/App.tsx</code> and save to test HMR
// 			</p>
// 		</div>
// 	);
// };

// const	DocInfoBase = () =>
// {
// 	return (
// 		<p className="read-the-docs">
// 			Click on the Vite and React logos to learn more
// 		</p>
// 	);
// };

// function App()
// {
// 	return (
// 		<>
// 			<LogoBase />
// 			<TitleBase />
// 			<CardBase />
// 			<DocInfoBase />
// 		</>
// 	);
// }

// export default App;


import React, {useState} from 'react'

function App() {

  const [list, setList] = useState([]);
  const [input, setInput] = useState("");

  const addTodo = (todo) =>
  {
    const newTodo =
    { 
      id: Math.random(),
      todo: todo
    }
    // add the todo to the list
    // the three dots indicate the existing element
    setList([...list, newTodo]);

    //clear input box = setting the input to an empty string 
    setInput("");
  }

  const deleteTodo = (id) => {
    //filter out todo with the id
    const newList = list.filter((todo) => todo.id !== id)
    setList(newList);
  }
  // <button>&times;</button> = the X button the remove an item
  return (
    <div>
      <h1>Todo List</h1>
      <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={() => addTodo(input)}>Add</button>
      <ul>
        {list.map((todo) => (
            <li key={todo.id}>
              {todo.todo}
              <button onClick={() => deleteTodo(todo.id)}>&times;</button>
            </li>
        ))}
      </ul>
    </div>
  );
}

export default App