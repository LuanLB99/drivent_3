import { prisma } from "@/config";

async function findRoom(roomId: number) {
  return prisma.room.findFirst({
    where: {
      id: roomId
    },
    include: {
      Booking: true
    }
  });
}

const roomRepository = {
  findRoom,
};

export default roomRepository;
