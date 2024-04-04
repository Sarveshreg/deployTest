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
        to=package.Email;
        html=`<strong>${package.FirstName},</strong>
        <p>You have successfully created an account with us!. Get started by finding local events near you at http://localhost:5173/</p>
        <p>Group4event Team.</p>`
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
        to, // list of receivers
        subject, // Subject line
        text: "Hello world?", // plain text body
        html, // html body
    
    }
    
    const sendMail=async(transporter,mailOptions)=>{
        try {
            await transporter.sendMail(mailOptions);
            console.log(`Email sent to ${package.Email} for ${action}`);
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