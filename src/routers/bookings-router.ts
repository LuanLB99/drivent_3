import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getMyBooking, updateBooking, makeBooking } from "@/controllers/bookings-controller";

const bookingsRouter = Router();

bookingsRouter
  .all("/*", authenticateToken)
  .get("", getMyBooking)
  .post("", makeBooking)
  .put("/:bookingId", updateBooking);

export { bookingsRouter };
