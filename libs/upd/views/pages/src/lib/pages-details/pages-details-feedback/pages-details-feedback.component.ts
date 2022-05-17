import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { PagesDetailsFacade } from '../+state/pages-details.facade';

import { ColumnConfig } from '@cra-arc/upd-components';
import { I18nFacade } from '@cra-arc/upd/state';
import { GetTableProps } from '@cra-arc/utils-common';

type FeedbackCommentsColType = GetTableProps<PagesDetailsFeedbackComponent, 'feedbackComments$'>
type FeedbackByTagsColTypes = GetTableProps<PagesDetailsFeedbackComponent, 'feedbackByTagsTable$'>

@Component({
  selector: 'app-page-details-feedback',
  templateUrl: './pages-details-feedback.component.html',
  styleUrls: ['./pages-details-feedback.component.css'],
})
export class PagesDetailsFeedbackComponent implements OnInit {
  currentLang$ = this.i18n.currentLang$;

  dyfChart$ = this.pageDetailsService.dyfData$;
  whatWasWrongChart$ = this.pageDetailsService.whatWasWrongData$;

  dyfTableCols: ColumnConfig<{ name: string; value: number; }>[] = [];
  whatWasWrongTableCols: ColumnConfig<{ name: string; value: number; }>[] = [];

  feedbackByTagsBarChartData$ = this.pageDetailsService.feedbackByTagsBarChart$;

  feedbackComments$ = this.pageDetailsService.feedbackComments$;
  feedbackCommentsCols: ColumnConfig<FeedbackCommentsColType>[] = [];

  feedbackByTagsTable$ = this.pageDetailsService.feedbackByTagsTable$;
  feedbackByTagsTableCols: ColumnConfig<FeedbackByTagsColTypes>[] = [];

  dateRangeLabel$ = this.pageDetailsService.dateRangeLabel$;
  comparisonDateRangeLabel$ = this.pageDetailsService.comparisonDateRangeLabel$;

  constructor(
    private pageDetailsService: PagesDetailsFacade,
    private i18n: I18nFacade
  ) {}

  ngOnInit() {
    combineLatest([
      this.dateRangeLabel$,
      this.comparisonDateRangeLabel$,
      this.currentLang$,
    ]).subscribe(([dateRange, comparisonDateRange, lang]) => {
      this.dyfTableCols = [
        {
          field: 'name',
          header: this.i18n.service.translate('Selection', lang),
        },
        {
          field: 'value',
          header: this.i18n.service.translate('visits', lang),
          pipe: 'number',
        },
      ];
      this.whatWasWrongTableCols = [
        { field: 'name', header: this.i18n.service.translate('d3-www', lang) },
        {
          field: 'value',
          header: this.i18n.service.translate('visits', lang),
          pipe: 'number',
        },
      ];

      this.feedbackCommentsCols = [
        { field: 'date', header: this.i18n.service.translate('date', lang), pipe: 'date' },
        { field: 'tag', header: this.i18n.service.translate('tags', lang) },
        { field: 'whats_wrong', header: this.i18n.service.translate('d3-www', lang) },
        { field: 'comment', header: this.i18n.service.translate('comment', lang) },
      ];

      this.feedbackByTagsTableCols = [
        { field: 'tag', header: this.i18n.service.translate('category', lang) },
        {
          field: 'currValue',
          header: this.i18n.service.translate('# of comments for ', lang, {
            value: dateRange,
          }),
          pipe: 'number',
        },
        {
          field: 'prevValue',
          header: this.i18n.service.translate('# of comments for ', lang, {
            value: comparisonDateRange,
          }),
          pipe: 'number',
        },
      ];
    });
  }
}
