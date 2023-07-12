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
  return (
    <>
      <title>FT_TRANSCENDANCE</title>
      <meta charSet="utf-8" />
      <div style={{ textAlign: "center" }} className="alignement">
        <input type="button" defaultValue="START" id="start" />
        <br />
        <canvas id="board">Javascript not supported.</canvas>
        <br />
        <input type="button" defaultValue="PAUSE" id="stopAnimating" />
        {/* <br> */}
        <input type="button" defaultValue="RESUME" id="keepAnimating" />
        <br />
      </div>
      <audio id="fail" src="sounds/fail.mp3" />
      <audio id="touch" src="sounds/touch.wav" />
      <audio id="startSound" src="sounds/start.wav" />
      <link rel="stylesheet" href="styles.css" />
    </>
  );
}

export default App