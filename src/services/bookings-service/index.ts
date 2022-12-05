import { forbiddenError, notFoundError, unauthorizedError } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import roomRepository from "@/repositories/room-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { TicketStatus } from "@prisma/client";

async function findBooking(userId: number) {
  const haveEnrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if(!haveEnrollment) {
    throw notFoundError();
  }
  const haveTicket = await ticketRepository.findTicketByEnrollmentId(haveEnrollment.id);
  if(!haveTicket) {
    throw notFoundError();
  }
  
  const ticketType = await ticketRepository.findTicketTypeById(haveTicket.ticketTypeId);
  if(haveTicket.status !== TicketStatus.PAID || ticketType.includesHotel !== true) {
    throw unauthorizedError();
  }

  const booking = await bookingRepository.findBookingByUserId(userId);
  if (!booking) {
    throw notFoundError();
  }

  return booking;
}

async function updateBooking(userId: number, roomId: number, bookingId: number) {
  const haveEnrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if(!haveEnrollment) {
    throw notFoundError();
  }

  const haveTicket = await ticketRepository.findTicketByEnrollmentId(haveEnrollment.id);
  if(!haveTicket) {
    throw forbiddenError();
  }

  const ticketType = await ticketRepository.findTicketTypeById(haveTicket.ticketTypeId);
  if(haveTicket.status !== TicketStatus.PAID || ticketType.includesHotel !== true || ticketType.isRemote !== false) {
    throw forbiddenError();
  }

  const book = await bookingRepository.findBookingById(Number(bookingId));
  if(book.userId !== userId) {
    throw forbiddenError();
  }

  const haveBooking = await bookingRepository.findBookingByUserId(userId);
  if(!haveBooking) {
    throw forbiddenError();
  }

  const room = await roomRepository.findRoom(roomId);
  if (!room) {
    throw notFoundError();
  }

  if(room.capacity === room.Booking.length) {
    throw forbiddenError();
  }

  const newBooking = await bookingRepository.updateBooking(room.id, Number(bookingId), userId);
  if(!newBooking) {
    throw forbiddenError();
  }
  
  return newBooking;
}

async function makeBooking(userId: number, roomId: number) {
  const haveEnrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if(!haveEnrollment) {
    throw notFoundError();
  }

  const haveTicket = await ticketRepository.findTicketByEnrollmentId(haveEnrollment.id);
  if(!haveTicket) {
    throw forbiddenError();
  }

  const ticketType = await ticketRepository.findTicketTypeById(haveTicket.ticketTypeId);
  if(haveTicket.status !== TicketStatus.PAID || ticketType.includesHotel !== true || ticketType.isRemote !== false) {
    throw forbiddenError();
  }

  const haveBooking = await bookingRepository.findBookingByUserId(userId);
  if(haveBooking) {
    throw forbiddenError();
  }

  const room = await roomRepository.findRoom(roomId);
  if (!room) {
    throw notFoundError();
  }

  if(room.capacity === room.Booking.length) {
    throw forbiddenError();
  }

  const newBooking = await bookingRepository.createBooking(room.id, userId);
  if(!newBooking) {
    throw forbiddenError();
  }
  
  return newBooking;
}

const bookingService = {
  findBooking,
  updateBooking,
  makeBooking
};

export default bookingService;
