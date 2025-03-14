import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 50): string {
    if (!value) return ''; // Si el valor es nulo o indefinido, devuelve un string vacío
    return value.length > limit ? value.substring(0, limit) + '...' : value;
  }
}
