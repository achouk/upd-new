import { Component, Input } from '@angular/core';

import { I18nService } from '@dua-upd/upd/i18n';
@Component({
  selector: 'upd-data-kpi-card',
  templateUrl: './data-kpi-card.component.html',
  styleUrls: ['./data-kpi-card.component.scss'],
})
export class DataKpiCardComponent {
  @Input() current: string | number = '';
  @Input() comparison = 0;
  @Input() date: Date | string = '';
  @Input() numUxTests = 0;
  @Input() title = '';
  @Input() tooltip = '';
  @Input() project = false;

  constructor(public i18n: I18nService) {}
}
