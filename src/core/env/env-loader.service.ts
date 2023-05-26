import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { EnvConfig } from './env-config'

@Injectable()
export class EnvironmentLoaderService {
  private envConfig: EnvConfig

  constructor(private readonly http: HttpClient) {}

  loadConfig(): Observable<EnvConfig> {
    return this.http.get<EnvConfig>('../../assets/config/app-config.json', {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
        Pragma: 'no-cache',
        Expires: '0',
      },
    })
  }
}
