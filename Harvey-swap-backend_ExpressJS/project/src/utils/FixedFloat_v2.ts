const fetch = require("sync-fetch");
import crypto from "crypto";

class FixedFloat {
  private _SECRET_KEY: string;
  private _API_KEY: string;
  private _MAIN_URL: string;
  constructor(API_KEY: string, SECRET_KEY: string) {
    this._API_KEY = API_KEY;
    this._SECRET_KEY = SECRET_KEY;
    this._MAIN_URL = "https://fixedfloat.com/api/v2/";
  }

  _sendRequest(reqMethod: string = "", apiMethod: string = "", body = "") {
    var headers: { "X-API-KEY": string; "X-API-SIGN": string; "Content-Type": string; "Accept": string; }, r: { status: number; json: () => any; };

    if (reqMethod && apiMethod) {
      headers = {
        "X-API-KEY": this._API_KEY,
        "X-API-SIGN": crypto
          .createHmac("sha256", this._SECRET_KEY)
          .update(body)
          .digest("hex"),
        "Content-Type": "application/x-www-form-urlencoded",
        // "Content-Type": "application/json",
        "Accept": "application/json"
      };

      if (reqMethod === "GET") {
        r = fetch(this._MAIN_URL + apiMethod + "?" + body, {
          headers: headers,
        });
      } else {
        if (reqMethod === "POST" && body !== "") {
          r = fetch(this._MAIN_URL + apiMethod, {
            headers: headers,
            body: body,
            method: "POST",
          });
        } else {
          return null;
        }
      }

      console.log(r.json());

      if (r.status === 200) {
        return r.json();
      } else {
        return null;
      }
    }
  }

  getCurrencies() {
    /*  Getting a list of all currencies that are available on FixedFloat.com  */
    return this._sendRequest("GET", "ccies");
  }

  getPrice(fromCcy: string, toCcy: string, amount: number, direction: string = "from", type: string = "float") {
    /*  Information about a currency pair with a set amount of funds  */
    var body: any;
    let params = {
      type: type,
      fromCcy,
      toCcy,
      amount: amount.toString(),
      direction,
    };

    body = Object.keys(params)
      .map((key) => key + "=" + params[key])
      .join("&");

    return this._sendRequest("POST", "price", body);
  }

  getOrder(id: string, token: string) {
    /*  Receiving information about the order  */
    var body: any;
    let params = {
      id: id,
      token: token,
    };

    body = Object.keys(params)
      .map((key) => key + "=" + params[key])
      .join("&");

    return this._sendRequest("GET", "getOrder", body);
  }

  setEmergency(id: string, token: string, choice: string, address = "") {
    /*  Emergency Action Choice  */
    var body: any;

    let params = {
      id: id,
      token: token,
      choice: choice,
      address: address,
    };

    body = Object.keys(params)
      .map((key) => key + "=" + params[key])
      .join("&");
    return this._sendRequest("GET", "setEmergency", body);
  }

  createOrder(
    fromCurrency: string,
    toCurrency: string,
    toAddress: string,
    fromQty: number,
    toQty = 0.0,
    type = "float",
    extra = ""
  ) {
    /*  Creating exchange orders  */
    var body: any;
    let params = {
      fromCurrency: fromCurrency,
      toCurrency: toCurrency,
      fromQty: fromQty,
      toQty: toQty,
      toAddress: toAddress,
      extra: extra,
      type: type,
    };

    body = Object.keys(params)
      .map((key) => key + "=" + params[key])
      .join("&");
    return this._sendRequest("POST", "createOrder", body);
  }
};

export default FixedFloat;