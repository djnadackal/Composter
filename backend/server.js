import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth";
import cors from "cors";

const app = express();
const port = 3005;

app.use(
  cors({
    origin: process.env.CLIENT_URL, 
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
    credentials: true, 
  })
);

app.all("/api/auth/*", toNodeHandler(auth)); 
app.use(express.json());

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});