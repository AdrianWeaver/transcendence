// import { create } from "domain";
// import { Twilio } from "twilio";
// import { ReadLine } from "readline";

// // import { Readline } from "readline/promises";

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const verifySid = process.env.TWILIO_VERIFY_SERVICE_SID;

// const client = new Twilio(accountSid, authToken);

// client.verify.v2
// 	.services(verifySid)
// 	.verifications.create({
// 		to: process.env.MY_NUMBER,
// 		channel: "sms" })
// 	.then((verification) =>
// 	{
// 		console.log(verification.status);
// 	})
// 	.then(() =>
// 	{
// 		// const readline = ReadLine()
// 		readline().createInterface({
// 		input: process.stdin,
// 		output: process.stdout,
// 		});
// 		readline.question("Please enter the OTP:", (otpCode: string) => {
// 		client.verify.v2
// 			.services(verifySid)
// 			.verificationChecks.create(
// 				{
// 					to: process.env.MY_NUMBER,
// 					code: otpCode
// 				})
// 			.then((verificationCheck) =>
// 			{
// 				console.log(verificationCheck.status);
// 			})
// 			.then(() =>
// 			{
// 				readline.close();
// 			});
// 		});
// 	});
