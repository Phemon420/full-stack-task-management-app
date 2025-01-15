import jwt from "jsonwebtoken";
import { User, Menu, Order} from "../models/db.js";


const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, 'phemon secrets', (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect('/login');
            } else {
                //console.log(decodedToken);
                next();
            }
        });
    } else {
        res.redirect('/login');
    }
};

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, 'phemon secrets', async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.locals.user = null; // corrected here
                next();
            } else {
                //console.log(decodedToken);
                const user = await User.findById(decodedToken.id);
                res.locals.user = user; // corrected here
                next();
            }
        });
    } else {
        res.locals.user = null; // corrected here
        next();
    }
};

const menuItems = async (req, res, next) => {
    try {
        // Fetch all menu items from the database
        const menus = await Menu.find(); // Assuming Menu is a model that holds the menu data
    
        // Attach the fetched menu items to the response object
        res.locals.menus = menus; // This is how data is passed to the view
        res.render('order');
        //next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Error fetching menu items:', error);
        res.status(500).send('Error fetching menu items');
    }
};


const fetchUserOrders = async (req, res, next) => {
    try {
      const token = req.cookies.jwt;
      if (token) {
        jwt.verify(token, 'phemon secrets', async (err, decodedToken) => {
          if (err) {
            console.log(err.message);
            res.locals.user = null; // corrected here
            next();
          } else {
            // The user object is already available in res.locals.user from the checkUser middleware
            const user = res.locals.user;
            
            // If no user found, redirect to login
            if (!user) {
              return res.redirect('/login');
            }
  
            const userId = user._id; // Now using res.locals.user instead of req.user
  
            // Fetch orders for the current user, populating the menu item details
            const orders = await Order.find({ userId })
              .populate('items.menuItemId', 'name price category') // Populate menu item details (you can specify other fields you need)
              .exec();
  
            if (!orders || orders.length === 0) {
              return res.status(404).send('No orders found for this user');
            }
  
            // Attach the fetched orders to the response object for use in the next middleware or view
            res.locals.orders = orders;
  
            // Proceed to the next middleware or render a view
            res.render('basket'); // Example: render orders page with fetched orders
          }
        });
      } else {
        // If no token, set user to null and proceed
        res.locals.user = null;
        next();
      }
    } catch (error) {
      console.error('Error fetching orders for user:', error);
      res.status(500).send('Error fetching orders');
    }
  };
  
// const fetchUserOrders = async (req, res, next) => {
//   try {
//     const token = req.cookies.jwt;
//     if (token) {
//         jwt.verify(token, 'phemon secrets', async (err, decodedToken) => {
//             if (err) {
//                 console.log(err.message);
//                 res.locals.user = null; // corrected here
//                 next();
//             } else {
//                 //console.log(decodedToken);
//                 const user = await User.findById(decodedToken.id);
//                 res.locals.user = user; // corrected here
//                 const userId = req.user._id; // Assuming user._id is available in req.user from a previous auth middleware

//                 // Fetch orders for the current user, populating the menu item details
//                 const orders = await Order.find({ userId })
//                   .populate('items.menuItemId', 'name price category') // Populate menu item details (you can specify other fields you need)
//                   .exec();
            
//                 if (!orders || orders.length === 0) {
//                   return res.status(404).send('No orders found for this user');
//                 }
            
//                 // Attach the fetched orders to the response object for use in the next middleware or view
//                 res.locals.orders = orders;
            
//                 // Proceed to the next middleware or render a view
//                 res.render('basket'); // Example: render orders page with fetched orders                
//                 next();
//             }
//         });
//     }
//   } catch (error) {
//     console.error('Error fetching orders for user:', error);
//     res.status(500).send('Error fetching orders');
//   }
// };



export { requireAuth, checkUser, menuItems, fetchUserOrders};