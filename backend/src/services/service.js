import {User} from "../models/db.js";
import {handleErrors } from "../helper/errorhandler.js";
import jwt from "jsonwebtoken";

const Services = {
    createToken:(id)=>{
        const maxAge=3*24*60*60;
        return jwt.sign({id},'phemon secrets',{
            expiresIn:maxAge
        });
    },
    createUser: async (userObj) => {
        const { email, password,username } = userObj;
        
        try {            
            // Create a new user in the database (use hashedPassword if hashing is enabled)
            const user = await User.create({ email, password, username });
            const token=Services.createToken(user._id);
            
            return { id: user._id, email: user.email, token };
        } catch (err) {
            throw(err);
        }
    },
    createAdmin: async (userObj) => {
        const { email, password, username, role} = userObj;
        
        try {            
            // Create a new user in the database (use hashedPassword if hashing is enabled)
            const user = await User.create({ email, password, username, role});
            const token=Services.createToken(user._id);
            
            return { id: user._id, email: user.email, token };
        } catch (err) {
            throw(err);
        }
    }
};

export default Services;