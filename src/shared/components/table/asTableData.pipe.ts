import { Pipe, PipeTransform } from '@angular/core'
import { TableItem } from './table.model'
import { Observable, map } from 'rxjs'

@Pipe({
  name: 'asTableData',
  standalone: true,
})
export class AsTableDataPipe<T> implements PipeTransform {
  transform(obs: Observable<T[]>): Observable<TableItem<T>[]> {
    return obs.pipe(
      map(items => {
        return items.map(
          data =>
            ({
              data,
              isEditing: false,
            } as TableItem<T>)
        )
      })
    )
  }
}
