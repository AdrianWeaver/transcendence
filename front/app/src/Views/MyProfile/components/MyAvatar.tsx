/* eslint-disable max-lines-per-function */
/* eslint-disable eqeqeq */
import { Avatar } from "@mui/material";
import { useState } from "react";


type	MyAvatarProps =
{
	imageUrl: string | ((url: string) => string);
	defaultUrl: string;
	pseudo: string;
}

const	MyAvatar = (props: MyAvatarProps) =>
{
	const [
defaultImage,
setDefaultImage
] = useState(true);
// call this method inner componentDidMount
	const	renderImage = () =>
	{
		const	img = props.imageUrl.toString();
		fetch(img)
		.then((res) =>
{
		if(res.status == 404)

			setDefaultImage(true);

		else

			setDefaultImage(false);
    })
    .catch((err) =>
	{
      setDefaultImage(true);
    });
  };
   // use where u want
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
			{myImage};
		</>
	);
};

export default MyAvatar;
