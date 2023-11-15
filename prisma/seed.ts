// prisma/seed.ts

import { faker } from '@faker-js/faker';
import { LoginType, PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  const SALT = 10;

  for (let i = 0; i < 500; i += 1) {
    const email = faker.internet.email();
    const nickname = faker.name.fullName();
    const loginType = LoginType.EMAIL;
    const password = await bcrypt.hash(faker.internet.password(), SALT);

    const user = await prisma.user.create({
      data: {
        loginType,
        email,
        nickname,
        password,
      },
    });

    console.log(user);

    const randomNumber = +faker.random.numeric(1);

    for (let j = 0; j < randomNumber; j += 1) {
      const title = faker.random.words(3);
      const description = faker.random.words(10);

      const post = await prisma.post.create({
        data: {
          userId: user.id,
          title,
          description,
        },
      });

      console.log(post);

      for (let j = 0; j < 10; j += 1) {
        const description = faker.random.words(10);

        const postComment = await prisma.postComment.create({
          data: {
            userId: user.id,
            postId: post.id,
            description,
          },
        });

        console.log(postComment);
      }
    }
  }
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
