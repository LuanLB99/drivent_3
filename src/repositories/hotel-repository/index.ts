import { prisma } from "@/config";

async function findHotels() {
  return prisma.hotel.findMany({});
}

async function roomsAvaiable(hotelId: number) {
  return prisma.hotel.findFirst({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: true
    }
  });
}

const hotelRepository = {
  findHotels,
  roomsAvaiable
};

export default hotelRepository;
