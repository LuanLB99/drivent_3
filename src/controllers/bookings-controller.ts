import { AuthenticatedRequest } from "@/middlewares";
import bookingService from "@/services/bookings-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getMyBooking( req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const booking = await bookingService.findBooking(userId);
    return res.status(httpStatus.OK).send(booking);
  } catch (error) {
    if(error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function updateBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const  roomId  = req.body.roomId;
  const  bookingId  = Number(req.params.bookingId);
  if(roomId < 1 || !roomId) {
    res.sendStatus(httpStatus.BAD_REQUEST);
    return; 
  }
   
  try {
    const makeBooking = await bookingService.updateBooking(userId, roomId, bookingId);
    res.status(httpStatus.OK).send({ id: makeBooking.id });
    return;
  } catch (error) {
    if(error.name === "forbiddenError") {
      res.sendStatus(httpStatus.FORBIDDEN);
      return; 
    } 
    if(error.name === "NotFoundError") {
      res.sendStatus(httpStatus.NOT_FOUND);
      return;
    }
  }
}

export async function makeBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const  roomId  = req.body.roomId;
  if(roomId < 1 || !roomId) {
    res.sendStatus(httpStatus.BAD_REQUEST);
    return; 
  }
 
  try {
    const makeBooking = await bookingService.makeBooking(userId, roomId);
    res.status(httpStatus.OK)
      .send({ id: makeBooking.id });
    return;
  } catch (error) {
    if(error.name === "forbiddenError") {
      res.sendStatus(httpStatus.FORBIDDEN);
      return; 
    } 
    if(error.name === "NotFoundError") {
      res.sendStatus(httpStatus.NOT_FOUND);
      return;
    }
  }
}
