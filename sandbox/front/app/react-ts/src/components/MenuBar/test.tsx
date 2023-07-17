/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
import React, {useState} from "react";

type TodoModel = {
	id: number,
	todo: TodoModel
};

const	Title = () =>
{
	return (
		<>
			<h1>
				title
			</h1>
		</>);
};

function App()
{
	const [
		list,
		setList
	] = useState([] as TodoModel[]);
	const [
		input,
		setInput
	] = useState("");

	const addTodo = (todo: TodoModel) =>
	{
		const newTodo = {
			id: Math.random(),
			todo: todo
		};
		// add the todo to the list
		// the three dots indicate the existing element
		setList([
			...list,
			newTodo
		]);

		// clear input box = setting the input to an empty string 
		setInput("");
	};

	const deleteTodo = (id: number ) => {
		// filter out todo with the id
		const newList = list.filter((todo) => todo.id !== id)
		setList(newList);
	}
	// <button>&times;</button> = the X button the remove an item
	return (
		<div>
			<Title />
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