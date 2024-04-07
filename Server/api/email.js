const nodemailer = require("nodemailer");


const sendMail=async(package,action)=>{

    if(action=="Registration"){
        subject="Registration successful";
        to=package.Email;
        html=`<strong>${package.FirstName},</strong>
        <p>You have successfully created an account with us!. Get started by finding local events near you at http://localhost:5173/</p>
        <p>Group4event Team.</p>`
    }
    else if(action=="New Event"){
        subject="New Event Created!";
        to=package.CreatorEmail;
        html=`<strong>${package.CreatorName},</strong>
        <p>You have successfully created an event with us!.</p>
        <p><strong>Event Name: </strong>${package.EventTitle}</p>
        <p><strong>Event Location: </strong>${package.LocationDisplay}</p>
        <p><strong>Event Date and Time: </strong>${package.Date}</p>
        <p>Group4event Team.</p>`
    }
    else if(action=="Delete Event"){
        subject=" Event Deleted!";
        to=package.email;
        html=`<strong>Dear user,</strong>
        <p>The following event has been cancelled.</p>
        <p><strong>Event Name: </strong>${package.EventTitle}</p>
        <p><strong>Event Location: </strong>${package.LocationDisplay}</p>
        <p><strong>Event Date and Time: </strong>${package.Date}</p>
        <p><strong>Group4event Team.</strong></p>`
    }
    else if(action=="RSVP Received"){
        subject="RSVP Received";
        to=package.UserEmail;
        // to=["bar@example.com", "baz@example.com","sarveshregmi1@gmail.com"];

        html=`<strong>${package.User_fname},</strong>
        <p>Your RSVP for the event below has been received.</p>
        <p><strong>Event Name: </strong>${package.EventTitle}</p>
        <p><strong>Group4event Team.</strong></p>`
    }
    else if(action=="RSVP Cancelled"){
        subject="RSVP Cancelled";
        to=package.UserEmail;
        html=`<strong>${package.User_fname},</strong>
        <p>Your RSVP for the event below has been cancelled.</p>
        <p><strong>Event Name: </strong>${package.EventTitle}</p>
        <p><strong>Group4event Team.</strong></p>`
    }
    else if(action=="Update Event"){
        subject="Event Updated";
        to=package.email;
        html=`<strong>Dear User,</strong>
        <p>An event that you have RSVP'ed to has been updated.</p>
        <p><strong>Event Name: </strong>${package.EventTitle}</p>
        <p><strong>Event Location: </strong>${package.LocationDisplay}</p>
        <p><strong>Event Date and Time: </strong>${package.Date}</p>
        <p><strong>Group4event Team.</strong></p>`
    }
    else if(action=="Send OTP"){
        subject="OTP For Password Reset";
        to=package.Email;
        html=`<strong>Dear User,</strong>
        <p>Here is your temporary password:</p>
        <p>${package.OTP}</p>
        <p><strong>If you did not initiate any account update request, Please call us at 800-808-8080.</strong></p>
        <p><strong>Group4event Team.</strong></p>`
    }
    else if(action=="Password Reset Complete"){
        subject="Password Reset Complete";
        to=package.Email;
        html=`<strong>Dear User,</strong>
        <p>Your password has been reset.</p>
        <p><strong>If you did not initiate any account update request, Please call us at 800-808-8080.</strong></p>
        <p><strong>Group4event Team.</strong></p>`
    }
    else{
        //do nothing
    }

    console.log("inside send mail");

    const transporter = nodemailer.createTransport({
        service:"gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: "group4eventproject@gmail.com",
            pass: "pxgw evki qqbd ymsk",
            // user: process.env.MASTEREMAIL,
            // pass: process.env.EMAILPASS,
        },
    });
    
    const mailOptions={
        from: '"group4project 👻" <group4eventproject@gmail.com>', // sender address
        bcc:to, // list of receivers
        subject, // Subject line
        text: "Group4event Notification", // plain text body
        html, // html body
    
    }
    
    const sendMail=async(transporter,mailOptions)=>{
        try {
            await transporter.sendMail(mailOptions);
            console.log(`Email sent to ${to} for ${action}`);
            return(true);
            // res.send("mail sent")
            // console.log("email send")
        } catch (error) {
            console.log(error)
            return(false);
        }
    }

    sendMail(transporter,mailOptions);
}

module.exports=sendMail;