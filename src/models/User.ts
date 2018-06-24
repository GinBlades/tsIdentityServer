import mongoose, { Model, Document } from "mongoose";
import bcrypt, { compare } from "bcryptjs";

export interface IUserDocument extends Document {
    username: string;
    email: string;
    password: string;
    comparePassword(password: string): boolean;
    [index: string]: any;
}

export interface IUserModel extends Model<IUserDocument> {
    hashPassword(password: string): string;
}

let UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        maxlength: 12
    },
    email: {
        type: String,
        required: true,
        maxlength: 32
    },
    password: {
        type: String,
        required: true
    }
});

// TODO: Hash and proper validation of password
UserSchema.method("comparePassword", async function (password: string) {
    try {
        const compareResult = await bcrypt.compare(password, this.password);
        if (compareResult) {
            return true;
        }
    } catch (err) {
        return false;
    }

    return false;
});

UserSchema.static("hashPassword", async (password: string): Promise<string> => {
    const hashed = await bcrypt.hashSync(password);
    return hashed;
});

const User: IUserModel = mongoose.model<IUserDocument, IUserModel>("User", UserSchema);
export default User;
