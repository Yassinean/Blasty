import { Pipe, type PipeTransform } from "@angular/core"

@Pipe({
  name: "filter",
  standalone: true,
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], id: any, idField: string): any[] {
    if (!items || !id) {
      return []
    }

    return items.filter((item) => item[idField] === id)
  }
}

