
const	App = () =>
{
	return (
		<>
			<div style={{ textAlign: "center"}} className="alignement">
				<input type="button" defaultValue="START" id="start" />
				<br />
				<canvas id="board">Javascript not supported.</canvas>
				<br />
				<input type="button" defaultValue="PAUSE" id="stopAnimating" />
				{/* <br> */}
				<input type="button" defaultValue="RESUME" id="keepAnimating" />
				<br />
			</div>
		</>
	);
}

export default App