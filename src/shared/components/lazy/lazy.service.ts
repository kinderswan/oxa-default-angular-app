import { Injectable, Type, forwardRef } from '@angular/core'

export const lazyServiceFactoryProvider = (registration: Record<string, () => Promise<Type<any>>>) => {
  return {
    provide: LazyService,
    useFactory: forwardRef(() => new LazyService().registerQueries(registration)),
  }
}

let lazyServiceInstance: LazyService

@Injectable()
export class LazyService {
  private registers: Map<string, Type<any>> = new Map()

  private queryRegisters: Map<string, () => Promise<Type<any>>> = new Map()

  constructor() {
    if (!lazyServiceInstance) {
      lazyServiceInstance = this
    }
    return lazyServiceInstance
  }

  registerQueries(loaders: Record<string, () => Promise<Type<any>>>) {
    Object.entries(loaders).forEach(([name, query]) => {
      if (this.queryRegisters.has('name')) {
        throw new Error(`Lazy item ${name} is already registered`)
      }
      this.queryRegisters.set(name, query)
    })
    return this
  }

  async getObject(name: string) {
    if (this.registers.has(name)) {
      return Promise.resolve(this.registers.get(name)!)
    }

    const value = await this.queryRegisters.get(name)!()
    this.registers.set(name, value)
    return value
  }
}
