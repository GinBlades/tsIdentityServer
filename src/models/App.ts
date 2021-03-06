import mongoose, { Model, Document } from "mongoose";
import { randomBytes } from "crypto";
import { tokenArraySchema, IToken } from "./shared";

export interface IAppDocument extends Document {
    name: string;
    paths: string[];
    key: string;
    tokens: IToken[];
    [index: string]: any;
}

export interface IAppModel extends Model<IAppDocument> {
    keygen: () => string;
}

let AppSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    paths: [String],
    key: {
        type: String,
        required: true
    },
    tokens: tokenArraySchema
});

AppSchema.static("keygen", (): string => {
    const bytes = randomBytes(24);
    return bytes.toString("hex");
});

const App: IAppModel = mongoose.model<IAppDocument, IAppModel>("App", AppSchema);
export default App;
