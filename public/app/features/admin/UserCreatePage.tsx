import React, { useCallback } from 'react';
import { hot } from 'react-hot-loader';
import { connect } from 'react-redux';
import { Form, Button, Input, Field } from '@grafana/ui';
import { NavModel } from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';
import { StoreState } from '../../types';
import { getNavModel } from '../../core/selectors/navModel';
import Page from 'app/core/components/Page/Page';
import { updateLocation } from 'app/core/actions';

interface UserCreatePageProps {
  navModel: NavModel;
  updateLocation: typeof updateLocation;
}
interface UserDTO {
  name: string;
  password: string;
  email?: string;
  login?: string;
}

const createUser = async (user: UserDTO) => getBackendSrv().post('/api/admin/users', user);

const UserCreatePage: React.FC<UserCreatePageProps> = ({ navModel, updateLocation }) => {
  const onSubmit = useCallback(async (data: UserDTO) => {
    await createUser(data);
    updateLocation({ path: '/admin/users' });
  }, []);

  return (
    <Page navModel={navModel}>
      <Page.Contents>
        <h1>创建新用户</h1>
        <Form onSubmit={onSubmit} validateOn="onBlur">
          {({ register, errors }) => {
            return (
              <>
                <Field label="姓名" required invalid={!!errors.name} error={!!errors.name && '请输入姓名'}>
                  <Input name="name" ref={register({ required: true })} />
                </Field>

                <Field label="邮箱">
                  <Input name="email" ref={register} />
                </Field>

                <Field label="登录名">
                  <Input name="login" ref={register} />
                </Field>
                <Field
                  label="密码"
                  required
                  invalid={!!errors.password}
                  error={!!errors.password && '请输入密码且至少包含4个字符'}
                >
                  <Input
                    type="password"
                    name="password"
                    ref={register({
                      validate: value => value.trim() !== '' && value.length >= 4,
                    })}
                  />
                </Field>
                <Button type="submit">创建用户</Button>
              </>
            );
          }}
        </Form>
      </Page.Contents>
    </Page>
  );
};

const mapStateToProps = (state: StoreState) => ({
  navModel: getNavModel(state.navIndex, 'global-users'),
});

const mapDispatchToProps = {
  updateLocation,
};
export default hot(module)(connect(mapStateToProps, mapDispatchToProps)(UserCreatePage));
