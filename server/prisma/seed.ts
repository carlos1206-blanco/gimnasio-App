import "dotenv/config";
import prisma from "../src/db";
import { hashPassword } from "../src/utils/password";
import { Role, AchievementCriterio } from "../src/generated/prisma/enums";

async function seedAdmin() {
  const email = "admin@gimnasio.com";
  const passwordPlano = "Admin123!";

  const existente = await prisma.user.findUnique({ where: { email } });
  if (existente) {
    console.log(`El admin ${email} ya existe, no se creó de nuevo.`);
    return;
  }

  const passwordHash = await hashPassword(passwordPlano);

  await prisma.user.create({
    data: {
      email,
      passwordHash,
      nombre: "Admin",
      apellido: "Gimnasio",
      role: Role.ADMIN,
    },
  });

  console.log(`Admin creado -> email: ${email} | contraseña: ${passwordPlano}`);
  console.log("Cambia esta contraseña en cuanto tengas la pantalla de edición de usuarios.");
}

async function seedAchievements() {
  const catalogo = [
    {
      nombre: "Primeros pasos",
      descripcion: "Completa 5 ejercicios de tus rutinas asignadas.",
      criterio: AchievementCriterio.EJERCICIOS_COMPLETADOS,
      valorObjetivo: 5,
    },
    {
      nombre: "Constancia",
      descripcion: "Registra tu progreso (peso, medidas o marcas) 3 veces.",
      criterio: AchievementCriterio.REGISTROS_PROGRESO,
      valorObjetivo: 3,
    },
  ];

  for (const data of catalogo) {
    const existente = await prisma.achievement.findFirst({ where: { nombre: data.nombre } });
    if (existente) continue;
    await prisma.achievement.create({ data });
    console.log(`Logro creado: ${data.nombre}`);
  }
}

async function main() {
  await seedAdmin();
  await seedAchievements();
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
