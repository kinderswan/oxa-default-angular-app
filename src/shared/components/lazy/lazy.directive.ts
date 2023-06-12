import {
  ComponentRef,
  Directive,
  DoCheck,
  Injector,
  Input,
  KeyValueChanges,
  KeyValueDiffer,
  KeyValueDiffers,
  NgModuleRef,
  OnInit,
  TemplateRef,
  Type,
  ViewContainerRef,
  createNgModule,
  Attribute,
} from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { Observable, ReplaySubject, distinctUntilChanged, from, map, switchMap, tap } from 'rxjs'
import { LazyService } from './lazy.service'

@Directive({ selector: '[lazy]', standalone: true })
export class OxaLazy<T extends object> implements OnInit, DoCheck {
  @Input('lazy') loadName: string

  @Input('lazyInputs') inputs: { [key in keyof T]?: T[key] }

  @Input('lazyOutputs') outputs: { [key in string]?: (...args: any[]) => void }

  @Input('lazyParent') parent: boolean

  @Input('lazyInjector') injector: Injector

  @Input('lazyNgModule') ngModule: Type<any>

  @Input('lazyInit') init: (cmp: T) => void

  private differ: KeyValueDiffer<keyof T, T[keyof T]>
  private onInit$ = new ReplaySubject<void>()
  private doCheck$ = new ReplaySubject<void>()

  constructor(
    // @Attribute('testProp') private testProp: string,
    private vcr: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private differs: KeyValueDiffers,
    private lazyService: LazyService
  ) {
    this.differ = this.differs.find({}).create()

    this.onInit$
      .pipe(switchMap(() => from(this.lazyService.getObject(this.loadName))))
      .pipe(
        map(cmp => {
          const ref = createComponent(cmp, this.vcr, this.injector, this.ngModule, this.templateRef)
          return applyInputs(ref, this.inputs, this.outputs)
        }),
        switchMap(ref => this.doCheck$.pipe(map(() => ref)))
      )
      .pipe(
        tap(ref => {
          const changes = this.differ.diff(this.inputs as any)
          if (changes && ref) {
            updateComponentIO<T>(this.parent, ref, changes, vcr)
          }
        }),
        map(ref => ref.instance)
      )
      .pipe(distinctUntilChanged(), takeUntilDestroyed())
      .subscribe(cmp => this.init?.(cmp))
  }

  ngDoCheck(): void {
    this.doCheck$.next()
  }

  ngOnInit(): void {
    this.onInit$.next()
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

function updateComponentIO<T>(parent: boolean, ref: ComponentRef<T>, changes: any, vcr: ViewContainerRef) {
  if (parent) {
    applyChanges(ref, changes)
    ref.changeDetectorRef.markForCheck()
  } else {
    const detached = vcr.detach()
    applyChanges(ref, changes)
    vcr.insert(detached!)
  }
}

function resolveModuleRef(injector: Injector, ngModule: Type<any>) {
  return ngModule ? createNgModule(ngModule, getParentInjector(injector)) : undefined
}

function renderProjectedContent(vcr: ViewContainerRef, templateRef: TemplateRef<any>) {
  const content = vcr.createEmbeddedView(templateRef)

  return content
}

function applyInputs<T>(
  componentRef: ComponentRef<T>,
  inputs: { [key in keyof T]?: T[key] },
  outputs: { [key in string]?: (...args: any[]) => void }
) {
  Object.entries(inputs ?? {}).forEach(([key, entry]) => {
    if (key) {
      componentRef.setInput(key, entry)
    }
  })

  Object.keys(outputs ?? {})
    .filter(p => componentRef.instance[p as keyof T])
    .forEach(p =>
      (componentRef.instance[p as keyof T] as Observable<unknown>).subscribe(event => {
        componentRef.changeDetectorRef.markForCheck()
        return outputs[p as keyof T]?.(event)
      })
    )
  return componentRef
}

function createComponent<T>(
  cmp: Type<T>,
  vcr: ViewContainerRef,
  injector: Injector,
  ngModule: Type<any>,
  templateRef: TemplateRef<any>
) {
  vcr.clear()
  let moduleRef = resolveModuleRef(injector ?? vcr.injector, ngModule)

  const content = renderProjectedContent(vcr, templateRef)

  const componentRef = vcr.createComponent(cmp, {
    index: vcr.length,
    injector: injector ?? vcr.injector,
    projectableNodes: [content.rootNodes],
    ngModuleRef: moduleRef,
  })

  return componentRef
}
