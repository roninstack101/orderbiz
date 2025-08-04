import { useState } from "react";
import ShopProductCard from "./shopproductcard.js";
import { Plus } from "lucide-react";
import ConfirmDeleteModal from "./deletemodal.js";
import EditProductModal from "./editmodal.js";

const ProductsView = ({ products, setProducts }) => {
  const [productToDelete, setProductToDelete] = useState(null);
  const [productToEdit, setProductToEdit] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleDelete = (productId) => {
    console.log("Deleting:", productId);
    setProductToDelete(null);
  };
  const handleUpdate = (productId, data) => {
    console.log("Updating:", productId, data);
    setProductToEdit(null);
  };
  const handleToggle = (product) => {
    console.log("Toggling:", product.name);
  };
  const handleAdd = (id, data) => {
    console.log("Adding new product:", data);
    setIsAdding(false);
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
        <Plus size={20} /> Add
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
          isAddingNew={isAdding}
        />
      )}
    </div>
  );
};

export default ProductsView;