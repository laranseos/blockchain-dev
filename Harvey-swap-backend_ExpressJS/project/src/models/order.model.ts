import { Schema, Document, model } from 'mongoose'

export interface IOrderItem {
    fromAmount: number;
    fromCurrency: {
        ticker: string;
        image: string;
        name: string;
    };
    toAmount: number;
    toCurrency: {
        ticker: string;
        image: string;
        name: string;
    };
    xmrAmount: number;
    receivingWalletAddress: string;
    serverWalletAddress: string;
    changenowId: string;
    fixedfloatToken: string;
    fixedfloatId: string;
    status: string;
}
export interface IOrder {
    mode: string;
    isPrivate: boolean;
    orders: IOrderItem[];
    accountId: string;
    createdAt: Date;
    updatedAt: Date;
}

export default interface IOrderModel extends Document, IOrder { }

const orderItemSchema = new Schema({
    fromAmount: {
        type: Number,
        required: [true, "Send amount invalid!"]
    },
    fromCurrency: {
        type: {
            ticker: String,
            image: String,
            name: String
        },
        required: [true, "Send ticker invalid!"]
    },
    toAmount: {
        type: Number,
        required: [true, "Receive amount invalid!"]
    },
    toCurrency: {
        type: {
            ticker: String,
            image: String,
            name: String
        },
        required: [true, "To ticker invalid!"]
    },
    xmrAmount: {
        type: Number,
        default: 0
    },
    receivingWalletAddress: {
        type: String,
        required: [true, "Receiving wallet address invalid!"]
    },
    serverWalletAddress: {
        type: String,
        required: [true, "Server wallet address invalid!"]
    },
    changenowId: {
        type: String,
        required: [true, "ChangeNow.io id invalid!"]
    },
    fixedfloatId: {
        type: String,
        // required: [true, "FixedFloat.com id invalid!"]
    },
    fixedfloatToken: {
        type: String,
        // required: [true, "FixedFloat.com token invalid!"]
    },
    status: {
        type: String,
        default: "order-received" // order-received, anonymizing, swapping, done, failed
    },
});

const schema = new Schema(
    {
        mode: {
            type: String,
            default: "single" // Single or Multi send
        },
        isPrivate: { // Private or Semi-private
            type: Boolean,
            default: true
        },
        orders: {
            type: [orderItemSchema],
            default: []
        },
        accountId: {
            type: String,
            default: ""
        },
    },
    {
        timestamps: true,
    },
)

export const Order = model<IOrderModel>('Order', schema)
