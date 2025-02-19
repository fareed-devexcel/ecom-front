"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Create from "./create";
import Edit from "./edit";

// import { signOut } from "next-auth/react";

export default function Table() {
  const { data: session } = useSession(); // Get session data
  const [products, setProducts] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  useEffect(() => {
    if (!session?.accessToken) {
     
      return;
    }

    console.log("Session Data:", session); // Check if session is coming

    fetch("http://localhost:4000/api/products", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`, // Attach JWT token
      },
    })
      .then((response) => {
        if (response.status === 401) {
          setIsAuthorized(false);
          return;
        }
        return response.json();
      })
      .then((data) => {
        if (data && Array.isArray(data.message)) {
          setProducts(data.message);
        } else {
          console.error("Fetched data is not an array:", data);
        }
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, [session]);
   
  const handleDelete = (id) => {
    fetch(`http://localhost:4000/api/products/${id}`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`, // Attach JWT token
      },
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          setProducts(products.filter((product) => product._id !== id));
        } else {
          console.error("Failed to delete product");
        }
      })
      .catch((error) => console.error("Error deleting product:", error));
  };

  const handleCreate = (formData) => {
    fetch("http://localhost:4000/api/products", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.accessToken}`, // Attach JWT token
      },
      body: formData,
    })
      .then((response) => response.json())

      .then((data) => {
        setProducts([...products, data]);
        setIsCreateModalOpen(false);
      })
      .catch((error) => console.error("Error creating product:", error));
  };

  const handleEdit = (id, formData) => {
    fetch(`http://localhost:4000/api/products/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${session.accessToken}`, // Attach JWT token
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((updatedProduct) => {
        console.log("Updated Product from API:", updatedProduct); // Debugging API response

        if (!updatedProduct.success) {
          console.error("Update failed:", updatedProduct);
          return;
        }

        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === id
              ? { ...product, ...updatedProduct.data } // ✅ Extract `data` before updating state
              : product
          )
        );

        setIsEditModalOpen(false);
      })
      .catch((error) => console.error("Error updating product:", error));
  };

  if (!isAuthorized) {
    return <div className="flex justify-center mt-8">Unauthorized</div>;
  }

  return (
    <div className="container mx-auto flex flex-col items-center mt-8">
      <div className="flex justify-end w-full mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Add Product
        </button>
        {/* <button
          className="bg-red-500 text-white px-4 py-2 rounded mb-4 ms-2"
          onClick={() => signOut()}
        >
          Logout
        </button> */}
      </div>
      {isCreateModalOpen && (
        <Create
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreate}
        />
      )}
      {isEditModalOpen && currentProduct && (
        <Edit
          product={currentProduct}
          onClose={() => setIsEditModalOpen(false)}
          onEdit={handleEdit}
        />
      )}
      <table className="min-w-full bg-white border border-gray-200 text-center">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Price</th>
            <th className="py-2 px-4 border-b">Description</th>
            <th className="py-2 px-4 border-b">Image</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td className="py-2 px-4 border-b">{product.name}</td>
              <td className="py-2 px-4 border-b">{product.price}</td>
              <td className="py-2 px-4 border-b">{product.description}</td>
              <td className="py-2 px-4 border-b">
                <img
                  src={`http://localhost:4000/${product.image}`}
                  alt={product.name}
                  width="50"
                />
              </td>
              <td className="py-2 px-4 border-b">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                  onClick={() => handleDelete(product._id)}
                >
                  Delete
                </button>
                <button
                  className="bg-yellow-500 text-white px-4 py-2 rounded"
                  onClick={() => {
                    setCurrentProduct(product);
                    setIsEditModalOpen(true);
                  }}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
