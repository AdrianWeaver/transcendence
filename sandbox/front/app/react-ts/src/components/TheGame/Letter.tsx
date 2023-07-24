/* eslint-disable max-lines-per-function */

type	LetterProps = {
	color: string
	letter: string
};


type ColorsVariantsModel = {
	purple: string,
	yellow: string,
	blue: string,
	red: string,
	orange: string,
	green: string,
};

const	cssColors: ColorsVariantsModel = {
	purple: "#744EF2",
	yellow: "#F2DB29",
	blue: "#4C29F2",
	red: "#F22705",
	orange: "#f0932b",
	green: "#1DF297"
};

const	Letter = (props: LetterProps) =>
{
	let	colorStyle;

	switch (props.color)
	{
		case "purple":
			colorStyle = cssColors.purple;
			break;
		case "yellow":
			colorStyle = cssColors.yellow;
			break;
		case "blue":
			colorStyle = cssColors.blue;
			break ;
		case "red":
			colorStyle = cssColors.red;
			break;
		case "orange":
			colorStyle = cssColors.orange;
			break;
		case "green":
			colorStyle = cssColors.green;
			break;
		default:
			colorStyle = cssColors.red;
			break;
	}

	return (
		<span style={{color: colorStyle }}>
			{props.letter}
		</span>
	);
};

export default Letter;
