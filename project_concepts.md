# 🛍️ E-Commerce Platform – Key Concepts


## 1.  User

- **Context**: Users can register, log in, add products to the cart, place orders, and view QR codes for pickups after approval.
- **Important Info**:
  - Fields: `name`, `email`, `password`, `address`, `phone`, `isShopOwner`
  - Role determines access to user or shop dashboard.
  - Linked to orders and cart.



## 2.  Shop

- **Context**: A shop is created by a user who opts to register as a shopkeeper. Needs admin approval.
- **Important Info**:
  - Fields: `shopName`, `ownerId`, `status: pending/approved/rejected`, `location`
  - Admin verifies and approves the shop.
  - One user → One shop relationship


## 3.  Cart

- **Context**: Temporary storage for products a user wants to buy.
- **Important Info**:
  - Fields: `userId`, `items[] (productId, quantity)`
  - Routes: `/addcart`, `/removefromcart`, `/getcart`, `/emptycart/:userId`

## 4.  Product

- **Context**: Created and managed by shopkeepers. Displayed to users based on shop approval.
- **Important Info**:
  - Fields: `shopId`, `name`, `price`, `quantity`, `category`, `description`
  - Routes: `GET /products/:shopId`, `POST /products`, `PUT /products/:productId`, `DELETE /products/:id`
  - Only shopkeepers can create/update/delete


## 5.  Order

- **Context**: Created when a user places an order. Awaiting shopkeeper approval.
- **Important Info**:
  - Fields: `userId`, `shopId`, `items[]`, `status: pending/accepted/rejected`, `qrCodeUrl`
  - Status changes trigger QR code generation.
  - Users can only view QR after status = `accepted`.


## 6.  QR Code

- **Context**: Shown to users **only after** the shopkeeper approves an order.
- **Important Info**:
  - Generated on server when order is accepted.
  - Sent as image or embedded in response.
  - Used at pickup point to validate purchase.



## 7.  Admin

- **Context**: Manages shops, users, and products.
- **Important Info**:
  - Routes: `/admin/shops`, `/admin/shops/:id/approve`, `/admin/users`, `/admin/stats`
  - Only admin can approve/reject shops.
  - Uses `isAdmin` middleware for route protection.



## 8.  Authentication & Roles

- **Context**: All users share the same login page. Roles determine redirection and access.
- **Important Info**:
  - Login returns JWT + role
  - Redirect:
    - `User`: user dashboard
    - `Shopkeeper`: shop dashboard (if approved)
    - `Admin`: admin panel

