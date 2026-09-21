import { Component, OnInit } from '@angular/core';

import { EventService } from '../../core/services/event.service';

import { LAYOUT_VERTICAL, LAYOUT_HORIZONTAL } from './layouts.model';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  // layout related config
  layoutType: string;

  constructor(private eventService: EventService) { }

  ngOnInit() {
    // default settings
    document.body.setAttribute('data-bs-theme', 'light');
    let typeStorage = localStorage.getItem("maviLayoutType")
    if (typeStorage){
      this.layoutType = typeStorage;
    } else {
      this.layoutType = LAYOUT_HORIZONTAL;
    }
    // listen to event and change the layout, theme, etc
    this.eventService.subscribe('changeLayout', (layout) => {
      localStorage.setItem("maviLayoutType", layout)
      this.layoutType = layout;
    });
  }

  /**
   * Check if the vertical layout is requested
   */
  isVerticalLayoutRequested() {
    return this.layoutType === LAYOUT_VERTICAL;
  }

  /**
   * Check if the horizontal layout is requested
   */
  isHorizontalLayoutRequested() {
    return this.layoutType === LAYOUT_HORIZONTAL;
  }
}
