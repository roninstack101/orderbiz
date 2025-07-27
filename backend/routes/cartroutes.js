import { addtocart, removeItem, clearcart, viewcart } from "../controller/cartcontroller.js";

const router = express.Router();

router.get("/getcart", viewcart);

router.post("/addcart", addtocart);

router.delete("/removefromcart", removeItem);

router.put("/emptycart/:userId", clearcart);


export default router;