import { PanelPlugin } from '@grafana/data';
import { GaugePanel } from './GaugePanel';
import { GaugeOptions } from './types';
import { addStandardDataReduceOptions } from '../stat/types';
import { gaugePanelMigrationHandler, gaugePanelChangedHandler } from './GaugeMigrations';

export const plugin = new PanelPlugin<GaugeOptions>(GaugePanel)
  .useFieldConfig()
  .setPanelOptions(builder => {
    addStandardDataReduceOptions(builder);
    builder
      .addBooleanSwitch({
        path: 'showThresholdLabels',
        name: '显示阈值标签',
        description: '在仪表栏周围显示阈值',
        defaultValue: false,
      })
      .addBooleanSwitch({
        path: 'showThresholdMarkers',
        name: '显示阈值标记',
        description: '将阈值渲染在外部条状图',
        defaultValue: true,
      });
  })
  .setPanelChangeHandler(gaugePanelChangedHandler)
  .setMigrationHandler(gaugePanelMigrationHandler);
