require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const MenuItem = require("../models/MenuItem");
const connectDB = require("../config/db");

// Initial Aroma demo menu. Only missing names are inserted; existing menu
// documents are never overwritten. Real customer orders and reviews are not seeded.
const initialMenu = [
  {
    name: "Espresso",
    description: "A rich, intense shot of freshly pulled espresso.",
    price: 120,
    category: "Coffee",
    image: "https://images.unsplash.com/photo-1510707577719-ae7c14805e76?auto=format&fit=crop&w=1200&q=80",
    available: true,
    featured: true,
  },
  {
    name: "Americano",
    description: "A smooth espresso topped with hot water.",
    price: 140,
    category: "Coffee",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80",
    available: true,
    featured: false,
  },
  {
    name: "Cappuccino",
    description: "Balanced espresso with steamed milk and soft milk foam.",
    price: 180,
    category: "Coffee",
    image: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=1200&q=80",
    available: true,
    featured: true,
  },
  {
    name: "Cafe Mocha",
    description: "Espresso, silky milk and rich chocolate in one cup.",
    price: 210,
    category: "Coffee",
    image: "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=1200&q=80",
    available: true,
    featured: false,
  },
  {
    name: "Classic Iced Latte",
    description: "Chilled espresso and milk served over ice.",
    price: 190,
    category: "Cold Coffee",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=1200&q=80",
    available: true,
    featured: true,
  },
  {
    name: "Caramel Frappe",
    description: "A creamy blended coffee with caramel sweetness.",
    price: 230,
    category: "Cold Coffee",
    image: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=1200&q=80",
    available: true,
    featured: false,
  },
  {
    name: "Iced Mocha",
    description: "Cold coffee, chocolate and milk finished over ice.",
    price: 220,
    category: "Cold Coffee",
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=1200&q=80",
    available: true,
    featured: false,
  },
  {
    name: "Vanilla Cold Coffee",
    description: "A chilled, velvety coffee with a gentle vanilla note.",
    price: 220,
    category: "Cold Coffee",
    image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=1200&q=80",
    available: true,
    featured: false,
  },
  {
    name: "Masala Chai",
    description: "Classic Indian tea simmered with milk and warming spices.",
    price: 90,
    category: "Tea",
    image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=1200&q=80",
    available: true,
    featured: false,
  },
  {
    name: "Ginger Tea",
    description: "A comforting cup of tea brewed with fresh ginger.",
    price: 100,
    category: "Tea",
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=80",
    available: true,
    featured: false,
  },
  {
    name: "Lemon Honey Tea",
    description: "Light tea with refreshing lemon and a touch of honey.",
    price: 120,
    category: "Tea",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=1200&q=80",
    available: true,
    featured: false,
  },
  {
    name: "Chamomile Tea",
    description: "A delicate herbal infusion with a mellow floral aroma.",
    price: 130,
    category: "Tea",
    image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=1200&q=80",
    available: true,
    featured: false,
  },
  {
    name: "Grilled Veg Sandwich",
    description: "Toasted bread layered with fresh vegetables and house sauce.",
    price: 210,
    category: "Food",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=1200&q=80",
    available: true,
    featured: true,
  },
  {
    name: "Paneer Tikka Sandwich",
    description: "Spiced paneer, crunchy vegetables and a creamy mint spread.",
    price: 250,
    category: "Food",
    image: "https://images.unsplash.com/photo-1553909489-cd47e0ef937f?auto=format&fit=crop&w=1200&q=80",
    available: true,
    featured: false,
  },
  {
    name: "Cheese Garlic Bread",
    description: "Toasted garlic bread topped with melted cheese and herbs.",
    price: 180,
    category: "Food",
    image: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&w=1200&q=80",
    available: true,
    featured: false,
  },
  {
    name: "Butter Croissant",
    description: "A flaky, buttery pastry baked until golden.",
    price: 140,
    category: "Food",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1200&q=80",
    available: true,
    featured: false,
  },
  {
    name: "Chocolate Brownie",
    description: "A fudgy chocolate brownie with a delicate crisp top.",
    price: 170,
    category: "Dessert",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1200&q=80",
    available: true,
    featured: true,
  },
  {
    name: "New York Cheesecake",
    description: "Creamy baked cheesecake on a buttery biscuit base.",
    price: 260,
    category: "Dessert",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=1200&q=80",
    available: true,
    featured: false,
  },
  {
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with a soft, molten centre.",
    price: 220,
    category: "Dessert",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1200&q=80",
    available: true,
    featured: false,
  },
  {
    name: "Tiramisu Cup",
    description: "Coffee-soaked layers with a smooth mascarpone-style cream.",
    price: 280,
    category: "Dessert",
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=1200&q=80",
    available: true,
    featured: false,
  },
];

async function seedInitialData() {
  try {
    const email = process.env.RESET_OWNER_EMAIL?.trim().toLowerCase();
    const password = process.env.RESET_OWNER_PASSWORD;
    const ownerName = process.env.RESET_OWNER_NAME?.trim() || "Aroma Owner";

    if (!email || !password) {
      throw new Error(
        "Set RESET_OWNER_EMAIL and RESET_OWNER_PASSWORD before running this script."
      );
    }
    if (password.length < 8) {
      throw new Error("Use a new password with at least 8 characters.");
    }

    await connectDB();
    console.log(`Seeding initial data in database: ${mongoose.connection.name}`);

    // Create or update only the owner account matching the supplied email.
    const passwordHash = await bcrypt.hash(password, 12);
    const owner = await Admin.findOne({ email });
    if (owner) {
      owner.name = ownerName;
      owner.password = passwordHash;
      await owner.save();
      console.log(`Owner login updated: ${owner.email}`);
    } else {
      const createdOwner = await Admin.create({
        name: ownerName,
        email,
        password: passwordHash,
      });
      console.log(`Owner account created: ${createdOwner.email}`);
    }

    // Upsert on name, setting only on insert so existing menu edits are preserved.
    const operations = initialMenu.map((item) => ({
      updateOne: {
        filter: { name: item.name },
        update: { $setOnInsert: item },
        upsert: true,
      },
    }));
    const result = await MenuItem.bulkWrite(operations, { ordered: true });

    const totalMenuItems = await MenuItem.countDocuments();
    console.log(`Menu items inserted: ${result.upsertedCount || 0}`);
    console.log(`Total menu items now: ${totalMenuItems}`);
    console.log("No orders or reviews were fabricated or modified.");
    console.log("Initial Aroma data setup completed.");
  } catch (error) {
    console.error("Initial data setup failed:", error.message);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
}

seedInitialData();
