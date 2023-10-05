import { UsePipes } from '@nestjs/common';
import ListQueryPipe from '../pipes/list-query.pipe';

interface ClassConstructor {
  new (...args: any[]): any;
}

export default function UseList(
  dto: ClassConstructor,
): MethodDecorator & ClassDecorator {
  return UsePipes(new ListQueryPipe(dto));
}
