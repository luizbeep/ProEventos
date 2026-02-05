import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'DateTimeFormatPipe',
  standalone: true
})
export class DateTimeFormatPipe implements PipeTransform {

  private datePipe = new DatePipe('pt-BR');

  transform(value: string | number | Date | null | undefined): string {
    if (!value) return '-';

    let date: Date;

    if (value instanceof Date) {
      date = value;
    } else if (typeof value === 'number') {
      date = new Date(value);
    } else if (typeof value === 'string') {
      // Tenta parse ISO (2026-01-15T19:50:02.895)
      date = new Date(value);

      if (isNaN(date.getTime())) {
        // Se falhar, tenta dd/MM/yyyy HH:mm:ss (ou variantes com milissegundos)
        const regex = /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})/;
        const match = value.match(regex);

        if (match) {
          const [_, day, month, year, hour, minute, second] = match;
          date = new Date(
            Number(year),
            Number(month) - 1,
            Number(day),
            Number(hour),
            Number(minute),
            Number(second)
          );
        }
      }
    } else {
      return '-';
    }

    if (isNaN(date.getTime())) return '-';

    return this.datePipe.transform(date, 'dd/MM/yyyy HH:mm') ?? '-';
  }
}
