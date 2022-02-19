import { db } from "~/utils/db.server";

export const getUser = async (id) => {
  return await db.user.findUnique({
    where: {
      id
    },
  });
}

