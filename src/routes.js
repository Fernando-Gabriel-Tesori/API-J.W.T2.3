import { Router } from "express";
import multer from "multer";



import multerConfig from "./config/multer.js";
import authMiddllewares from "./app/middelewares/auth.js";

import UserController from "./app/controller/UserController.js";
import SessionController from "./app/controller/SessionController.js";
import productController from "./app/controller/ProductController.js";
import CategoryController from "./app/controller/CategoryController.js";
import OrderController from "./app/controller/OrderController.js";
import CreatePaymentIntentController from "./app/controller/stripe/CreatePaymentIntentController.js";

const routes = new Router();

const uploads = multer(multerConfig);

routes.post("/users", UserController.store);
routes.post("/sessions", SessionController.store);

routes.get("/categories", CategoryController.index);

routes.use(authMiddllewares);


routes.post("/products", uploads.single("file"), productController.store);
routes.put("/products/:id", uploads.single("file"), productController.update);
routes.get("/products", productController.index);

routes.post("/categories", uploads.single("file"), CategoryController.store);
routes.put("/categories/:id", uploads.single("file"), CategoryController.update);

routes.post("/order", OrderController.store);
routes.get("/order", OrderController.index);
routes.put("/order/:id", OrderController.update);

routes.post("/create-payment-intent", CreatePaymentIntentController.store)

export default routes;
