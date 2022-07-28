import {Injectable} from '@angular/core';
import {Signer, UserData} from '@waves/signer';
import {BehaviorSubject, filter, map, Subject, switchMap, tap} from "rxjs";
import {ProviderKeeper} from "@waves/provider-keeper";

export enum EAuthProvider {
  ProviderKeeper,
  ProviderCloud,
  ProviderWeb,
  ProviderLedger,
  ProviderMetamask,
  ProviderSeed
}

export interface IUser {
  address: string
  publicKey: string
}

export interface ILoginEvent {
  type: 'login',
  provider: EAuthProvider
}

export interface ILogoutEvent {
  type: 'logout'
}

@Injectable({
  providedIn: 'root'
})
export class SignerService {

  signer: Signer;
  event$ = new Subject<ILoginEvent | ILogoutEvent>();

  user$ = new BehaviorSubject<IUser | null>(null);


  userSubject$ = this.event$
    .pipe(
      tap(() => {
        const user = this.user$.getValue()
        if (user) {
          this.signer.logout()
          this.user$.next(null)
        }
      }),
      // @ts-ignore
      filter((event: ILoginEvent | ILogoutEvent) => event.type === 'login'),
      switchMap((event: ILoginEvent) => {
        console.log("+++event", event)

        let result: Promise<UserData> | null = null
        const providerType = event.provider
        // switch (providerType) {
        //   case EAuthProvider.ProviderKeeper:
            const keeper = new ProviderKeeper();
            this.signer.setProvider(keeper);
            result = this.signer.login()
        //     break
        // }
        return result

        // switch (authType) {
        //   case EAuthType.ProviderKeeper:
        //     const keeper = new ProviderKeeper();
        //     this.signer.setProvider(keeper);
        //     const loginResult = await this.signer.login()
        //     console.log("+++login ProviderKeeper", loginResult)
        //     break
        //   case EAuthType.ProviderCloud:
        //     break
        //   case EAuthType.ProviderWeb:
        //     break
        //   case EAuthType.ProviderLedger:
        //     break
        //   case EAuthType.ProviderMetamask:
        //     break
        //   case EAuthType.ProviderSeed:
        //     break
        // }


      }),
    )
    .subscribe(event => {
    console.log("+++subscribe event", event)
    })


  constructor() {
    this.signer = new Signer();
  }

  logout = () => {
    this.event$.next({type: 'logout'})
  }

  async login(providerType: EAuthProvider) {

    this.event$.next({type: 'login', provider: providerType})

    // switch (authType) {
    //   case EAuthType.ProviderKeeper:
    //     const keeper = new ProviderKeeper();
    //     this.signer.setProvider(keeper);
    //     const loginResult = await this.signer.login()
    //     console.log("+++login ProviderKeeper", loginResult)
    //     break
    //   case EAuthType.ProviderCloud:
    //     break
    //   case EAuthType.ProviderWeb:
    //     break
    //   case EAuthType.ProviderLedger:
    //     break
    //   case EAuthType.ProviderMetamask:
    //     break
    //   case EAuthType.ProviderSeed:
    //     break
    // }
  }

  getBalance = async () => {
    const balances = await this.signer.getBalance();
    console.log("++++balances", balances)
  }

}
