import { ArgumentMetadata, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { BadRequestException } from '../exceptions/common.exception';

interface ClassConstructor {
  new (...args: any[]): any;
}

@Injectable()
export default class ListQueryPipe {
  constructor(private dto: ClassConstructor) {}

  public async transform(value: any, metadata: ArgumentMetadata) {
    if (
      metadata.type !== 'custom' ||
      !this.needValidate(value, metadata.metatype) ||
      !Object.keys(value.params.query?.filters.field || {}).length
    ) {
      return value;
    }

    // Transform Query Format
    const convertQuery = plainToClass(this.dto, value.params.query);

    // Validate Query Format
    const errors = await validate(convertQuery);

    const customErrors = errors.map((err) => ({
      field: err.property,
      value: err.value,
      errors: err.toString() + '\n' + err.constraints,
    }));

    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Validation failed!',
        params: customErrors,
      });
    }

    // Reassign Query
    value.params.query = convertQuery;

    return value;
  }

  private needValidate(value: any, metatype: any): boolean {
    const types = [Object];
    const ctxParamsProps = ['params', 'body', 'query'];

    const isCtx =
      value.params &&
      Object.keys(value.params).length === 3 &&
      Object.keys(value.params).every((prop) => ctxParamsProps.includes(prop));

    const isCtxParams =
      value &&
      Object.keys(value).length === 3 &&
      Object.keys(value).every((prop) => ctxParamsProps.includes(prop));

    return types.includes(metatype) && value && (isCtx || isCtxParams);
  }
}
