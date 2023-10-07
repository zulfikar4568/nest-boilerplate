import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

const Authorization = (...permissions: Role[]) => {
  return SetMetadata('authorization', permissions);
};

export default Authorization;
