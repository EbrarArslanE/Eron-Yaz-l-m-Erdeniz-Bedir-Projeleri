import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgModule } from '@angular/core'
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http'
import { FormsModule } from '@angular/forms'
import { BreadcrumpService } from './core/services/breadcrump.service'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { ToastrModule } from 'ngx-toastr'
import { NgxMaskPipe, NgxMaskDirective, provideNgxMask } from 'ngx-mask'
import { LayoutsModule } from './layouts/layouts.module'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { DatePipe } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { AccordionModule } from 'ngx-bootstrap/accordion';



export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json')
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgbPaginationModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    LayoutsModule,
    NgxMaskDirective,
    NgxMaskPipe,
    FormsModule,
    AccordionModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    ToastrModule.forRoot()
  ],
  providers: [
    provideNgxMask(),
    BreadcrumpService,
    [DatePipe]
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
