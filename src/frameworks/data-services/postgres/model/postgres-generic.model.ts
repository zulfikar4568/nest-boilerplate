export class IPostgresGenericModel<T> {
  findAll(): Promise<T[]> {
    throw new Error('Method not implemented.');
  }
  findById(id: string): Promise<T> {
    console.log(id);
    throw new Error('Method not implemented.');
  }
  create(item: T): Promise<T> {
    console.log(item);
    throw new Error('Method not implemented.');
  }
  update(id: string, item: T): Promise<T> {
    console.log(id, item);
    throw new Error('Method not implemented.');
  }
}
