export abstract class IAuditServices<T> {
  abstract addHistoryAudit(data: T): Promise<boolean>;
}
