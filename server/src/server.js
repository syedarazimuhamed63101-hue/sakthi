import "dotenv/config";
import express from "express";
import cors from "cors";
import { prisma } from "./prisma.js";
import { registerAuth, requireAdmin } from "./auth.js";

const app = express();

const PORT = Number(process.env.PORT || 5000);


app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

registerAuth(app, prisma);
const protectedRoutes = [
  "/api/properties",
  "/api/tenants",
  "/api/bills",
  "/api/maintenance",
  "/api/storage",
  "/api/managers",
  "/api/notifications",
  "/api/data",
];

app.use(protectedRoutes, requireAdmin);

app.get("/api/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      success: true,
      message: "Sakthi Construction API is connected",
      database: "connected",
    });
  } catch (error) {
    console.error("Database connection error:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

app.get("/api/properties", async (req, res) => {
  try {
    const properties = await prisma.property.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(properties);
  } catch (error) {
    console.error("Get properties error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch properties",
    });
  }
});

app.post("/api/properties", async (req, res) => {
  try {
    const {
      name,
      type,
      address,
      state,
      city,
      pincode,
      ownerName,
      ownerPhone,
      status,
      rentAmount,
      monthlyMaintenance,
      expectedPrice,
      pricePerSqft,
      totalFloors,
      floorNumber,
      flatType,
      flatsCount,
      length,
      width,
      carpetArea,
      builtupArea,
      plotArea,
      facingRoad,
      landUse,
      direction,
      furnished,
      additionalDetails,
      forSale,
      listed,
    } = req.body;

    if (!name || !address || !ownerName || !ownerPhone) {
      return res.status(400).json({
        success: false,
        message: "Name, address, owner name and owner phone are required",
      });
    }

    const property = await prisma.property.create({
      data: {
        name,
        type: type || "House",
        address,
        state: state || null,
        city: city || null,
        pincode: pincode || null,
        ownerName,
        ownerPhone,
        status: status || "Available",
        rentAmount: rentAmount ? Number(rentAmount) : null,
        monthlyMaintenance: monthlyMaintenance
          ? Number(monthlyMaintenance)
          : null,
        expectedPrice: expectedPrice ? Number(expectedPrice) : null,
        pricePerSqft: pricePerSqft ? Number(pricePerSqft) : null,
        totalFloors: totalFloors ? Number(totalFloors) : null,
        floorNumber: floorNumber || null,
        flatType: flatType || null,
        flatsCount: flatsCount ? Number(flatsCount) : 1,
        length: length ? Number(length) : null,
        width: width ? Number(width) : null,
        carpetArea: carpetArea ? Number(carpetArea) : null,
        builtupArea: builtupArea ? Number(builtupArea) : null,
        plotArea: plotArea ? Number(plotArea) : null,
        facingRoad: facingRoad || null,
        landUse: landUse || null,
        direction: direction || null,
        furnished: furnished || null,
        additionalDetails: additionalDetails || null,
        forSale: Boolean(forSale),
        listed: Boolean(listed),
      },
    });

    res.status(201).json(property);
  } catch (error) {
    console.error("Create property error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create property",
    });
  }
});

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Sakthi Construction backend is running",
  });
});

app.listen(PORT, () => {
  console.log(`Sakthi Construction API running on port ${PORT}`);
});