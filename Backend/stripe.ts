import { Request, Response } from "express";
import stripe from "stripe";

import Expense from "./models/expenseModel";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "./models/userModel";

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
      success_url: `${req.protocol}://${req.get("host")}/`,
      cancel_url: `${req.protocol}://${req.get("host")}/expenses`,
    });

    res.status(303).json({
      status: "success",
      link: session.url,
      name: expense.title,
      paidby: user?.name,
    });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({
      message: error.message,
    });
  }
};
