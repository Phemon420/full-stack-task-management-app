import mongoose from "mongoose";
import isEmail from "validator/lib/isEmail.js";
import bcrypt from "bcrypt";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

// Shared Schema Methods
const schemaMethods = {
  preSaveHook: async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
  },
  postSaveHook: function (doc, next) {
    console.log(`New ${this.constructor.modelName.toLowerCase()} created and saved`, doc);
    next();
  },
  staticLogin: async function (email, password) {
    const entity = await this.findOne({ email });
    if (entity) {
      const auth = await bcrypt.compare(password, entity.password);
      if (auth) {
        return entity;
      }
      throw Error("incorrect password");
    }
    throw Error("incorrect email");
  },
};

// User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "username is required"],
    minlength: [6, "minimum username length is 6 characters"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
    minlength: [8, "minimum password length is 8 characters"],
  },
  role:{
    type: String,
    default: 'user',
  }
});

//menuSchema
const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Menu item name is required"],
  },
  category: {
    type: String,
    required: [true, "Menu item category is required"],
    enum: ["Appetizers", "Main Course", "Desserts"],
  },
  price: {
    type: Number,
    required: [true, "Menu item price is required"],
    min: [0, "Price cannot be negative"],
  },
  availability: {
    type: Boolean,
    default: true,
  },
  serialNumber: { 
    type: Number,
    unique: true, 
    required: true,
   },
});

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",  // Reference to the User model
    required: [true, "User ID is required"],
  },
  items: [
    {
      menuItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Menu",  // Reference to the Menu model
        required: [true, "Menu item ID is required"],
      },
      quantity: {
        type: Number,
        required: [true, "Quantity is required"],
        min: [1, "Quantity must be at least 1"],
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: [true, "Total amount is required"],
    min: [0, "Total amount cannot be negative"],
  },
  status: {
    type: String,
    enum: ["Pending", "Completed", "Cancelled"],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,  // Automatically set to current timestamp
  },
});

// Attach hooks and static methods to both schemas
userSchema.pre("save", schemaMethods.preSaveHook);
userSchema.post("save", schemaMethods.postSaveHook);
userSchema.statics.login = schemaMethods.staticLogin;
menuSchema.plugin(AutoIncrement, { inc_field: "serialNumber" });

// Export models
const User = mongoose.model("User", userSchema);
const Menu = mongoose.model("Menu", menuSchema);
const Order = mongoose.model("Order", orderSchema);

export { User, Menu, Order};