import "dotenv/config";
import prisma from "../src/db";
import { hashPassword } from "../src/utils/password";
import { Role, AchievementCriterio } from "../src/generated/prisma/enums";

async function seedAdmin(): Promise<string> {
  const email = "admin@gimnasio.com";
  const passwordPlano = "Admin123!";

  const existente = await prisma.user.findUnique({ where: { email } });
  if (existente) {
    console.log(`El admin ${email} ya existe, no se creó de nuevo.`);
    return existente.id;
  }

  const passwordHash = await hashPassword(passwordPlano);

  const admin = await prisma.user.create({
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

  return admin.id;
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

async function seedExercises(adminId: string) {
  const catalogo = [
    {
      nombre: "Sentadilla con barra",
      grupoMuscular: "Piernas",
      descripcion:
        "Apoya la barra sobre la parte alta de la espalda (trapecio), no sobre el cuello. Pies al ancho de los hombros, puntas ligeramente hacia afuera. Baja llevando las caderas hacia atrás y abajo, manteniendo el pecho arriba y la espalda recta, hasta que los muslos queden paralelos al piso. Empuja con los talones para subir. No dejes que las rodillas se vayan hacia adentro.",
    },
    {
      nombre: "Press de banca",
      grupoMuscular: "Pecho",
      descripcion:
        "Acuéstate en el banco con los pies firmes en el piso. Agarra la barra un poco más ancho que los hombros. Baja la barra de forma controlada hasta rozar el pecho a la altura de las tetillas, con los codos en un ángulo de unos 45° respecto al torso (no completamente abiertos). Empuja hacia arriba sin rebotar la barra en el pecho. Usa siempre un ayudante o los seguros del rack al levantar peso alto.",
    },
    {
      nombre: "Peso muerto",
      grupoMuscular: "Espalda / Piernas",
      descripcion:
        "Pies al ancho de la cadera, barra pegada a las espinillas. Flexiona caderas y rodillas para tomar la barra con los brazos extendidos, espalda recta y pecho arriba. Levanta empujando el piso con los pies y extendiendo caderas y rodillas al mismo tiempo, manteniendo la barra pegada al cuerpo todo el recorrido. Evita redondear la zona lumbar.",
    },
    {
      nombre: "Press militar",
      grupoMuscular: "Hombros",
      descripcion:
        "De pie o sentado, agarra la barra o mancuernas a la altura de los hombros. Empuja hacia arriba en línea recta hasta extender los brazos por completo, sin arquear excesivamente la espalda. Baja de forma controlada hasta la posición inicial. Mantén el core firme durante todo el movimiento.",
    },
    {
      nombre: "Remo con barra",
      grupoMuscular: "Espalda",
      descripcion:
        "Inclina el torso hacia adelante unos 45°, rodillas ligeramente flexionadas, espalda recta. Toma la barra con agarre prono un poco más ancho que los hombros. Lleva la barra hacia el abdomen apretando los omóplatos, y baja de forma controlada. Evita usar impulso con la espalda baja.",
    },
    {
      nombre: "Curl de bíceps con mancuerna",
      grupoMuscular: "Brazos",
      descripcion:
        "De pie, mancuernas a los lados con los codos pegados al torso. Flexiona el codo llevando la mancuerna hacia el hombro sin mover el brazo desde el hombro ni balancear el cuerpo. Baja de forma controlada hasta extender el brazo por completo.",
    },
    {
      nombre: "Extensión de tríceps en polea",
      grupoMuscular: "Brazos",
      descripcion:
        "De pie frente a la polea alta, toma la barra o cuerda con los codos pegados al torso. Extiende los antebrazos hacia abajo hasta estirar completamente los brazos, sin mover los codos hacia adelante. Vuelve a la posición inicial de forma controlada.",
    },
    {
      nombre: "Prensa de piernas",
      grupoMuscular: "Piernas",
      descripcion:
        "Siéntate en la máquina con la espalda apoyada, pies al ancho de los hombros sobre la plataforma. Suelta los seguros y baja el peso flexionando las rodillas hasta unos 90°, sin despegar la zona lumbar del respaldo. Empuja con los talones para extender las piernas, sin bloquear completamente las rodillas al terminar.",
    },
  ];

  for (const data of catalogo) {
    const existente = await prisma.exercise.findFirst({ where: { nombre: data.nombre } });
    if (existente) {
      if (!existente.descripcion) {
        await prisma.exercise.update({
          where: { id: existente.id },
          data: { descripcion: data.descripcion, grupoMuscular: data.grupoMuscular },
        });
        console.log(`Instrucciones agregadas a ejercicio existente: ${data.nombre}`);
      }
      continue;
    }
    await prisma.exercise.create({ data: { ...data, creadoPorId: adminId } });
    console.log(`Ejercicio creado: ${data.nombre}`);
  }
}

async function main() {
  const adminId = await seedAdmin();
  await seedAchievements();
  await seedExercises(adminId);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
