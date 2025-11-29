import dotenv from "dotenv";
import mongoose from "mongoose";
import { allProducts } from "./data/massiveProducts.js";
import Product from "./models/Product.js";

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/harvesthub"
    );
    console.log("📂 Connected to MongoDB for seeding");

    // Clear existing products
    await Product.deleteMany({});
    console.log("🗑️ Cleared existing products");

    // Transform the product data to match the Product schema
    const transformedProducts = allProducts.map((product) => ({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      imageUrl: product.image,
      unit: product.unit || "per piece",
      stock: 100, // Default stock
      inStock: product.inStock,
      isActive: true,
      ratings: {
        average: Math.random() * 5, // Random rating
        count: Math.floor(Math.random() * 100),
      },
    }));

    // Insert products in batches
    const batchSize = 100;
    for (let i = 0; i < transformedProducts.length; i += batchSize) {
      const batch = transformedProducts.slice(i, i + batchSize);
      await Product.insertMany(batch);
      console.log(
        `✅ Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(
          transformedProducts.length / batchSize
        )}`
      );
    }

    console.log(
      `🎉 Successfully seeded ${transformedProducts.length} products!`
    );

    // Verify the seeding
    const count = await Product.countDocuments();
    console.log(`📊 Total products in database: ${count}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

// Run the seeder
seedDatabase();
