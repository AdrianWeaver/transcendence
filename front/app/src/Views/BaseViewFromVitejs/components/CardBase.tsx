import { useState } from "react";

const	CardBase = () =>
{
	const	[
		count,
		setCount
	] = useState(0);

	return (
		<div className="card">
			<button onClick={() =>
			{
				setCount((count) =>
				{
					return (count + 1);
				});
			}}>
				count is {count}
			</button>
			<p>
				Edit <code>src/App.tsx</code> and save to test HMR
			</p>
		</div>
	);
};

export default CardBase;
