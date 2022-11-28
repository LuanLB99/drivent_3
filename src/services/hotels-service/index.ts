import { notFoundError, unauthorizedError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelRepository from "@/repositories/hotel-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { TicketStatus } from "@prisma/client";

async function getHotels(userId: number) {
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

  const hotels = await hotelRepository.findHotels();
  if (!hotels) {
    throw notFoundError();
  }
  return hotels;
}

async function getRoomsAvaiable(userId: number, hotelId: string) {
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

  const rooms = await hotelRepository.roomsAvaiable(Number(hotelId));
  if (!rooms) {
    throw notFoundError();
  }
  return rooms;
}

const hotelService = {
  getHotels,
  getRoomsAvaiable
};

export default hotelService;
