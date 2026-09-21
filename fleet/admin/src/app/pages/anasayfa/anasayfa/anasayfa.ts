import { Component, OnInit } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { BreadcrumpService } from 'src/app/core/services/breadcrump.service'

@Component({
  selector: 'app-anasayfa',
  templateUrl: './anasayfa.html'
})

export class anasayfaComponent implements OnInit {
  constructor(
    private titleService: Title,
    private bs: BreadcrumpService
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("Fleet Assist | Anasayfa")
    this.bs.change([])
  }

  breadCrumbItems = [{ label: 'Anasayfa' }]
}