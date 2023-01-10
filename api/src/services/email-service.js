const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const dotenv = require('dotenv').config();
const process = require('process');

module.exports = class EmailService {

    constructor() {
        this.transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "dioniss1997@gmail.com",
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
                accessToken: this.getAccessToken()
            }
        });
    }

    getAccessToken() {

        const myOAuth2Client = new OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            "https://developers.google.com/oauthplayground;"
        )

        myOAuth2Client.setCredentials({
            refresh_token: process.env.GOOGLE_REFRESH_TOKEN
        });

        const myAccessToken = myOAuth2Client.getAccessToken();

        return myAccessToken;
    }

    sendEmail(email) {

        const mailOptions = {
            from: 'dioniss1997@gmail.com',
            to: 'dioniss1997@gmail.com',
            subject: email.subject,
            html: email.content
        }

        this.transport.sendMail(mailOptions, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log(result);
            }
        });
    }
}