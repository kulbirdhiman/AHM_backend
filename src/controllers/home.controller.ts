import Product from "../models/Product";
import { Request, Response } from "express";


const trendingProduct = async (req: Request, res: Response) => {
    try {
        const products = await Product.findAll({
            limit: 4,
            order: [["createdAt", "DESC"]], // optional: latest first
        });

        res.status(200).json({
            success: true,
            data: products,
        });

    } catch (error: any) {
        console.error("Trending Product Error:", error);

        res.status(500).json({
            success: false,
            message: error.message || "Something went wrong",
        });
    }
};
const WhatWeOfferProduct = async (req: Request, res: Response) => {
    try {
        const products = await Product.findAll({
            limit: 10,
            order: [["createdAt", "DESC"]], // optional: latest first
        });

        res.status(200).json({
            success: true,
            data: products,
        });

    } catch (error: any) {
        console.error("Trending Product Error:", error);

        res.status(500).json({
            success: false,
            message: error.message || "Something went wrong",
        });
    }
};

export { trendingProduct ,WhatWeOfferProduct }