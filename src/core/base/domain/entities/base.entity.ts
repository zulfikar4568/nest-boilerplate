export abstract class BaseCoreEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export abstract class BaseEntity extends BaseCoreEntity {
  name: string;
  description: string | null;
}
