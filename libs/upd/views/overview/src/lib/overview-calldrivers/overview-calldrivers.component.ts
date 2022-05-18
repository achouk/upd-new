import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { ColumnConfig } from '@dua-upd/upd-components';
import { I18nFacade } from '@dua-upd/upd/state';
import { LocaleId } from '@dua-upd/upd/i18n';
import { OverviewFacade } from '../+state/overview/overview.facade';

@Component({
  selector: 'upd-overview-calldrivers',
  templateUrl: './overview-calldrivers.component.html',
  styleUrls: ['./overview-calldrivers.component.css'],
})
export class OverviewCalldriversComponent implements OnInit {
  currentLang!: LocaleId;
  currentLang$ = this.i18n.currentLang$;

  charts = [
    {
      Topic: 'Electronic Services',
      'Number of calls for Feb 27-Mar 05': '72,740',
      'Number of calls for Mar 06-Mar 12': '68,306',
    },
    {
      Topic: 'COVID-19',
      'Number of calls for Feb 27-Mar 05': '43,549',
      'Number of calls for Mar 06-Mar 12': '52,792',
    },
    {
      Topic: 'Account Maintenance',
      'Number of calls for Feb 27-Mar 05': '38,342',
      'Number of calls for Mar 06-Mar 12': '41,206',
    },
    {
      Topic: 'Print requests',
      'Number of calls for Feb 27-Mar 05': '27,230',
      'Number of calls for Mar 06-Mar 12': '26,128',
    },
    {
      Topic: 'Payments to the CRA',
      'Number of calls for Feb 27-Mar 05': '20,663',
      'Number of calls for Mar 06-Mar 12': '22,806',
    },
  ];

  dateRangeLabel$ = this.overviewService.dateRangeLabel$;
  comparisonDateRangeLabel$ = this.overviewService.comparisonDateRangeLabel$;

  constructor(
    private overviewService: OverviewFacade,
    private i18n: I18nFacade
  ) {}

  calldriversChart$ = this.overviewService.calldriversChart$;
  calldriversTable$ = this.overviewService.calldriversTable$;
  calldriversCols: ColumnConfig<{ name: string; currValue: number; prevValue: number }>[] = [];
  chartsCols: ColumnConfig[] = [];

  ngOnInit() {
    this.i18n.service.onLangChange(
      ({ lang }) => { this.currentLang = lang as LocaleId; }
    );

    combineLatest([this.currentLang$, this.dateRangeLabel$, this.comparisonDateRangeLabel$]).subscribe(([lang, dateRange, comparisonDateRange]) => {
      this.chartsCols = [
        { field: 'Topic', header: this.i18n.service.translate('topic', lang) },
        {
          field: this.i18n.service.translate('Number of calls for', lang, {value: ' Feb 27-Mar 05'}),
          header: this.i18n.service.translate('Number of calls for', lang, {value: ' Feb 27-Mar 05'})
        },
        {
          field: this.i18n.service.translate('Number of calls for', lang, {value: ' Mar 06-Mar 12'}),
          header: this.i18n.service.translate('Number of calls for', lang, {value: ' Mar 06-Mar 12'})
        },
      ];
      this.calldriversCols = [
        { field: 'name', header: this.i18n.service.translate('Inquiry line', lang) },
        {
          field: 'currValue',
          header: dateRange,
          pipe: 'number',
        },
        {
          field: 'prevValue',
          header: comparisonDateRange,
          pipe: 'number',
        },
      ];
    });
  }

}
