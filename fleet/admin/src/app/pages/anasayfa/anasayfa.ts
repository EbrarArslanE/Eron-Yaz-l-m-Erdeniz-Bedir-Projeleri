import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { anasayfaRoutingModule } from './anasayfa-routing'
import { anasayfaComponent } from './anasayfa/anasayfa'
import { UiModule } from 'src/app/shared/ui/ui.module'
import { ChartComponent } from 'src/app/chart/chart.component'

@NgModule({
  imports: [
    CommonModule,
    anasayfaRoutingModule,
    UiModule
  ],
  declarations: [
    anasayfaComponent,
    ChartComponent
  ]
})

export class anasayfaModule { }