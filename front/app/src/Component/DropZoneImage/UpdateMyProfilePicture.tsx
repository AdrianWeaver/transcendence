/* eslint-disable max-lines-per-function */
/* eslint-disable curly */
/* eslint-disable max-statements */
import { Backdrop, Button, Grid, Paper } from "@mui/material";
import { DropzoneAreaBase, FileObject } from "mui-file-dropzone";
import { useState } from "react";

type	ButtonGroupProps = {
	setDisplayOpenButton: React.Dispatch<React.SetStateAction<boolean>>;
	setDisplayModalBox: React.Dispatch<React.SetStateAction<boolean>>;
}

const	ButtonGroup = (props: ButtonGroupProps) =>
{
	return (
		<>
			<Grid item xs={12}>
				<Grid
					container
					component={Paper}
					justifyContent="center"
					sx={{
						width: "100%",
					}}
				>
					<Grid
						item
						xs={2}
					></Grid>
					<Grid
						item
						xs={3}
					>
						<Button
							onClick={() =>
							{
								props.setDisplayModalBox(false);
								props.setDisplayOpenButton(true);
							}}
						>
							annuler
						</Button>
					</Grid>
					<Grid
						item
						xs={2}
					></Grid>
					<Grid
						item
						xs={3}
					>
						<Button
							// onClick={sendImage}
						>
							Valider
						</Button>
					</Grid>
					<Grid
						item
						xs={2}
					></Grid>
				</Grid>
			</Grid>
		</>
	);
};

type DropAreaProps = {
	files: FileObject[],
	setFiles: React.Dispatch<React.SetStateAction<FileObject[]>>
};
const	DropArea = (props: DropAreaProps) =>
{
	let	content;

	const	handleAddFile = (newFile: any) =>
	{
		console.log(newFile);
		props.setFiles(newFile);
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
		content = (<>image dropped</>);
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
	files: FileObject[],
	setFiles: React.Dispatch<React.SetStateAction<FileObject[]>>
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
								<Grid
									item
									xs={1}
								></Grid>
								<Grid
									item
									xs={10}
									sx={
									{
										border: "1px solid #000",
										textAlign: "center"
									}}
								>
									{/* <MyAvatarCard
										userInfo={userInfo}
										remplacement={files}
										// readyExport={readyExport}
									/> */}
									{/* <CropMyImage
										userInfo={userInfo}
										remplacement={files}
										setFiles = {setFiles}
										readyExport={readyExport}
										setReadyExport={setReadyExport} */}
										{/* // readyExport={readyExport} */}
									{/* /> */}
								</Grid>
								<Grid
									item
									xs={1}
								></Grid>
							</Grid>
						</Grid>
						<DropArea
							files={props.files}
							setFiles={props.setFiles}
						/>
						<ButtonGroup
							setDisplayModalBox={props.setDisplayModalBox}
							setDisplayOpenButton={props.setDisplayOpenButton}
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
			/>);
	}
	return (
		contentView
	);
};

export default UpdateMyProfilePicture;
