/*
 Copyright IBM Corp. 2023
*/

import { render, screen } from '@testing-library/react';
import IndexerKPI, {
  countStats,
  numberOfCycles,
} from '../../../datamodel/indexer/IndexerKPI';
import indexerJson from './indexers.json';

/**
 * Check existence of inline notification component with role 'status'
 * when the component is built with invalid data
 */
function testInvalidData(data) {
  // create a IndexerKPI
  render(<IndexerKPI indexer={data} />);

  // there should be an inline notification with role 'status' and specific message
  const element = screen.getByRole('status');
  expect(element).toBeDefined();
  expect(element).toHaveTextContent('No KPI available');
}

test(`IndexerKPI receives 'null' data`, async () => {
  testInvalidData(null);
});

test(`IndexerKPI receives 'undefined' data`, async () => {
  testInvalidData(undefined);
});

test(`IndexerKPI receives data with no 'kpi'`, async () => {
  const data = {};
  testInvalidData(data);
});

test(`IndexerKPI component receives data`, async () => {
  // create a RetrieverKPI
  const { container } = render(<IndexerKPI indexer={indexerJson} />);

  // should contain an element with role 'table' and name 'Structured list section'
  expect(
    screen.getByRole('table', { name: 'Structured list section' })
  ).toBeDefined();

  // create a list of properties from kpi and check that there's a 'row' for each of them
  const kpi = indexerJson.kpi;
  var properties = {
    // 'collection time': kpi.kpiTimestamp && <DateTime datetime={kpi.kpiTimestamp.human}/>,  // value depends on <DateTime> component
    status: indexerJson.status,
    'running time': kpi.runningTime && kpi.runningTime.human,
    'completed cycles': numberOfCycles(kpi),
    'number of errors': kpi.errors && kpi.errors.total,
    'number of warnings': kpi.warnings && kpi.warnings.total,
    // 'active cycles duration': activeCyclesDuration(kpi),  // function not exported by IndexerKPI
    // 'inactive cycles duration': inactiveCyclesDuration(kpi), // function not exported by IndexerKPI
    // 'last active cycle completion':  kpi.lastActiveCycleEnd && kpi.lastActiveCycleEnd.ts > 0 ? <DateTime datetime={indexerJson.kpi.lastActiveCycleEnd.human}/> : null,    // value depends on <DateTime> component
    // 'last inactive cycle completion': kpi.lastInactiveCycleEnd && kpi.lastInactiveCycleEnd.ts > 0 ? <DateTime datetime={indexerJson.kpi.lastInactiveCycleEnd.human}/> : null,   // value depends on <DateTime> component
    'consumed change logs': countStats(kpi.consumedChangelogEntries),
    'processed change logs': countStats(kpi.processedChangelogEntries),
    'index updates': countStats(kpi.indexUpdates),
    'index deletions': countStats(kpi.indexDeletions),
  };

  for (const property in properties) {
    expect(
      screen.getByRole('row', {
        name: `${property} ${properties[property]}`.trim(),
      })
    );
  }
});
