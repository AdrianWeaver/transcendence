/* eslint-disable max-statements */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */
/* eslint-disable eqeqeq */
import { Avatar } from "@mui/material";
import { useState } from "react";


type	MyAvatarProps =
{
	imageUrl: string | undefined;
	defaultUrl: string;
	pseudo: string | undefined;
}

const	MyAvatar = (props: MyAvatarProps) =>
{
	const
	[
		defaultImage,
		setDefaultImage
	] = useState(true);
// call this method inner componentDidMount
	const	renderImage = () =>
	{
		let	img;

		if (props.imageUrl === undefined)
			setDefaultImage(true);
		else
			if (props.imageUrl !== undefined)
				img = props.imageUrl;
		fetch(img)
		.then((res) =>
		{
			if(res.status == 404)

				setDefaultImage(true);

			else

				setDefaultImage(false);
		})
    .catch((_err) =>
	{
    	setDefaultImage(true);
    });
  };
  renderImage();
   const myImage = defaultImage ? <Avatar
										alt={props.pseudo}
										src={props.defaultUrl}
										sx=
										{{
											width: 70,
											height: 70
										}}
									/>
									: 	<Avatar
											alt={props.pseudo}
											src={props.imageUrl}
											sx=
											{{
												width: 70,
												height: 70
											}}
										/>;
	return (
		<>
			{myImage}
		</>
	);
};

export default MyAvatar;
