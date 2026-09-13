import { prisma } from "@/lib/prisma";

const getCategory = async () => {
  const categories = await prisma.category.findMany();
  return categories;
};

export { getCategory };
