/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */

// import { useState, useEffect} from "react";

// // This is a hook 
// const	UseMargin = () =>
// {
// 	const	bodyComputedStyle = window.getComputedStyle(document.body);
// 	const	marginTop = parseInt(bodyComputedStyle.marginTop, 10);
// 	const	marginRight = parseInt(bodyComputedStyle.marginRight, 10);
// 	const	marginLeft = parseInt(bodyComputedStyle.marginLeft, 10);
// 	const	marginBottom = parseInt(bodyComputedStyle.marginBottom, 10);
// 	const
// 	[
// 		bodyMargin,
// 		setBodyMargin
// 	] = useState(
// 	{
// 		top: marginTop,
// 		right: marginRight,
// 		left: marginLeft,
// 		bottom: marginBottom
// 	});

// 	useEffect(() =>
// 	{
// 		const	bodyComputedStyle = window.getComputedStyle(document.body);
// 		const	marginTop = parseInt(bodyComputedStyle.marginTop, 10);
// 		const	marginRight = parseInt(bodyComputedStyle.marginRight, 10);
// 		const	marginLeft = parseInt(bodyComputedStyle.marginLeft, 10);
// 		const	marginBottom = parseInt(bodyComputedStyle.marginBottom, 10);

// 		if (bodyMargin.top === 0)
// 			setBodyMargin((prevMargin) =>
// 			{
// 				return ({
// 					prevMargin
// 				});
// 			});
// 		setBodyMargin(
// 		{
// 			top: marginTop,
// 			right: marginRight,
// 			left: marginLeft,
// 			bottom: marginBottom
// 		});
// 	}, []);

// 	return (bodyMargin);
// };

// export default UseMargin;
