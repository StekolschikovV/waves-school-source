import { Component } from '@angular/core';
import {EAuthProvider, SignerService} from "./signer.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  EAuthType = EAuthProvider;

  constructor(public signerService:SignerService) {
  }

}
