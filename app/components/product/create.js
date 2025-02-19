import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Price must be a valid number"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  image: z
    .any()
    .refine((file) => file instanceof File, "Image is required"),
});

export default function Create({ onClose, onCreate }) {
  const [imageFile, setImageFile] = useState(null);
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("price", data.price);
    formData.append("description", data.description);
    if (imageFile) {
      formData.append("image", imageFile);
    }
    onCreate(formData);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setValue("image", file);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded shadow-lg">
        <h2 className="text-2xl mb-4">Create New Product</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            placeholder="Name"
            {...register("name")}
            className="border p-2 mb-2 w-full"
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}

          <input
            type="text"
            placeholder="Price"
            {...register("price")}
            className="border p-2 mb-2 w-full"
          />
          {errors.price && (
            <p className="text-red-500">{errors.price.message}</p>
          )}

          <input
            type="text"
            placeholder="Description"
            {...register("description")}
            className="border p-2 mb-2 w-full"
          />
          {errors.description && (
            <p className="text-red-500">{errors.description.message}</p>
          )}

          <input
            type="file"
            onChange={handleFileChange}
            className="border p-2 mb-2 w-full"
          />
          {errors.image && (
            <p className="text-red-500">{errors.image.message}</p>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
