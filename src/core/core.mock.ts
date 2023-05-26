import { InjectionToken, Type } from '@angular/core'

type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T

export type Mockify<T> = DeepPartial<T>

export interface MockProvider<T> {
  provide: Type<T> | InjectionToken<T>
  useValue: Mockify<T>
}
