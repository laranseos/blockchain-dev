import { asyncHandler } from "@/middleware/async.middleware";
import axios, { AxiosResponse } from "axios";
import { CHANGE_NOW_API_KEY, CHANGE_NOW_IO_URL, FIXED_FLOAT_API_KEY, FIXED_FLOAT_API_SECRET, FIXED_FLOAT_URL } from "config/contant";
import { Request, Response } from "express";
import FixedFloat from "@/utils/FixedFloat";
import { IOrderItem, Order } from "models/order.model";

const fixed = new FixedFloat(FIXED_FLOAT_API_KEY, FIXED_FLOAT_API_SECRET);

/**
 * Create swap order.
 * 
 * @param mode [string] Single or multi send
 * @param isPrivate [boolean] Private or semi-private
 * @param accountId [string] Account id
 * @param orders [object array] All orders
 */
export const createOrder = asyncHandler(async (req: Request, res: Response) => {
    console.log(req.body);
    let orders: any[] = req.body.orders;
    let len: number = orders.length;
    // There are lots of orders in body of request
    // Iterate each order
    for (let i: number = 0; i < len; i++) {
        let order: any = orders[i];
        if (req.body.isPrivate) { // If swap mode is private

            console.log("\x1b[32m", "Connecting to changenow.io...");
            // Get output xmr amount from changenow.io
            const cnRes = await axios.get(`${CHANGE_NOW_IO_URL}/exchange-amount/${order.fromAmount}/${order.fromCurrency}_xmr/?api_key=${CHANGE_NOW_API_KEY}`);
            const xmrAmount = cnRes.data.estimatedAmount;
            order.xmrAmount = xmrAmount;
            // console.log(cnRes.data);

            console.log("\x1b[34m", "Connecting to fixedfloat.com...");
            // Create an order and get xmr wallet address for creating order to changenow.io in fixedfloat.com 
            let ffOrder = await fixed.createOrder("XMR", order.toCurrency.toUpperCase(), order.receivingWalletAddress, xmrAmount);
            // console.log(ffOrder);
            if (ffOrder.code >= 300) {
                res.send({
                    success: false,
                    data: ffOrder.msg
                });
                return;
            }
            order.fixedfloatId = ffOrder.data.id; // Order id from fixedfloat.com
            order.fixedfloatToken = ffOrder.data.token; // Order token from fixedfloat.com
            let data = {
                "from": order.fromCurrency,
                "to": "xmr",
                "address": ffOrder.data.from.address,
                "amount": order.fromAmount,
            };

            console.log("\x1b[32m", "Connecting to changenow.io...");
            // Create an order in changenow.io
            let response = await axios.post(`https://api.changenow.io/v1/transactions/${CHANGE_NOW_API_KEY}`, data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            order.changenowId = response.data.id; // Order id from changenow.io
            order.serverWalletAddress = response.data.payinAddress;

        } else { // If swap mode is semi-private
            let data = {
                "from": order.fromCurrency,
                "to": order.toCurrency,
                "address": order.receivingWalletAddress,
                "amount": order.fromAmount,
            };

            // Create an order in changenow.io only
            let response = await axios.post(`https://api.changenow.io/v1/transactions/${CHANGE_NOW_API_KEY}`, data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            order.changenowId = response.data.id; // Order id from changenow.io
            order.serverWalletAddress = response.data.payinAddress; // Wallet address for send refunds
        }
    }

    // If creating orders in two sites done successfully, create an order in local database
    let order = await Order.create({
        mode: req.body.mode,
        isPrivate: req.body.isPrivate,
        accountId: req.body.accountId,
        orders: [
            ...req.body.orders.map((order: any) => ({
                fromAmount: order.fromAmount,
                fromCurrency: order.fromTicker,
                toAmount: order.toAmount,
                toCurrency: order.toTicker,
                xmrAmount: order.xmrAmount,
                receivingWalletAddress: order.receivingWalletAddress,
                serverWalletAddress: order.serverWalletAddress,
                changenowId: order.changenowId,
                fixedfloatToken: order.fixedfloatToken,
                fixedfloatId: order.fixedfloatId,
                status: "order-received"
            }))
        ]
    });

    // Update order status every 5 seconds
    updateOrderInfo(order);

    // Send created order to client
    res.send({
        success: true,
        data: order,
        message: "Order created successfully."
    });
});

/**
 * Get order info by order id.
 * 
 * @param id [string] Order id in mongo database
 * 
 * @returns
 * - success: [boolean] If process of request is succeed
 * - data: [object] Order document
 */
export const getOrder = asyncHandler(async (req: Request, res: Response) => {
    const orderId: string = req.params.id;
    const order = await Order.findById(orderId);
    let retOrder = order;
    // If all orders not completed, updates order status from two sites
    if (order && !isAllOrderCompleted(order)) {
        retOrder = await updateOrderInfo(order);
    }
    if (retOrder) {
        res.send({
            success: true,
            data: retOrder,
            serverTime: Date.now()
        });
    } else {
        res.send({
            success: false,
            msg: "Invalid order id!"
        });
    }
});

/**
 * Get order list by search query.
 * 
 * @param current [number] Number of page
 * @param pageSize [number] Display count of each page
 * 
 * @returns
 * - success: [boolean] If process of request is succeed
 * - data: [object array] Order document array
 */
export const getOrders = asyncHandler(async (req: Request, res: Response) => {
    let current: number = parseInt(req.query.current as string);
    let pageSize: number = parseInt(req.query.pageSize as string);
    const orders = await Order.aggregate([
        {
            $sort: { createdAt: -1 }
        },
        {
            $skip: (current - 1) * pageSize
        },
        {
            $limit: pageSize
        }
    ]);
    res.send({
        success: true,
        data: orders,
    });
});

/**
 * Get exchange range - min and max amount.
 * 
 * @param fromCurrency [string] Currency type of sender.
 * @param toCurrency [string] Currency type of receiver.
 * @param isPrivate [boolean] If swap mode is private.
 * 
 * @returns
 * - success: [boolean] If process of request is succeed
 * - data: [object] Order document array
 */
export const getExchangeRange = asyncHandler(async (req: Request, res: Response) => {
    const fromCurrency: string = req.body.fromCurrency;
    const toCurrency: string = req.body.toCurrency;
    const isPrivate: boolean = req.body.isPrivate;
    if (isPrivate) {
        const cnRes = await axios.get(`${CHANGE_NOW_IO_URL}/exchange-range/${fromCurrency}_xmr?api_key=${CHANGE_NOW_API_KEY}`);
        res.send({
            success: true,
            data: cnRes.data
        });
    } else {
        const cnRes = await axios.get(`${CHANGE_NOW_IO_URL}/exchange-range/${fromCurrency}_${toCurrency}?api_key=${CHANGE_NOW_API_KEY}`);
        res.send({
            success: true,
            data: cnRes.data
        });
    }
});

/**
 * Get expected amount.
 * 
 * @param fromCurrency [string] Currency type of sender.
 * @param toCurrency [string] Currency type of receiver.
 * @param amount [number] Amount of currency.
 * @param isPrivate [boolean] If swap mode is private.
 * @param mode [string] Expect mode
 * 
 * @returns
 * - success: [boolean] If process of request is succeed
 * - data: [{ expectedAmount: number }] Expected amount object
 */
export const getExpectedAmount = asyncHandler(async (req: Request, res: Response) => {
    const fromCurrency: string = req.body.fromCurrency.toUpperCase();
    const toCurrency: string = req.body.toCurrency.toUpperCase();
    const amount: number = req.body.amount;
    const mode: string = req.body.mode;
    const isPrivate: boolean = req.body.isPrivate;
    console.log(fromCurrency, toCurrency, amount, mode, isPrivate);
    // If mode is variable
    // if (mode === "variable") {
    if (isPrivate) {
        console.log("\x1b[32m", "Getting xmr amount from changenow.io...");
        const cnRes = await axios.get(`${CHANGE_NOW_IO_URL}/exchange-amount/${amount}/${fromCurrency}_xmr/?api_key=${CHANGE_NOW_API_KEY}`);
        const xmrAmount = cnRes.data.estimatedAmount;
        console.log("\x1b[34m", "Getting output amount from fixedfloat.com...");
        const ffRes = await fixed.getPrice("XMR", toCurrency, xmrAmount);
        if (ffRes.status >= 300) {
            console.log(ffRes);
        }
        res.send({
            success: true,
            data: {
                estimatedAmount: Math.max(ffRes.data.to.amount, 0)
            }
        });
    } else {
        const cnRes = await axios.get(`${CHANGE_NOW_IO_URL}/exchange-amount/${amount}/${fromCurrency}_${toCurrency}/?api_key=${CHANGE_NOW_API_KEY}`);
        res.send({
            success: true,
            data: cnRes.data
        });
    }
    // } else {

    // }
});

/**
 * Get available currencies from fixedfloat.com.
 * 
 * No Params
 * 
 * @returns
 * - Available currency array
 */
export const getAvaliableToCurrencies = asyncHandler(async (req: Request, res: Response) => {
    let currencies = await fixed.getCurrencies();

    res.send({
        success: true,
        data: currencies.data
    })
});

/**
 * Update order status from changenow.io and fixedfloat.com
 * 
 * @param order [any]
 */
const updateOrderInfo = async (order: any) => {
    try {
        let { _id, orders } = Object.assign(order, {});
        await Promise.all(orders.map(async (orderItem: IOrderItem, index: number) => {
            // Copy status of each order item
            let originalStatus: string = orderItem.status.concat("");

            // If swap mode is private
            if (order.isPrivate) {
                // If order in changenow.io not completed, get order status from changenow.io
                if (orders[index].status === "order-received" || orders[index].status === "anonymizing") {
                    const res = await axios.get(`${CHANGE_NOW_IO_URL}/transactions/${orders[index].changenowId}/${CHANGE_NOW_API_KEY}`);
                    let cnStatus: string = res.data.status;
                    console.log("cnStatus: ", cnStatus);
                    if (cnStatus === "exchanging" || cnStatus === "sending") {
                        orders[index].status = "anonymizing";
                    } else if (cnStatus === "finished") {
                        orders[index].status = "swapping";
                    } else if (cnStatus === "failed" || cnStatus === "refunded" || cnStatus === "verifying") {
                        orders[index].status = "failed";
                    }
                    console.log("changenow.io status: ", orders[index].status);
                } else if (orders[index].status === "swapping") {
                    // If order in fixedfloat.com now completed, get order status form fixedfloat.com
                    try {
                        let ffOrderItem = await fixed.getOrder(orders[index].fixedfloatId, orders[index].fixedfloatToken);
                        console.log("fixedfloat step: ", ffOrderItem.step);
                        let ffStatus: number = parseInt(ffOrderItem.data.status);
                        if (ffStatus === 4) {
                            orders[index].status = "done";
                            console.log("\x1b[32m", "Order succeed.");
                        } else if (ffStatus >= 5) {
                            orders[index].status = "failed";
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
            } else {
                const res = await axios.get(`${CHANGE_NOW_IO_URL}/transactions/${orders[index].changenowId}/${CHANGE_NOW_API_KEY}`);
                let cnStatus: string = res.data.status;
                if (cnStatus === "exchanging" || cnStatus === "sending") {
                    orders[index].status = "swapping";
                } else if (cnStatus === "finished") {
                    orders[index].status = "done";
                    console.log("\x1b[32m", "Order succeed.");
                } else if (cnStatus === "failed" || cnStatus === "refunded" || cnStatus === "verifying") {
                    orders[index].status = "failed";
                }
                console.log("changenow.io status: ", orders[index].status);
            }
            // If the status of orderItem is changed, then update order document in mongo database
            if (originalStatus !== orders[index].status) {
                await Order.findByIdAndUpdate(_id, {
                    orders: orders
                });
            }
        }));
        return {
            mode: order.mode,
            isPrivate: order.isPrivate,
            accountId: order.accountId,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            orders: orders
        };
    } catch (error) {
        console.log("\x1b[31m", "Updating order status failed.");
        return order;
    }

}

/**
 * Get if all orders completed or failed.
 * 
 * @param order Order document in mongo database
 * @returns true or false
 */
const isAllOrderCompleted = (order: { orders: { status: string }[] }) => {
    let completed: number = 0;
    order.orders.map((orderItem: { status: string }) => {
        if (orderItem.status === "done" || orderItem.status === "failed") completed++;
    });
    return completed === order.orders.length;
}