import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 50): string {
    // Si el valor es nulo o indefinido, devuelve un string vacío
    if (!value) return '';
    return value.length > limit ? value.substring(0, limit) + '...' : value;
  }
}
