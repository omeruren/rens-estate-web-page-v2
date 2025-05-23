import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: "https:sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png"
    },
},{timestamps: true});

const User = mongoose.model('User',userSchema);

export default User;