import Cart from "../models/cart.model";
import Product from "../models/products.model";

export const viewcart = async (req, res) => {
  const { userid } = req.params;

  try {
    const usercart = await Cart.findOne({ user: userid }).populate(
      "items.product"
    );
    if (!usercart) return res.status(404).json({ message: "cart not found" });

    const totalprice = usercart.items.reduce((acc, item) => {
      return acc + item.product.price * item.quantity;
    }, 0);

    res.status(201).json({ ...usercart.toObject(), totalprice });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching cart", error: error.message });
  }
};

export const addtocart = async (req, res) => {
  const { userid, productid, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ user: userid });

    if (!cart) {
      cart = new Cart({ user: userid, items: [] });
    }

    const index = cart.items.findIndex(
      (item) => item.product.toString() === productid
    );

    if (index >= 0) {
      cart.items[index].quantity += quantity;
    } else {
      cart.items.push({ product: productid, quantity });
    }
    await cart.save();
    res.status(200).json({ message: "Item added successfully", cart });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error in Adding Item", error: error.message });
  }
};

export const removeItem = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(40).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );
    await cart.save();

    res.status(200).json({ message: "item removed", cart });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error removing item", error: error.message });
  }
};

export const clearcart = async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOneAndUpdate({ user: userId }, { items: [] });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json({ message: "cart cleared" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error clearing cart", error: error.message });
  }
};
