import { Schema, model } from "mongoose";

const AccountSchema = new Schema({
    ac: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }
});

const AvAccountsSchema = new Schema({
    accounts: [AccountSchema]
});

let AvAc;
try {
    AvAc = model('AvAc');
} catch {
    AvAc = model('AvAc', AvAccountsSchema);
}

export default AvAc;
