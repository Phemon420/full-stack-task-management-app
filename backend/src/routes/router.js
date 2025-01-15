import { Router } from "express";
import {authController,menuController,orderController} from "../controllers/authcontroller.js";

const router = Router();

// Define routes
router.get('/signup',authController.signup_get);
router.post('/signup',authController.signup_post);
router.get('/login',authController.login_get);
router.post('/login',authController.login_post);

router.get('/admin-signup',authController.admin_signup_get);
router.post('/admin-signup',authController.admin_signup_post);

router.get('/logout',authController.logout_get);

router.get('/menu', menuController.menu_get_all); 
router.get('/menu/:id', menuController.menu_get_by_id); 
router.post('/menu', menuController.menu_create); 
router.put('/menu/:serialNumber', menuController.menu_update);
router.delete('/menu/:serialNumber', menuController.menu_delete);

router.post('/order_food', orderController.order_create);
router.get('/order_food', orderController.order_get_all);

export default router;