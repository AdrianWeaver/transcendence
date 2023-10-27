// import twilio from "twilio";
// import dotenv from "dotenv";

// const accountSid = "AC4f01e37d4532fb161f62ec1fbbaa8fc1";
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const verifySid = "VA96f27d7513b90f3f54774bfde0efd889";
// const client = require("twilio")(accountSid, authToken);

// client.verify.v2
//   .services(verifySid)
//   .verifications.create({ to: "+33622143240", channel: "sms" })
//   .then((verification) => console.log(verification.status))
//   .then(() =>
//   {
//     const readline = require("readline").createInterface({
//       input: process.stdin,
//       output: process.stdout,
//     });
//     readline.question("Please enter the OTP:", (otpCode) =>
// 	{
//       client.verify.v2
//         .services(verifySid)
//         .verificationChecks.create({ to: "+33622143240", code: otpCode })
//         .then((verification_check) => console.log(verification_check.status))
//         .then(() => readline.close());
//     });
//   });
