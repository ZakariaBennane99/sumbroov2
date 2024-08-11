import { Schema, model } from "mongoose";


const AvAccountsSchema = new Schema({
    accounts: {
        type: [String]
    }
});

let AvAc;
try {
    AvAc = model(&apos;AvAc&apos;);
} catch {
    AvAc = model(&apos;AvAc', AvAccountsSchema);
}

export default AvAc;
