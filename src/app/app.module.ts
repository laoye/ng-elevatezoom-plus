import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {EzPlusModule} from '../../projects/ng-elevatezoom-plus/src/lib/ez-plus.module';
// import {EzPlusModule} from 'ng-elevatezoom-plus';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    EzPlusModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
