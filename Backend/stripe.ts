import { Request, Response } from "express";
import stripe from "stripe";

import Expense from "./models/expenseModel";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "./models/userModel";



//stripe method for creating the checkout session
const stripeInstance = new stripe(
  "sk_test_51P7XldSCqlnBTgeBB3yyoExsvWe4JEsuXdJPUVqjDKXLZJ6Q8cVYOTS6gkWekx2Qh42RkezGuHiNa7kdlZGuDeZ000JkqXeA61"
);

export const createCheckOutSession = async (req: Request, res: Response) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) {
      throw new Error("Not Authorized");
    }

    const token = auth.split(" ")[1];
    const decodedtoken = jwt.decode(token) as JwtPayload;
    if (!decodedtoken) {
      throw new Error("token not found");
    }
    const userId = decodedtoken.id;

    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw new Error("user not found");
    }
    const expenseId = req.params.expenseId;
    const expense = await Expense.findById(expenseId);

    if (!expense) {
      throw new Error("Expense not found");
    }

    const priceId = expense.amount;

    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: expense.title,
            },
            unit_amount: priceId * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.protocol}://localhost:4200/Expense`,
      cancel_url: `${req.protocol}://localhost:4200/Expense`,
      metadata: {
        expenseId: expenseId,
        username: user.name,
      },
    });

    res.status(303).json({
      status: "success",
      link: session.url,
      name: expense.title,
    });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({
      message: error.message,
    });
  }
};


//for updating the expense's after the payment has been done
export const handleStripeEvent = async (req: Request, res: Response) => {
  try {
    const payload = (req as any).rawBody;
    const sig = req.headers["stripe-signature"] as string;

    const event = stripeInstance.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      if (!session.metadata) {
        throw new Error("session not found");
      }
      const expenseId = session.metadata.expenseId;
      const username = session.metadata.username;
      console.log(expenseId);

      await Expense.findByIdAndUpdate(expenseId, {
        markAspaid: true,
        paidBy: username,
      });
    }

    res.status(200).json({
      status: "success",
    });
  } catch (error: any) {
    console.error(error.message);
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};
