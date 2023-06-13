/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @angular-eslint/directive-selector */
/* eslint-disable @angular-eslint/directive-class-suffix */
import { NgClass } from '@angular/common'
import {
  Attribute,
  ComponentRef,
  Directive,
  DoCheck,
  Injector,
  Input,
  KeyValueChanges,
  KeyValueDiffer,
  KeyValueDiffers,
  NgModuleRef,
  Renderer2,
  TemplateRef,
  Type,
  ViewContainerRef,
  createNgModule,
} from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { Observable, from, map } from 'rxjs'
import { LazyService } from './lazy.service'

export type LazyConfig<T> = {
  inputs?: { [key in keyof T]?: T[key] }
  outputs?: OutputsType<T>
  class?: NgClass['ngClass']
  injector?: Injector
  ngModule?: Type<unknown>
  init?: (cmp: T) => void
}

type Unpack<T> = T extends Observable<infer U> ? U : never

type Outputs<T> = {
  [key in keyof T as T[key] extends Observable<unknown> ? key : never]?: (value: Unpack<T[key]>) => void
}

export type OutputsType<T> = {
  [key in keyof Outputs<T>]: Outputs<T>[key]
} & {}

@Directive({ selector: '[lazy]', standalone: true })
export class OxaLazy<T extends object, C> implements DoCheck {
  @Input('lazy') lazyConfig: LazyConfig<T> | null = null

  private inputsDiffer: KeyValueDiffer<keyof T, T[keyof T]>

  private componentRef: ComponentRef<T>

  private ngClassInstance: NgClass

  constructor(
    @Attribute('component') private component: string,
    private vcr: ViewContainerRef,
    private templateRef: TemplateRef<C>,
    private differs: KeyValueDiffers,
    private lazyService: LazyService,
    private renderer: Renderer2
  ) {
    this.inputsDiffer = this.differs.find({}).create()

    from(this.lazyService.getObject(this.component))
      .pipe(
        map(cmp => {
          const comp = fulfillComponent(cmp, this.lazyConfig ?? {}, this.vcr, this.templateRef)
          comp.changeDetectorRef.markForCheck()
          ;(this.lazyConfig as LazyConfig<T>)?.init?.(comp.instance)

          return comp
        })
      )
      .pipe(takeUntilDestroyed())
      .subscribe(c => {
        this.componentRef = c
        if ((this.lazyConfig as LazyConfig<T>)?.class) {
          this.ngClassInstance = new NgClass(null as any, null as any, this.componentRef.location, this.renderer)
          this.ngClassInstance.ngClass = (this.lazyConfig as LazyConfig<T>).class
        }
      })
  }

  ngDoCheck(): void {
    const changes = this.inputsDiffer.diff((this.lazyConfig as LazyConfig<T>)?.inputs as any)
    if (changes && this.componentRef) {
      applyChanges(this.componentRef, changes)
      this.componentRef.changeDetectorRef.markForCheck()
    }
    this.ngClassInstance?.ngDoCheck()
  }
}

function getParentInjector(injector: Injector): Injector {
  const parentNgModule = injector.get(NgModuleRef)
  return parentNgModule.injector
}

function applyChanges<T>(ref: ComponentRef<T>, changes: KeyValueChanges<keyof T, T[keyof T]>) {
  changes?.forEachItem(change => {
    ref.setInput(change.key as string, change.currentValue)
  })
}

function resolveModuleRef<T>(injector: Injector, ngModule: Type<T>) {
  return ngModule ? createNgModule(ngModule, getParentInjector(injector)) : undefined
}

function renderProjectedContent<C>(vcr: ViewContainerRef, templateRef: TemplateRef<C>) {
  const content = vcr.createEmbeddedView(templateRef, null, { index: 0 })
  content.detach()
  content.detectChanges()
  content.reattach()
  return content
}

function applyInputs<T>(componentRef: ComponentRef<T>, inputs: { [key in keyof T]?: T[key] }, outputs: OutputsType<T>) {
  Object.entries(inputs ?? {}).forEach(([key, entry]) => {
    if (key) {
      componentRef.setInput(key, entry)
    }
  })

  Object.keys(outputs ?? {}).forEach(p => {
    if (componentRef.instance[p as keyof T]) {
      ;(componentRef.instance[p as keyof T] as Observable<T[keyof T]>).subscribe(event => {
        return outputs[p as keyof Outputs<T>]?.(event as any)
      })
    } else {
      ;(componentRef.location.nativeElement as HTMLElement).addEventListener(p, event =>
        outputs[p as keyof Outputs<T>]?.(event as any)
      )
    }
  })

  return componentRef
}

function createComponent<T, C>(
  cmp: Type<T>,
  vcr: ViewContainerRef,
  injector: Injector,
  ngModule: Type<unknown>,
  templateRef: TemplateRef<C>
) {
  vcr.clear()
  const moduleRef = resolveModuleRef(injector ?? vcr.injector, ngModule)

  const content = renderProjectedContent(vcr, templateRef)
  content.markForCheck()

  const componentRef = vcr.createComponent(cmp, {
    index: vcr.length,
    injector: injector ?? vcr.injector,
    projectableNodes: [content.rootNodes],
    ngModuleRef: moduleRef,
  })

  return componentRef
}

function fulfillComponent<T, C>(
  cmp: Type<T>,
  config: LazyConfig<T>,
  vcr: ViewContainerRef,
  templateRef: TemplateRef<C>
) {
  const ref = createComponent(cmp, vcr, config.injector!, config.ngModule!, templateRef)
  return applyInputs(ref, config.inputs!, config.outputs!)
}
