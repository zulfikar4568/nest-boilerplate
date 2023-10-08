import glob from 'glob';
import { PrismaClient } from '@prisma/client';
import logger from 'pino';
import prettyLogger from 'pino-pretty';

const log = logger(
  prettyLogger({
    colorize: true,
    translateTime: 'SYS:dd/mm/yyyy HH:MM:ss',
    ignore: 'pid,hostname',
  }),
);
const prisma = new PrismaClient();

(async function () {
  await prisma.$transaction(async (trx) => {
    log.info('start seeding ...');

    const seedFiles = glob.sync(`${__dirname}/**/*.ts`);
    const orderedSeedFiles = seedFiles.slice().sort();

    for await (const seedFile of orderedSeedFiles) {
      const fileNameWithExt = seedFile.split('/').slice().pop();
      const fileName = fileNameWithExt?.replace('.ts', '');

      if (
        fileNameWithExt &&
        fileName &&
        fileNameWithExt !== 'seed.ts' &&
        fileNameWithExt !== 'seed-prod.ts'
      ) {
        const path = seedFile.replace(__dirname, '.').replace('.ts', '');

        try {
          const seedData = await (await import(path)).default;

          log.info(`run seeding for ${fileName}`);

          await Promise.all(
            seedData.map(async (data: Record<string, any>) => {
              const modelName = fileName.split('_').slice().pop();

              if (modelName) {
                await trx[modelName].upsert(data);

                log.info(`success seed for ${fileName}`);
              }
            }),
          );
        } catch (error) {
          log.warn(`skipped seeding on ${fileName}, ${error}`);
        }
      }
    }
  });
})()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
