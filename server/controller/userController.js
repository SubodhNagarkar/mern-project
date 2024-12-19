import userModel from "../models/UserModel.js";

export const getUserData = async (req,res)=> {
    try {
        const {userId} = req.body;
        const user = await userModel.findById(userId);

        if(!user){
            return res.json({
                success:false,
                message:'user not found',
            });
        }
        return res.json({
            success:true,
            message:'user found',
            userData:{
                name: user.name,
                isAccountVerified:user.isAccountVerified,
            }
        });
    
    } catch (error) {
        res.json({
            success:false,
            message:error.message,
        })
    }
}