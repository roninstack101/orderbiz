import { useState } from "react";
import ShopProductCard from "./shopproductcard.js";
import { Plus } from "lucide-react";
import ConfirmDeleteModal from "./deletemodal.js";
import EditProductModal from "./editmodal.js";
import axios from "axios";
import toast from "react-hot-toast"; // Import toast for user feedback

const ProductsView = ({ products, setProducts, shopId }) => {
  const [productToDelete, setProductToDelete] = useState(null);
  const [productToEdit, setProductToEdit] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
//   const [imageFile, setImageFile] = useState(null);

  const handleDelete = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:4000/api/product/delete/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setProducts(products.filter(p => p._id !== productId));
      toast.success("Product deleted successfully!");
    } catch (error) {
      console.error("Failed to delete product", error);
      toast.error("Failed to delete product");
    } finally {
      setProductToDelete(null);
    }
  };

 const handleUpdate = async (updateData) => {
  // `updateData` is the object from the modal's form
  // We need the original product to compare against
  const originalProduct = productToEdit;

  if (!originalProduct) {
    toast.error("An error occurred. Cannot find the original product.");
    return;
  }

  try {
    const token = localStorage.getItem("token");
    const data = new FormData();
    let hasChanges = false;

    // --- Intelligent Change Detection ---

    // Check text/number fields for changes
    const fields = ['name', 'description', 'price', 'quantity', 'category'];
    fields.forEach(field => {
      // Compare string values to avoid type issues (e.g., 150 vs "150")
      // This correctly detects when a field is cleared (e.g., "old value" -> "")
      if (String(originalProduct[field] || '') !== String(updateData[field] || '')) {
        data.append(field, updateData[field]);
        hasChanges = true;
      }
    });

    // Check if a new image file was added
    if (updateData.imageFile) {
      data.append("image", updateData.imageFile);
      hasChanges = true;
    }

    // --- End of Change Detection ---

    // If no changes were made, just close the modal and inform the user.
    if (!hasChanges) {
      toast.success("No changes were made.");
      setProductToEdit(null);
      return;
    }

    const res = await axios.put(
      `http://localhost:4000/api/product/update/${updateData._id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      }
    );

    setProducts(products.map(p =>
      p._id === updateData._id ? res.data.product : p
    ));
    toast.success("Product updated successfully!");

  } catch (error) {
    toast.error(`Failed to update product: ${error.response?.data?.message || error.message}`);
  } finally {
    setProductToEdit(null); // Close the modal
  }
};


  // ProductsView.js

const handleAdd = async (formData) => {
  try {
    const token = localStorage.getItem("token");
    const data = new FormData();
    
    data.append("shop", shopId);
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price); 
    data.append("quantity", formData.quantity);
    data.append("category", formData.category || "");
    
    if (formData.imageFile) {
      data.append("image", formData.imageFile);
    }

    const res = await axios.post(
      "http://localhost:4000/api/product/add", 
      data, 
      { 
        headers: { 
          Authorization: `Bearer ${token}`,
          // THIS IS THE FIX 👇
          "Content-Type": "multipart/form-data" 
        } 
      }
    );

    setProducts([...products, res.data.product]);
    toast.success("Product added successfully!");
  } catch (error) {
    // Improved error logging
    console.error("Failed to add product", error.response?.data || error.message);
    toast.error(error.response?.data?.message || "Failed to add product");
  } finally {
    setIsAdding(false);
  }
};

  const handleToggle = async (product) => {
  try {
    const token = localStorage.getItem("token");

    // Call the new dedicated endpoint
    const res = await axios.put(
      `http://localhost:4000/api/product/toggle-availability/${product._id}`,
      {}, // No need to send a body, the backend handles the toggle
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Update state with the returned product for consistency
    setProducts(products.map(p => 
      p._id === product._id ? res.data.product : p
    ));

    toast.success(res.data.message);
  } catch (error) {
    console.error("Failed to toggle availability", error);
    toast.error("Failed to update availability");
  }
};

  return (
    <div className="relative pb-20">
      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <ShopProductCard
              key={product._id}
              product={product}
              onDelete={() => setProductToDelete(product)}
              onEdit={() => setProductToEdit(product)}
              onToggleAvailability={() => handleToggle(product)}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-8 py-8">
          You haven't added any products yet.
        </p>
      )}
      
      <button
        onClick={() => setIsAdding(true)}
        className="fixed bottom-12 right-12 bg-blue-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:bg-blue-700 flex items-center gap-2 z-20"
      >
        <Plus size={20} /> Add Product
      </button>
      
      {productToDelete && (
        <ConfirmDeleteModal
          onConfirm={() => handleDelete(productToDelete._id)}
          onCancel={() => setProductToDelete(null)}
        />
      )}
      
      {(productToEdit || isAdding) && (
      <EditProductModal
        product={productToEdit}
        onUpdate={isAdding ? handleAdd : handleUpdate}
        onCancel={() => {
          setProductToEdit(null);
          setIsAdding(false);
        }}
        // REMOVE: setImageFile={setImageFile} // Delete this prop
        isAddingNew={isAdding}
      />
      )}
    </div>
  );
};

export default ProductsView;