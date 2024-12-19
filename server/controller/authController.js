import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import userModel from "../models/UserModel.js";
import 'dotenv/config';
import transpoter from "../CONFIG/nodemailer.js";
import { EMAIL_VERIFY_TEMPLATE,PASSWORD_RESET_TEMPLATE } from "../CONFIG/emailTemplates.js";
export const register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(404).json({
            success: false,
            message: "Missing Deatils"
        })
    }

    try {

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({
                success: false,
                message: 'User Already Exists'
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new userModel({ name, email, password: hashedPassword });
        await user.save();

        // const token = jwt.sign({id:user._id},process.env.JWT_SECRET,
        //     {expiresIn: '1d'}
        // );

        const secret = process.env.JWT_SECRET || 'default_secret';
const token = jwt.sign({ id: user._id }, secret, { expiresIn: '1d' });
       
        

         res.cookie('token',token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSites: process.env.NODE_ENV === 'production' ? 'none' :'strict',
            maxAge: 1 * 24 * 60 * 60 * 1000,
             
        });

        const mailOptions ={
            from: process.env.SENDER_EMAIL,
            to:email,
            subject:'Welcome ',
            text:`Welcome to website. Your account has created with this email id ${email}`

        }

        await transpoter.sendMail(mailOptions);
        return res.json({success:true});

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

export const login = async (req,res) => {
    const {email ,password} = req.body;

    if(!email || !password){
        return res.json({
            success:false,
            message:"email and password are required ",
        })
    }

    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({
                success:false,
                message:"invalid email ",
            })
        }

        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.json({
                success:false,
                message:"invalid password ",
            })
        }

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,
            {expiresIn: '1d'}
        );

         res.cookie('token',token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSites: process.env.NODE_ENV === 'production' ? 'none' :'strict',
            maxAge: 1 * 24 * 60 * 60 * 1000,
             
        });

        return res.json({success:true});

    } catch (error) {
        return res.json({
            success:false,
            message:error.message,
        })
    }
}

export const logout = async (req,res) => {
    try {
        res.clearCookie('token',{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSites: process.env.NODE_ENV === 'production' ?
             'none' :'strict',
             
        })
        return res.json({
            success:true,
            message:'logout'
        })
    } catch (error) {
        return res.json({
            success:false,
            message:error.message,
        });
    }
}

export const sendVerifyOtp = async (req,res) => {
    try {
        const {userId} = req.body;

        const user = await userModel.findById(userId);

        if(user.isAccountVerified){
            return res.json({
                success:false, message:'Account Already verified'
            })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() +24 * 60 *60 *1000;

        await user.save();
        const mailOptions={
            from: process.env.SENDER_EMAIL,
            to:user.email,
            subject:'Account vetification OTP',
            text:`Your OTP is ${otp}. Verify your account using this OTP.`,

            html:EMAIL_VERIFY_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",email)

        }

        await transpoter.sendMail(mailOptions);

        res.json({success:true,
            message:'Verification OTP send on email'
        });
    } catch (error) {
        return res.json({
            success:false,
            message:error.message,
        });
    }
}

export const verifyEmail = async (req,res) => {
    const {userId,otp} = req.body;

        if(!userId || !otp){
            return res.json({
                success:false,
                message:'Missing Details'
            });
        }
    try {
        const user = await userModel.findById(userId);
        if(!user){
           return res.json({
                success:false,
                message:'User not found'
            });
        }

        if(user.verifyOtp === '' || user.verifyOtp !== otp){
            return res.json({
                success:false,
                message:'invalid OTP'
            });
        }
        if(user.verifyOtpExpireAt < Date.now()){
            return res.json({
                success:false,
                message:'OTP Expired'
            });
        }

        user.isAccountVerified = true;
        user.verifyOtp ='';
        user.verifyOtpExpireAt = 0;

        await user.save();

        return res.json({
            success:true,
            message:'Email verify sucessfully'
        })
    } catch (error) {
        return res.json({
            success:false,
            message:error.message,
        });
    }
}

export const isAuthenticated = async (req,res) => {
    try {
        return res.json({success:true});
    } catch (error) {
        return res.json({
            success:false,
            message:error.message,
        });
    
    }
}

export const sendResetOtp = async (req,res) => {
 const{email} = req.body;
 if(!email){
    return res.json({
        success:false,
        message:"Email is required"
    });
 }

 try {
    const user = await userModel.findOne({email});
    if(!email){
        return res.json({
            success:false,
            message:"User not found "
        });
    }
        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() +15 * 60 *1000;

        await user.save();
        const mailOptions={
            from: process.env.SENDER_EMAIL,
            to:user.email,
            subject:'Password Reset OTP',
            text:`Your OTP for ressetting your password is ${otp}.
             use this otp to proceed with resetting your password.`
             ,
             html:PASSWORD_RESET_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",email)

        }
        await transpoter.sendMail(mailOptions);
        res.json({
            success:true,
            message:'OTP send to Your Email'
        });

 } catch (error) {
    return res.json({
        success:false,
        message:error.message,
    });
 }
}

export const resetPassword = async (req,res)=> {
    const {email,otp,newPassword} = req.body;
    if(!email ||!otp || !newPassword){
        return res.json({
            success:false,
            message:'Email , OTP , Password are required'
        });
    }

    try {
        const user = await userModel.findOne({email});

        if(!email){
            return res.json({
                success:false,
                message:'user not found',
            });
        }

        if(user.resetOtp === '' || user.resetOtp !== otp){
            return res.json({
                success:false,
                message:'invalid otp',
            });
        }

        if(user.resetOtpExpireAt < Date.now()){
            return res.json({
                success:false,
                message:' otp expired',
            });
        }
        const hashedPassword= await bcrypt.hash(newPassword,10);

        user.password = hashedPassword;
        user.resetOtp='';
        user.resetOtpExpireAt=0;
        await user.save();
        return res.json({
            success:true,
            message:'Password has been change sucessfully',
        });
    } catch (error) {
        return res.json({
            success:false,
            message:error.message,
        });
    }
}