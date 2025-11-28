import checkoutNodeJssdk from "@paypal/checkout-server-sdk";
import dotenv from "dotenv";
dotenv.config();

let environment: checkoutNodeJssdk.core.PayPalEnvironment;

if (process.env.PAYPAL_ENV === "sandbox") {
  environment = new checkoutNodeJssdk.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID!,
    process.env.PAYPAL_CLIENT_SECRET!
  );
} else {
  environment = new checkoutNodeJssdk.core.LiveEnvironment(
    process.env.PAYPAL_CLIENT_ID!,
    process.env.PAYPAL_CLIENT_SECRET!
  );
}

export const paypalClient = new checkoutNodeJssdk.core.PayPalHttpClient(environment);
