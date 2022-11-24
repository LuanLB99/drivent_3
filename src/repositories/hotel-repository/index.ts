import { prisma } from "@/config";
import { Prisma } from "@prisma/client";

async function findHotels() {
  return prisma.hotel.findMany({});
}

async function roomsAvaiable(hotelId: number) {
  return prisma.room.findFirst({
    where: {
      hotelId: hotelId,
    }
  });
}

const hotelRepository = {
  findHotels,
  roomsAvaiable
};

export default hotelRepository;
