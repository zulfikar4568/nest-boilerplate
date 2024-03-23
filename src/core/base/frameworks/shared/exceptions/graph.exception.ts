import { BadRequestException } from './common.exception';

export enum EGraphErrorCode {
  GRAPH_CYCLIC = 'G400',
}

export class CyclicException extends BadRequestException {
  constructor(params: { message: string }) {
    super({
      message: `It\'s not possible, it will cause circular reference!`,
      code: EGraphErrorCode.GRAPH_CYCLIC,
      params,
    });
  }
}
