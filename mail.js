// https://www.youtube.com/watch?v=L46FwfVTRE0
// https://support.google.com/mail/answer/7126229?hl=en#zippy=%2Cschritt-smtp--und-andere-einstellungen-im-e-mail-client-%C3%A4ndern%2Cschritt-imap-aktivieren%2Cstep-change-smtp-other-settings-in-your-email-client

const nodeMailer = require('nodemailer');

const html = `
    <<h1>Salut Jo</h1>
    <p>Ceci un test d'envoi de mails via nodemailer.</p>
`;

const emails = ['jea']

async function main()
{
    //information of the server that we will be sending an email to
    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        port: 465,
        secure: true,
        auth: {
            user: 'nikol.boratkova@gmail.com', //${} //from .env
            pass: '4582 716 323' //${}
        }
    });

    const info = await transporter.sendMail({
        from: 'Nikola Boratkova <nikol.boratkova@gmail.com>',
        to: 'lemaildejo@gmail.com',
        subject: 'Transcendence',
        html: html,
    });

    console.log("Message sent." + info.messageId);
}

main()
.catch(e => console.log(e));