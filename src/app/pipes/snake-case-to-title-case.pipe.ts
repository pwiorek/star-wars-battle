import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'snakeCaseToTitleCase',
  standalone: true
})
export class SnakeCaseToTitleCasePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return value;

    const words = value.split('_');
    return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

}
