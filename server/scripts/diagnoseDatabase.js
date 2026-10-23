require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Admin = require("../models/Admin");
const MenuItem = require("../models/MenuItem");
const Order = require("../models/Order");
const Review = require("../models/Review");

const printCounts = (label, counts) => {
  console.log(`\n${label}`);
  console.log("--------------------------");
  console.log(`Owner accounts:  ${counts.admins}`);
  console.log(`Menu items:       ${counts.menu}`);
  console.log(`Orders:           ${counts.orders}`);
  console.log(`Reviews:          ${counts.reviews}`);
};

async function diagnoseDatabase() {
  try {
    await connectDB();

    const currentCounts = {
      admins: await Admin.countDocuments(),
      menu: await MenuItem.countDocuments(),
      orders: await Order.countDocuments(),
      reviews: await Review.countDocuments(),
    };

    console.log("\nAroma database diagnostic");
    console.log(`Current database: ${mongoose.connection.name}`);
    printCounts("Current database counts", currentCounts);

    if (currentCounts.menu === 0) {
      console.log(
        "\nNo menu documents exist in the selected database. Checking whether Atlas allows a read-only scan of other database names..."
      );

      try {
        const client = mongoose.connection.getClient();
        const { databases = [] } = await client.db("admin").admin().listDatabases({
          nameOnly: true,
        });
        const otherDatabases = databases.filter(
          ({ name }) => !["admin", "local", "config", mongoose.connection.name].includes(name)
        );
        const candidates = [];

        for (const { name } of otherDatabases) {
          const db = client.db(name);
          const counts = {
            admins: await db.collection("admins").countDocuments(),
            menu: await db.collection("menuitems").countDocuments(),
            orders: await db.collection("orders").countDocuments(),
            reviews: await db.collection("reviews").countDocuments(),
          };

          if (Object.values(counts).some((value) => value > 0)) {
            candidates.push({ name, counts });
          }
        }

        if (candidates.length) {
          console.log("\nOther databases with Aroma-like collections:");
          for (const candidate of candidates) {
            console.log(`\nDatabase name: ${candidate.name}`);
            printCounts("Found records", candidate.counts);
          }
          console.log(
            "\nIf one of these is the database you previously used for Aroma, set MONGO_DB_NAME to that exact name in server/.env and restart the server."
          );
        } else {
          console.log(
            "\nNo records were found in other visible databases. Check MongoDB Atlas > Browse Collections and confirm the database user has permission to list databases. No data was changed."
          );
        }
      } catch (scanError) {
        console.log(
          "\nThe current database user cannot list other databases, or Atlas blocked the scan. Open Atlas > Browse Collections and locate the database containing `menuitems`, `admins`, `orders`, and `reviews`; then set MONGO_DB_NAME to that name."
        );
      }
    } else {
      console.log(
        "\nMenu documents exist in the selected database. The API fix treats legacy items without an `available` field as available."
      );
    }
  } catch (error) {
    console.error("Database diagnostic failed:", error.message);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
}

diagnoseDatabase();
