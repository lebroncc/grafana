import React, { FC } from 'react';
import { selectors } from '@grafana/e2e-selectors';

import { FormModel } from './LoginCtrl';
import { Button, Form, Input, Field } from '@grafana/ui';
import { css } from 'emotion';

interface Props {
  displayForgotPassword: boolean;
  onSubmit: (data: FormModel) => void;
  isLoggingIn: boolean;
  passwordHint: string;
  loginHint: string;
}

const forgottenPasswordStyles = css`
  display: inline-block;
  margin-top: 16px;
  float: right;
`;

const wrapperStyles = css`
  width: 100%;
  padding-bottom: 16px;
`;

export const submitButton = css`
  justify-content: center;
  width: 100%;
`;

export const LoginForm: FC<Props> = ({ displayForgotPassword, onSubmit, isLoggingIn, passwordHint, loginHint }) => {
  return (
    <div className={wrapperStyles}>
      <Form onSubmit={onSubmit} validateOn="onChange">
        {({ register, errors }) => (
          <>
            <Field label="邮件/用户名" invalid={!!errors.user} error={errors.user?.message}>
              <Input
                autoFocus
                name="user"
                ref={register({ required: '请输入邮件/用户名' })}
                placeholder={loginHint}
                aria-label={selectors.pages.Login.username}
              />
            </Field>
            <Field label="密码" invalid={!!errors.password} error={errors.password?.message}>
              <Input
                name="password"
                type="password"
                placeholder={passwordHint}
                ref={register({ required: '请输入密码' })}
                aria-label={selectors.pages.Login.password}
              />
            </Field>
            <Button aria-label={selectors.pages.Login.submit} className={submitButton} disabled={isLoggingIn}>
              {isLoggingIn ? '登陆中...' : '登陆'}
            </Button>
            {displayForgotPassword && (
              <a className={forgottenPasswordStyles} href="user/password/send-reset-email">
                忘记密码?
              </a>
            )}
          </>
        )}
      </Form>
    </div>
  );
};
