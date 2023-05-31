import { Injectable } from '@angular/core'
import { Amplify } from '@aws-amplify/core'
import { Auth } from '@aws-amplify/auth'
@Injectable({
  providedIn: 'root',
})
export class CognitoService {
  runLoginSequence(config: { cognito: unknown }) {
    Amplify.configure({
      Auth: config.cognito,
    })
  }

  signOut() {
    return Auth.signOut()
  }
}
