import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isInArray',
  standalone: true
})
export class IsInArrayPipe implements PipeTransform {

  transform<T>(value: T, arr: T[]): boolean {
    return arr.includes(value);
  }

}
