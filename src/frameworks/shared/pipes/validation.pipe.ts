import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { BadRequestException } from '../exceptions/common.exception';

interface ClassConstructor {
  new (...args: any[]): any;
}

@Injectable()
export default class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype, type }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    if (type === 'param' && Object.keys(value).includes('id')) {
      value.id = value.id; // Doing Some convert ID in here!
    }

    const object = plainToInstance(metatype, value);
    const errors = await validate(object);

    const customErrors = errors.map((err) => ({
      field: err.property,
      value: err.value,
      errors: err.constraints,
    }));

    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Validation failed!',
        params: customErrors,
      });
    }
    return value;
  }

  private toValidate(metatype: ClassConstructor): boolean {
    const types: ClassConstructor[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
