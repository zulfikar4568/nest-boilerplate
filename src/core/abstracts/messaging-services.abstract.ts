export abstract class IMessagingServices<T> {
  abstract sendAudit(data: T): Promise<boolean>;
}
