import nodemailer from 'nodemailer';

const transpoter = nodemailer.createTransport({

    host:'smtp-relay.brevo.com',
    port:587,
    auth:{
        user:process.env.SMTP_USER,
        pass:process.env.SMTP_PASS,

    }

    
});

transpoter.verify((error, success) => {
    if (error) {
        console.error('SMTP Configuration Error:', error);
    } else {
        console.log('SMTP Server is Ready to Send Emails');
    }
});


export default transpoter;