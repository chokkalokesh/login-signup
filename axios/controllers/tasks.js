const nodemailer = require('nodemailer');
const Detail = require("../models/tasks")
const bcrypt = require('bcrypt');
let temp = 0
const gettask = async (req, res) => {
    try {
        const { name, password} = req.body;
        const detail = await Detail.findOne({ name: name });
        if (!detail) {
            return res.status(200).json({ msg: 'Username_notfound', reason: ' user Invalid credentials' });
        }
        const isPasswordValid = await bcrypt.compare(password, detail.password);

        if (isPasswordValid) {
            return res.status(200).json({ msg: 'LOGGED IN' });
        } 
        else {
            return res.status(200).json({ msg: 'Password_notfound', reason: 'Invalid credentials' });}

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ msg: 'Internal Server Error' });
    }
}

const createtask = async(req,res)=>{
    const {name,password,otp,data}= req.body
    if (parseInt(data, 10)===data){
        try {

            const existingUser = await Detail.findOne({ name });

            if (existingUser) {
                return res.status(200).json({ msg: 'User already exists', reason: 'Please choose a different username' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
    
            const detail = await Detail.create({ name, password: hashedPassword });
            if(!detail){
                res.status(405).json({detail})
            }
            res.status(200).json({detail});
        } catch (error) {
            res.status(404).send("Error occured")
        }
    }
    else{
        console.log(data,otp)
    }
}


const sendotp=async(req,res)=>{
    const { name } = req.body;
    try {
        
        // Generate a random 6-digit OTP
        otp = Math.floor(100000 + Math.random() * 900000);
        temp=otp;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'theonlineman0718@gmail.com', 
                pass: 'jqea ihuv garb qxeu' 
            }
        });

        const mailOptions = {
            from: 'theonlineman0718@gmail.com',
            to: name,
            subject: 'OTP Verification',
            text: `Your OTP for verification is: ${otp}`
        };
        try {
            await transporter.sendMail(mailOptions);
            return res.status(200).json({ msg: 'OTP sent successfully' ,dataa:temp});
        } catch (error) {
            console.error(error.message);
            return res.status(500).json({ msg: 'Error sending OTP' });
        }
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ msg: 'Internal Server Error' });
    }
}

module.exports={
    gettask,
    createtask,
    sendotp
}