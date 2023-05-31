import { Injectable } from '@angular/core'
import { State } from '@ngxs/store'

@State<unknown>({
  name: 'profile',
  defaults: {},
})
@Injectable()
export class ProfileState {}
