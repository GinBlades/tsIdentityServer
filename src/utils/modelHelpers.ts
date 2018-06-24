import { Model } from "mongoose";

// TODO: This didn't seem to work consistently with mongoose async validation.
export function uniquePropValidation(model: Model<any>, prop: string, value: string, respond: Function) {
    let queryObj: any = {};
    queryObj[prop] = value;
    return model.count(queryObj, (err: any, count: number) => {
        if (err) {
            respond(false);
        }

        if (count > 0) {
            respond(false);
        }

        respond(true);
    });
}
