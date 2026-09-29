import express from "express";
import cors from "cors";
import snailPayRoutes from "./routes/snailPayroutes.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
  });
});

app.use("/api/snailpay", snailPayRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});