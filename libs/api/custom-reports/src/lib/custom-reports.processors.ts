import { DbService } from '@dua-upd/db';
import { ReportConfig } from '@dua-upd/types-common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { AdobeAnalyticsClient } from './clients/adobe-analytics.client';
import { createQuery } from './clients/adobe-analytics.query';
import { CustomReportsCache } from './custom-reports.cache';
import { ChildJobMetadata } from './custom-reports.service';
import { processResults } from './custom-reports.strategies';

type ReportCreationMetadata = {
  id: string;
  config: ReportConfig;
  hash: string;
};

/**
 * Top-level processor for the `prepareReportData` queue.
 * This processor has as dependencies all sub-tasks needed
 * to prepare the data for the report.
 */
@Processor('prepareReportData')
export class PrepareReportDataProcessor extends WorkerHost {
  constructor(
    private db: DbService,
    private cache: CustomReportsCache,
  ) {
    super();
  }

  async process(job: Job<ReportCreationMetadata, void, string>) {
    try {
      const report = await this.db.collections.customReportsMetrics.getReport(
        job.data.config,
      );

      if (report.length) {
        await this.cache.setReport(job.data.id, report);
      }

      return report;
    } catch (err) {
      console.error('jobId: ', job.id);
      console.error((<Error>err).stack);
      throw err;
    }
  }
}

/**
 * Sub-level processor for the `fetchAndProcessReportData` queue.
 * Fetches and parses data from a datasource, and writes it to the db.
 */
@Processor('fetchAndProcessReportData', {
  concurrency: 1000,
  maxStalledCount: 0,
  lockDuration: 600 * 1000,
  skipStalledCheck: true,
  limiter: {
    max: 20,
    duration: 200,
  },
})
export class FetchAndProcessDataProcessor extends WorkerHost {
  constructor(
    private aaClient: AdobeAnalyticsClient,
    private db: DbService,
  ) {
    super();
  }

  async process(job: Job<ChildJobMetadata, void, string>) {
    // check if data already exists, otherwise fetch it

    try {
      const { config, query, dataPoints } = job.data;

      const queryResults = await this.aaClient.execute(createQuery(query));

      const updates = processResults(config, query, dataPoints, queryResults);

      if (typeof updates === 'function') {
        await updates(this.db);

        return;
      }

      await this.db.collections.customReportsMetrics.bulkWrite(updates);

      return;
    } catch (err) {
      console.error('\nAn error occurred processing child job:');
      console.error('jobId: ', job.id);
      console.error('parent report id: ', job.data.reportId);
      console.error('AA query: ', job.data.query);
      console.error((<Error>err).stack);
      throw err;
    }
  }
}
