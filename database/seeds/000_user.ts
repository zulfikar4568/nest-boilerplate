import { Role } from '@prisma/client';
import { generatePassword } from '@/core/base/frameworks/shared/utils/password.util';
import { User } from '@/core/base/domain/entities/auth.entity';

type TSeedUser = {
  where: Partial<User>;
  update: Partial<User>;
  create: Partial<User>;
}[];

const users = async (): Promise<TSeedUser> => [
  {
    where: { username: 'admin' },
    update: {},
    create: {
      id: '9fc509dd-2cae-433e-b9ee-705d92c56d9c',
      name: 'Administrator',
      email: 'admin@company.com',
      phoneNumber: '(022) 877659762',
      username: 'admin',
      password: await generatePassword('admin'),
      description: 'Ini adalah user administrator',
      roles: [Role.ADMIN],
    },
  },
];

export default users();
