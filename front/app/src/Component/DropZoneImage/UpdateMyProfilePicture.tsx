/* eslint-disable max-lines-per-function */
/* eslint-disable curly */
/* eslint-disable max-statements */
import { DropzoneAreaBase, FileObject } from "mui-file-dropzone";
import { useRef, useState } from "react";
import Spacer from "./extra/Spacer";
import ButtonGroup from "./ButtonGroup";
import { useAppSelector } from "../../Redux/hooks/redux-hooks";
import {
	Backdrop,
	Button,
	Card,
	CardContent,
	CardHeader,
	CardMedia,
	Grid,
	Paper,
	Slider,
	Typography
} from "@mui/material";
import { UserModel } from "../../Redux/models/redux-models";
import AvatarEditor from "react-avatar-editor";

type	MyAvatarCardProps = {
	userInfo: UserModel,
	remplacementFile?: FileObject[]
	isImageSquare?: boolean,
	setIsImageSquare: React.Dispatch<React.SetStateAction<boolean>>
	// // readyExport: boolean
};
const	getText = (props: MyAvatarCardProps) =>
{
	const	subHeader = props.userInfo.username + " - "
		+ props.userInfo.firstName
		+ " " + props.userInfo.lastName;
	let		srcImg;
	if (props.remplacementFile && props.remplacementFile.length)
		srcImg = props.remplacementFile[0].data as string;
	else
		srcImg = props.userInfo.avatar;
	let		contentText;
	if (srcImg === props.userInfo.avatar)
		contentText = "Vous pouvez changer cette image,\
		vous allez la remplacer par une nouvelle image";
	else
		contentText = <>Toggle zoom</>;
	let displayedCard;
	if (props.isImageSquare === false)
		displayedCard = (
			<>
			</>
		);
	else
		displayedCard = (<>Need  to crop image</>);
	return ({
		subHeader: subHeader,
		srcImg: srcImg,
		contentText: contentText,
		displayedCard: displayedCard
	});
};


const	MyAvatarCard = (props: MyAvatarCardProps) =>
{
	// const	style = {
	// 	image: {
	// 		borderRadius: "50%"
	// 	}
	// };
	const	data = getText(props);

	return (
		<Card
			sx={{scale: "0.8", }}
		>
			<CardHeader
				title="Changement d'avatar"
				subheader={data.subHeader}
			/>
				<CardMedia
					component="img"
					image={data.srcImg}
					height="50%"
					alt={props.userInfo.login}
					sx={{
						borderRadius: "50%",
						objectFit: "cover"
					}}
					onLoad={(event) =>
						{
							const img = event.target as HTMLImageElement;
							console.log("image cast");
							console.log(event.target);
							console.log(img);
							console.log(img.naturalHeight, img.naturalWidth);
							if (img.naturalHeight !== img.naturalWidth)
							{
								props.setIsImageSquare(false);
							}
							else
								props.setIsImageSquare(true);
						}}
					/>
			<CardContent>
				<Typography variant="body1" color="text.secondary">
					{data.contentText}
				</Typography>
			</CardContent>
		</Card>
	);
};

type	CropMyImageProps = {
	userInfo: UserModel,
	remplacement: FileObject[],
	setFiles: React.Dispatch<React.SetStateAction<FileObject[]>>
	readyExport: boolean;
	setReadyExport: React.Dispatch<React.SetStateAction<boolean>>
};

const CropMyImage = (props: CropMyImageProps) =>
{
	const
	[
		zoom,
		setZoom
	] = useState(1);

	const	editor: React.RefObject<AvatarEditor> | null = useRef(null);
	const	borderColor = [
		255,
		50,
		50,
		0.3
	];

	const	dataURLtoFile = (
		dataURL: string,
		filename: string,
		mimeType : string) =>
	{
		const	array = dataURL.split(",");
		const	bstr = atob(array[array.length - 1]);
		let		n;
		n = bstr.length;
		const	u8array = new Uint8Array(n);
		while (n--)
			u8array[n] = bstr.charCodeAt(n);
		return (new File([u8array], filename, {type: mimeType}));
	};

	return (
		<>
			<Card
				sx={{scale: "1", }}
			>
				<CardHeader
					title="Changement d'avatar"
					subheader="recadrage"
				/>
				<AvatarEditor
					ref={editor}
					image={props.remplacement[0].file}
					width={300}
					height={300}
					border={10}
					color={borderColor}
					scale={zoom}
					rotate={0}
				/>
				<CardContent>
					<Slider
						size="small"
						value={zoom}
						defaultValue={1}
						valueLabelDisplay="auto"
						min={1}
						max={4}
						step={0.01}
						onChange={(event: any) =>
						{
							// console.log(event.target.value);
							setZoom(event.target.value);
						}}
					/>
					<Typography variant="body2" color="text.secondary">
						"faites glisser puis validez"
					</Typography>
					<Button
						onClick={() =>
						{
							if (editor.current !== null)
							{
								const	oldImage = props.remplacement[0];
								// console.log("next value is old images");
								// console.log(oldImage);

								const dataURL = editor
									.current?.getImageScaledToCanvas()
									.toDataURL(oldImage.file.type);
								// props.setFiles([scaled]);
								// console.log("Next value is scalled ");
								// console.log(dataURL);
								const	fileData = dataURLtoFile(
									dataURL,
									oldImage.file.name,
									oldImage.file.type
								);
								const file : FileObject = {
									data: dataURL,
									file: fileData
								};
								console.log("New file created: ");
								console.log(file);
								props.setFiles([file]);
								// dataURLtgoFile
								// console.log(props.remplaceement[0]);
								props.setReadyExport(true);
							}
						}}
					>
						Valider le redimensionnement
					</Button>
				</CardContent>
			</Card>
		</>
	);
};

type	DisplayAreaProps = {
	remplacementFile?: FileObject[],
	setFiles: React.Dispatch<React.SetStateAction<FileObject[]>>;
	// readyExport: boolean
	readyExport: boolean;
	setReadyExport: React.Dispatch<React.SetStateAction<boolean>>
};
const	DisplayArea = (props: DisplayAreaProps) =>
{
	const	userInfo = useAppSelector((state) =>
	{
		return (state.controller.user);
	});

	const
	[
		isImageSquare,
		setIsImageSquare
	] = useState(true);

	let		content;

	if (isImageSquare === true || props.readyExport)
	{
		content = (
			<MyAvatarCard
				userInfo={userInfo}
				remplacementFile={props.remplacementFile}
				setIsImageSquare={setIsImageSquare}
				isImageSquare={isImageSquare}
				// readyExport={readyExport}
			/>
		);
	}
	else
	{
		content = (
			<CropMyImage
				remplacement={props.remplacementFile as FileObject[]}
				setFiles={props.setFiles}
				userInfo={userInfo}
				readyExport={props.readyExport}
				setReadyExport={props.setReadyExport}
			/>
		);
	}

	return (
		<>
			<Grid
				item
				xs={12}
				sx={{ border: "1px solid #000" }}
			>
				<Grid
					container
					component={Paper}
					justifyContent="center"
					sx={{
						width: "100%",
					}}
				>
					<Spacer space={1}/>
					<Grid
						item
						xs={10}
						sx={
						{
							// border: "1px solid #000",
							textAlign: "center"
						}}
					>
						{content}
						{/* <CropMyImage
							userInfo={userInfo}
							remplacement={files}
							setFiles = {setFiles}
							readyExport={readyExport}
							setReadyExport={setReadyExport} */}
							{/* // readyExport={readyExport} */}
						{/* /> */}
					</Grid>
					<Spacer space={1}/>
				</Grid>
			</Grid>
		</>
	);
};

type DropAreaProps = {
	files: FileObject[],
	setFiles: React.Dispatch<React.SetStateAction<FileObject[]>>
	readyExport: boolean;
	setReadyExport: React.Dispatch<React.SetStateAction<boolean>>;
};
const	DropArea = (props: DropAreaProps) =>
{
	let		content;

	const	handleAddFile = (newFile: any) =>
	{
		console.log(newFile);
		setTimeout(() =>
		{
			props.setFiles(newFile);
		}, 400);
	};

	const	handleDeleteFile = (deleted: any) =>
	{
		props.setFiles(props.files.filter((file) =>
		{
			return (file !== deleted);
		}));
	};

	const	acceptedFiles = [
		"image/jpeg",
		"image/png"
	];

	if (props.files.length !== 0)
		content = (<>file selected, please adjust it and click on ajdust</>);
	else
	{
		content = (
			<DropzoneAreaBase
				fileObjects={props.files}
				onAdd={handleAddFile}
				onDelete={handleDeleteFile}
				filesLimit={1}
				dropzoneText="Glissez-deposez votre image ici"
				acceptedFiles={acceptedFiles}
				// showPreviews={true}
				showFileNames={false}
				maxFileSize={10000000}
				clearOnUnmount={true}
			/>
		);
	}
	return (
		<>
			<Grid item xs={12} >
				{content}
			</Grid>
		</>
	);
};

type ModalBoxProps = {
	setDisplayOpenButton: React.Dispatch<React.SetStateAction<boolean>>;
	setDisplayModalBox: React.Dispatch<React.SetStateAction<boolean>>;
	files: FileObject[];
	setFiles: React.Dispatch<React.SetStateAction<FileObject[]>>;
	readyExport: boolean;
	setReadyExport: React.Dispatch<React.SetStateAction<boolean>>
};

const	ModalBox = (props: ModalBoxProps) =>
{
	return (
		<>
			<Backdrop
					sx={
					{
						color: "#fff",
						zIndex: (theme) =>
						{
							return (theme.zIndex.drawer + 1);
						}
					}}
					open={true}
				>
				<Grid
						container
						component={Paper}
						sx={{
							width: "50%",
						}}
					>
						<DisplayArea
							remplacementFile={props.files}
							setFiles={props.setFiles}
							readyExport={props.readyExport}
							setReadyExport={props.setReadyExport}
						/>
						<DropArea
							files={props.files}
							setFiles={props.setFiles}
							readyExport={props.readyExport}
							setReadyExport={props.setReadyExport}
						/>
						<ButtonGroup
							setDisplayModalBox={props.setDisplayModalBox}
							setDisplayOpenButton={props.setDisplayOpenButton}
							files={props.files}
							readyExport={props.readyExport}
						/>
					</Grid>
			</Backdrop>
		</>
	);
};

type ButtonOpenModalProps = {
	setDisplayOpenButton: React.Dispatch<React.SetStateAction<boolean>>;
	setDisplayModalBox: React.Dispatch<React.SetStateAction<boolean>>;
};

const	ButtonOpenModal = (props: ButtonOpenModalProps) =>
{
	return (
		<>
			<Button
				onClick={() =>
				{
					props.setDisplayModalBox(true);
					props.setDisplayOpenButton(false);
				}}
			>
				Changer mon image de profil
			</Button>
		</>
	);
};

const	UpdateMyProfilePicture = () =>
{
	const
	[
		displayOpenButton,
		setDisplayOpenButton
	] = useState(true);

	const
	[
		displayModalBox,
		setDisplayModalBox
	] = useState(false);

	const
	[
		files,
		setFiles
	] = useState<FileObject[]>([]);

	const
	[
		readyExport,
		setReadyExport
	] = useState(false);

	let	contentView;

	if (displayOpenButton)
	{
		contentView = (
		<ButtonOpenModal
			setDisplayModalBox={setDisplayModalBox}
			setDisplayOpenButton={setDisplayOpenButton}
		/>);
	}
	else
	{
		contentView = (
			<ModalBox
				setDisplayModalBox={setDisplayModalBox}
				setDisplayOpenButton={setDisplayOpenButton}
				files={files}
				setFiles={setFiles}
				readyExport={readyExport}
				setReadyExport={setReadyExport}
			/>);
	}
	return (
		contentView
	);
};

export default UpdateMyProfilePicture;
