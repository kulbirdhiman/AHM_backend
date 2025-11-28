import express from "express"
import { trendingProduct ,WhatWeOfferProduct } from "../../controllers/home.controller"
const router = express.Router()

router.get("/trending-product",trendingProduct)
router.get("/what-we-offer",WhatWeOfferProduct)

export default router