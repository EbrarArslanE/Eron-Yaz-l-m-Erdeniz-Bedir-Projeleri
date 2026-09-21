import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { kullaniciTanimlariComponent } from './kullaniciTanimlari/kullaniciTanimlari'
import { componentTanimlariComponent } from './componentTanimlari/componentTanimlari'

const routes: Routes = [
  {
    path: 'kullaniciTanimlari',
    component: kullaniciTanimlariComponent
  },
  {
    path: 'componentTanimlari',
    component: componentTanimlariComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class EWSRoutingModule { }
