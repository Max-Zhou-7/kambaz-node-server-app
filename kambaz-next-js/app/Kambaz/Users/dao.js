import { v4 as uuidv4} from "uuid";
import model from "./model.js";

export default function UserDao() {
    const createUser = (user) => {
        // const newUser = { ...user, _id: uuidv4()};
        delete user._id;
        return model.create(user);
    };

    const findAllUsers = () => model.find();
    
    const findUserById = (userId) => 
        model.findById(userId);
    const findUserByUsername = (username) => 
        model.findOne({username : username});
    const findUsersByPartialName = (partialName) => {
        const regex = new RegExp(partialName, "i");
        return model.find({
            $or: [{ firstName: {$regex: regex}}, { lastName: { $regex : regex}}],
        });
    };

    const findUserByCredentials = (username, password) => 
        model.findOne({username, password});

    const findUserByRole = (role) => model.find({role: role});

    const updateUser = (userId, user) => 
       model.updateOne({ _id: userId}, {$set: user});
    
    const deleteUser = (userId) => 
        model.findByIdAndDelete (userId);
 
    
    return {
        createUser, 
        findAllUsers, 
        findUserById, 
        findUserByUsername, 
        findUsersByPartialName,
        findUserByCredentials,
        findUserByRole,
        updateUser, 
        deleteUser
    };
}