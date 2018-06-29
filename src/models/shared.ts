export interface IToken {
    issued: number;
    code: string;
    used: false;
}

export let tokenArraySchema = [{
    issued: Number,
    code: String,
    used: Boolean
}];
