import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap'
import { EWSRoutingModule } from './EWS-routing'
import { TabsModule } from 'ngx-bootstrap/tabs'
import { FormDirective } from './EWS-directive'
import { TranslateModule } from '@ngx-translate/core'
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask'
import { CKEditorModule } from '@ckeditor/ckeditor5-angular'
import { DragDropModule } from '@angular/cdk/drag-drop'
import { AgGridModule } from 'ag-grid-angular'
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
import { NgSelectModule } from '@ng-select/ng-select'
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { AccordionModule } from 'ngx-bootstrap/accordion';


ModuleRegistry.registerModules([AllCommunityModule])


import { kullaniciTanimlariComponent } from './kullaniciTanimlari/kullaniciTanimlari'
import { componentTanimlariComponent } from './componentTanimlari/componentTanimlari'

@NgModule({
  imports: [
    CommonModule,
    AccordionModule,
    FormsModule,
    ReactiveFormsModule,
    EWSRoutingModule,
    TabsModule.forRoot(),
    NgbPaginationModule,
    NgbModule,
    TranslateModule,
    NgxMaskDirective,
    NgxMaskPipe,
    DragDropModule,
    AgGridModule,
    LeafletModule,
    NgSelectModule,
    CKEditorModule
  ],
  declarations: [
    kullaniciTanimlariComponent,
    componentTanimlariComponent,
    FormDirective
  ],
  providers: [
    provideNgxMask()
  ]
})

export class EWSModule { }
