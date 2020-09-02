import React, { PureComponent } from 'react';
import store from '../../store';

export interface Props<T> {
  storageKey: string;
  defaultValue?: T;
  children: (value: T, onSaveToStore: (value: T) => void) => React.ReactNode;
}

interface State<T> {
  value: T;
}

// const LOCAL_STORAGE_KEY = 'grafana.dashboard.timepicker.history';

export class LocalStorageValueProvider<T> extends PureComponent<Props<T>, State<T>> {
  constructor(props: Props<T>) {
    super(props);

    const { storageKey, defaultValue } = props;

    this.state = {
      value: store.getObject(storageKey, defaultValue),
    };
  }

  onSaveToStore = (value: T) => {
    const { storageKey } = this.props;
    try {
      store.setObject(storageKey, value);
    } catch (error) {
      console.error(error);
    }
    this.setState({ value });
  };

  render() {
    const { children } = this.props;
    let { value } = this.state;

    // if (storageKey === LOCAL_STORAGE_KEY){
    // }
    return <>{children(value, this.onSaveToStore)}</>;
  }
}
