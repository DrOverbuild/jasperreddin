const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const cors = require('cors')({origin: true});
const creds = require('./creds.json');


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const transporter = nodemailer.createTransport({
    host: "mail.hover.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: creds.user, // generated ethereal user
        pass: creds.pass, // generated ethereal password
    },
});

exports.sendMail = functions.https.onRequest((req, resp) => {
    cors(req, resp, () => {
        // send mail with defined transport object

        const contact = req.body.contact;
        if (!contact.name || !contact.email || !contact.message) {
            resp.status(400);
            return resp.send("Invalid arguments");
        }

        var phone = "";
        if (contact.phone) {
            phone = `\nPhone: ${contact.phone}`;
        }

        var message = `Name: ${contact.name}\nEmail: ${contact.email}${phone}\n\n${contact.message}`;

        let mailOptions = {
            from: `"${contact.name}" <${contact.email}>`,
            to: "jasper@jasperreddin.com",
            subject: `New message from ${contact.name}`,
            text: `${message}`
        }

        return transporter.sendMail(mailOptions,(err, info) => {
            if (err) {
                resp.status(500);
                return resp.send(err);
            }

            return resp.send("Success");
        });
    });
});