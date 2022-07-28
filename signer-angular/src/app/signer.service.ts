import {Injectable} from '@angular/core';
import {Signer} from '@waves/signer';
import {BehaviorSubject, catchError, filter, of, Subject, switchMap, tap} from "rxjs";
import {ProviderKeeper} from "@waves/provider-keeper";
import ProviderLedger from "@waves/provider-ledger";
import ProviderMetamask from "@waves/provider-metamask";
import {ProviderCloud} from "@waves.exchange/provider-cloud";
import {ProviderWeb} from "@waves.exchange/provider-web";
import ProviderSeed from "@waves/provider-seed";

export enum EAuthProvider {
  keeper,
  cloud,
  web,
  ledger,
  metamask,
  seed
}

export interface IUser {
  address: string
  publicKey: string
}

export interface ILoginEvent {
  type: 'login',
  provider: EAuthProvider
  seed: string | null
}

export interface ILogoutEvent {
  type: 'logout'
}

@Injectable({
  providedIn: 'root'
})
export class SignerService {

  signer: Signer;
  event$ = new BehaviorSubject<ILoginEvent | ILogoutEvent | null>(null);
  user$ = new BehaviorSubject<IUser | null>(null);

  eventSubscription$ = this.event$
    .pipe(
      tap(event => console.log('+++ tap event', event)),
      // @ts-ignore
      tap(() => {
        const user = this.user$.getValue()
        if (user) {
          this.signer.logout()
          this.user$.next(null)
        }
      }),
      // @ts-ignore
      filter((event: ILoginEvent | ILogoutEvent) => event?.type === 'login'),
      switchMap(async (event: ILoginEvent) => {
        const providerType = event.provider
        let provider = null
        switch (providerType) {
          case EAuthProvider.keeper:
            provider = new ProviderKeeper();
            break
          case EAuthProvider.ledger:
            provider = new ProviderLedger();
            break
          case EAuthProvider.metamask:
            provider = new ProviderMetamask()
            break
          case EAuthProvider.cloud:
            provider = new ProviderCloud()
            break
          case EAuthProvider.web:
            provider = new ProviderWeb()
            break
          case EAuthProvider.seed:
            provider = new ProviderSeed(event.seed || "")
            break
        }
        this.signer.setProvider(provider);
        return this.signer.login().then(e => e).catch(e => e)
      }),
      catchError((error) => {
        return of(error)
      })
    )
    .subscribe((data: IUser | null) => {
        if (data?.address) {
          this.user$.next(data)
        }
    })


  constructor() {
    this.signer = new Signer();
  }

  logout = () => {
    console.log("!!!")
    this.event$.next({type: 'logout'})
  }

  async login(providerType: EAuthProvider, seed: string | null = null) {
    console.log("!!!2")
    this.event$.next({type: 'login', provider: providerType, seed})
  }

  getBalance = async () => {
    const balances = await this.signer.getBalance();
    console.log("++++balances", balances)
  }

}
