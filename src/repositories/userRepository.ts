import User, { IUserDocument } from "../models/User";
import { Request } from "express";

export class UserRepository {
    constructor() {
    }

    fromRequest(req: Request) {
        let user = new User();
        for (let prop of ["email", "username", "password"]) {
            if (null != req.body[prop]) {
                user[prop] = req.body[prop];
            }
        }
        return user;
    }

    updateObj(req: Request) {
        const user = this.fromRequest(req);
        const obj: any = {};
        for (let prop of ["email", "username", "password"]) {
            if (null != user[prop]) {
                obj[prop] = user[prop];
            }
        }
        return obj;
    }

    async validate(user: IUserDocument): Promise<IRepoResponse> {
        try {
            await user.validate();
        } catch (err) {
            return {
                error: `Validation errors on: ${Object.keys(user.errors).join(", ")}`,
                result: null
            };
        }
        const usernameMatch = await User.count({ username: user.username });
        if (usernameMatch > 0) {
            return {
                error: "Username is not available.",
                result: null
            };
        }
        const emailMatch = await User.count({ email: user.email });
        if (emailMatch > 0) {
            return {
                error: "Email already registered.",
                result: null
            };
        }
        const emailPattern = new RegExp("@\\w+\\.");
        if (!emailPattern.test(user.email)) {
            return {
                error: "Invalid email format.",
                result: null
            };
        }

        if (user.password.length < 8) {
            return {
                error: "Password must be at least 8 characters",
                result: null
            };
        }

        return {
            error: null,
            result: true
        }
    }

    async create(user: IUserDocument, passwordConfirmation: string): Promise<IRepoResponse> {
        const validation = await this.validate(user);
        if (!validation.result) {
            return {
                error: validation.error,
                result: null
            };
        }

        if (user.password !== passwordConfirmation) {
            return {
                error: "Passwords must match",
                result: null
            };
        }

        user.password = await User.hashPassword(user.password);
        await user.save();

        return {
            error: null,
            result: user
        };
    }
}

export interface IRepoResponse {
    error?: string,
    result: any
}
