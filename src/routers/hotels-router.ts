import { Router } from "express";
import { getHotelsAvaiable, getRoom } from "@/controllers/hotels-controller";
import { authenticateToken } from "@/middlewares";

const hotelsRouter = Router();

hotelsRouter
  .all("/*", authenticateToken)
  .get("", authenticateToken, getHotelsAvaiable)
  .get("/:hotelId", authenticateToken, getRoom);
export { hotelsRouter };
