import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiQuery, getSchemaPath } from '@nestjs/swagger';

/**
 * Combines Swagger Decorators to create a description for `filters[name]=something`
 *  - has support for swagger
 *  - automatic transformation with nestjs
 */

interface ClassConstructor {
  new (...args: any[]): any;
}

export function ApiFilterQuery(fieldName: string, filterDto: ClassConstructor) {
  return applyDecorators(
    ApiExtraModels(filterDto),
    ApiQuery({
      required: false,
      name: fieldName,
      style: 'deepObject',
      explode: false,
      type: 'object',
      description: `Example: http://your_host:your_port/your_route?filters[pagination][limit]=2&filters[pagination][page]=1&filters[sort][by]=createdAt&filters[sort][mode]=asc&filters[field][name][contains]=something about name </br> </br>
         You can filter more than this, please refer to this https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#filter-conditions-and-operators`,
      schema: {
        $ref: getSchemaPath(filterDto),
      },
    }),
  );
}
