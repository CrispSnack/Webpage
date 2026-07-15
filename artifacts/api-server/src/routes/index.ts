import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import productsRouter from "./products.js";
import cartRouter from "./cart.js";
import ordersRouter from "./orders.js";
import adminAuthRouter from "./admin/auth.js";
import adminProductsRouter from "./admin/products.js";
import adminOrdersRouter from "./admin/orders.js";
import adminCouponsRouter from "./admin/coupons.js";
import adminStaffRouter from "./admin/staff.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/products", productsRouter);
router.use("/cart", cartRouter);
router.use("/orders", ordersRouter);

// Admin routes
router.use("/admin/auth", adminAuthRouter);
router.use("/admin/products", adminProductsRouter);
router.use("/admin/orders", adminOrdersRouter);
router.use("/admin/coupons", adminCouponsRouter);
router.use("/admin/staff", adminStaffRouter);

export default router;
