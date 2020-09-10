import { getBackendSrv } from '@grafana/runtime';
import { PanelPlugin } from '@grafana/data';
import { ThunkResult } from 'app/types';
import { pluginDashboardsLoad, pluginDashboardsLoaded, pluginsLoaded, panelPluginLoaded } from './reducers';
import { importPanelPlugin } from 'app/features/plugins/plugin_loader';

export function loadPlugins(): ThunkResult<void> {
  return async dispatch => {
    let result = await getBackendSrv().get('api/plugins', { embedded: 0 });

    // TODO: 过滤数据源插件
    let includePluginList = ['Prometheus', 'Elasticsearch', 'MySQL', 'grafana-dm7'];
    result = result.filter((item: any) => includePluginList.includes(item.name));
    dispatch(pluginsLoaded(result));
  };
}

export function loadPluginDashboards(): ThunkResult<void> {
  return async (dispatch, getStore) => {
    dispatch(pluginDashboardsLoad());
    const dataSourceType = getStore().dataSources.dataSource.type;
    const response = await getBackendSrv().get(`api/plugins/${dataSourceType}/dashboards`);
    dispatch(pluginDashboardsLoaded(response));
  };
}

export function loadPanelPlugin(pluginId: string): ThunkResult<Promise<PanelPlugin>> {
  return async (dispatch, getStore) => {
    let plugin = getStore().plugins.panels[pluginId];

    if (!plugin) {
      plugin = await importPanelPlugin(pluginId);

      // second check to protect against raise condition
      if (!getStore().plugins.panels[pluginId]) {
        dispatch(panelPluginLoaded(plugin));
      }
    }

    return plugin;
  };
}
