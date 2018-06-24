import mongoose, { Model, Document } from "mongoose";
import { randomBytes } from "crypto";

export interface IAppDocument extends Document {
    name: string;
    paths: string[];
    key: string;
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
    }
});

AppSchema.static("keygen", (): string => {
    const bytes = randomBytes(24);
    return bytes.toString("hex");
});

const App: IAppModel = mongoose.model<IAppDocument, IAppModel>("App", AppSchema);
export default App;
