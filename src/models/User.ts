import mongoose, { Schema } from 'mongoose';

const UserSchema=new Schema({
    _id:{
        type:String
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    first_name:{
        type:String,
        required:true
    },
    last_name:{
        type:String,
        required:true
    },
    email_addresses: {
        type: [{ type: mongoose.Schema.Types.Mixed }],
        default: []
    },
    profile_image_url:{
        type:String,
        required:false
    },
    created_at:{
        type:Date,
        default:Date.now
    },
    updated_at:{
        type:Date,
        default:null
    }
});

const User=mongoose.models.User || mongoose.model('User',UserSchema);
export default User;