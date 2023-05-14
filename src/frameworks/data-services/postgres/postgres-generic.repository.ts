import { IGenericRepository } from 'src/core/abstracts';
import { IPostgresGenericModel } from './model/postgres-generic.model';

export class PostgresGenericRepository<T> implements IGenericRepository<T> {
  private _repository: IPostgresGenericModel<T>;

  constructor(repository: IPostgresGenericModel<T>) {
    this._repository = repository;
  }

  getAll(): Promise<T[]> {
    return this._repository.findAll();
  }
  get(id: string): Promise<T> {
    return this._repository.findById(id);
  }
  create(item: T): Promise<T> {
    return this._repository.create(item);
  }
  update(id: string, item: T): Promise<T> {
    return this._repository.update(id, item);
  }
}
