import {User,Menu,Order} from "../models/db.js";
import Services from "../services/service.js";
import {handleErrors,foodErrors} from "../helper/errorhandler.js";
import isEmail from "validator/lib/isEmail.js";

const authController = {
    signup_get: (req, res) => {
      res.render("signup");
    },
    
    login_get: (req, res) => {
      res.render("login");
      //console.log(req);
    },

    signup_post: async(req, res) => {
      try {
        const { token, ...newUser } = await Services.createUser(req.body); // Extract token and user data
        const maxAge = 3 * 24 * 60 * 60; // Define maxAge (3 days in seconds)

        // Set the JWT as a cookie
        //console.log(token);

        res.cookie('jwt', token, {httpOnly: true,maxAge: maxAge * 1000, });
        
        // Respond with the new user data
        res.status(201).json(newUser);
      }
      catch (err) {
         const errors=handleErrors(err);
         console.log(errors);
         res.status(400).json(errors);
      }
    },

    login_post: async(req, res) => {
      const {email,password}=req.body;
      try {
        //console.log("Trying to login with email:", email);
        const user=await User.login(email,password);
        //console.log(email);
        const token = Services.createToken(user._id); // Extract token and user data
        //console.log(token);
        const maxAge = 3 * 24 * 60 * 60;

        res.cookie('jwt', token, {httpOnly: true,maxAge: maxAge * 1000, });
        
        res.status(201).json(user);
      }
      catch (err) {
         const errors=handleErrors(err);
         //console.log(errors);
         res.status(400).json(errors);
      }
    },

    admin_signup_get: (req, res) => {
      res.render("signup");
    },

    admin_signup_post: async(req, res) => {
      try {
        const { token, ...newUser } = await Services.createAdmin(req.body); // Extract token and user data
        const maxAge = 3 * 24 * 60 * 60; // Define maxAge (3 days in seconds)

        // Set the JWT as a cookie

        res.cookie('jwt', token, {httpOnly: true,maxAge: maxAge * 1000, });
        
        // Respond with the new user data
        res.status(201).json(newUser);
      }
      catch (err) {
         const errors=handleErrors(err);
         console.log(errors);
         res.status(400).json(errors);
      }
    },

    logout_get:async(req,res)=>{
      res.cookie('jwt','',{maxAge:1});
      res.redirect('/');
    }
  };


  const menuController = {
    menu_get_all : async (req, res) => {
        try {
            const menus = await Menu.find();
            res.status(200).json({ menus: menus.length > 0 ? menus : null, errors: null });
        } catch (err) {
          const errors = foodErrors(err);
          res.status(500).json({ menus: null, errors: errors });
        }
    },

    menu_get_by_id : async (req, res) => {
        try {
            const menus = await Menu.findOne({ serialNumber: req.params.serialNumber }); // Use serialNumber
            if (!menus) {
              const customError = { customError: 'Invalid ID: No menu item found with the given serial number.' };
              const errors = foodErrors(customError);
              return res.status(404).json({ menus: null, errors: errors });
            }
            res.status(200).json({ menus: menus.length > 0 ? menus : null, errors: null });
        } catch (err) {
          const errors = foodErrors(err);
          res.status(500).json({ menus: null, errors: errors });
        }
    },

    menu_create : async (req, res) => {
        try {
            const newMenu = new Menu(req.body);
            const menus = await newMenu.save();
            //res.status(201).json(savedMenu);
            res.status(200).json({ menus: menus.length > 0 ? menus : null, errors: null });
        } catch (err) {
          const errors = foodErrors(err);
          res.status(500).json({ menus: null, errors: errors });
        }
    },

    menu_update : async (req, res) => {
        try {
            const menus = await Menu.findOneAndUpdate(
                { serialNumber: req.params.serialNumber },
                req.body,
                { new: true }
            );
            if (!menus){
              const customError = { customError: 'Invalid ID: No menu item found with the given serial number.' };
              const errors = foodErrors(customError);
              return res.status(404).json({ menus: null, errors: errors });
            } 
            //res.status(200).json(updatedMenu);
            res.status(200).json({ menus: menus.length > 0 ? menus : null, errors: null });
        } catch (err) {
          const errors = foodErrors(err);
          res.status(500).json({ menus: null, errors: errors });
        }
    },

    menu_delete : async (req, res) => {
        try {
            //console.log(req.params.serialNumber);
            const menus = await Menu.findOneAndDelete({ serialNumber: req.params.serialNumber }); // Use serialNumber for delete
            if (!menus) {
              const customError = { customError: 'Invalid ID: No menu item found with the given serial number.' };
              const errors = foodErrors(customError);
              return res.status(404).json({ menus: null, errors: errors });
            }
            //res.status(200).json({ message: "Menu item deleted successfully" });
            res.status(200).json({ menus: menus.length > 0 ? menus : null, errors: null });
        } catch (err) {
          const errors = foodErrors(err);
          res.status(500).json({ menus: null, errors: errors });
        }
    }
  };

const orderController = {
    order_create : async (req, res) => {
        try {
            const newOrderData = {
              userId: req.body.userId,
              totalAmount: req.body.totalAmount,
              createdAt: req.body.createdAt || new Date(),
              status: req.body.status || 'Pending',
              items: req.body.orderData, // Map orderData to items
            };
            
            const newOrder = new Order(newOrderData);
            const orders = await newOrder.save();
            console.log("Order created successfully:", orders);
            res.status(201).json(orders); 
        } catch (err) {
          //const errors = foodErrors(err);
          console.error("Error creating order:", err.message);
          //return err;
          //res.status(500).json({ orders: null, errors: errors });
        }
    },

    order_get_all : async (req, res) => {
        try {
            res.render("order");
        } catch (err) {
          // const errors = foodErrors(err);
           res.status(500);
          return err;
        }
},

};
  
export { authController, menuController,orderController };