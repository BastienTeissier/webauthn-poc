import Head from 'next/head';
import { useRouter } from 'next/router';
import { NextPage } from 'next/types';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';

import { Input, PasswordInput } from 'components/atoms';
import { Pages } from 'constant';
import { beginRegistration, LoginData, login } from 'services/api/auth/login';

import style from './Login.module.css';

export const Login: NextPage = () => {
  const intl = useIntl();
  const router = useRouter();

  const { register, handleSubmit } = useForm<LoginData>();
  const onRegister = (data: LoginData) => {
    return beginRegistration(data)
      .then(() => router.push(Pages.Home))
      .catch((e: Response) => {
        console.log(e);
      });
  };

  const onLogin = (data: LoginData) => {
    return login(data)
      .then(() => router.push(Pages.Home))
      .catch((e: Response) => {
        console.log(e);
      });
  };

  return (
    <main>
      <Head>
        <meta name="description" content="login" />
        <title>Login | Bifrost</title>
      </Head>
      <div className={style.container}>
        <h1>
          <FormattedMessage id="login.title" />
        </h1>
        <form
          className={style.form}
          method="post"
          onSubmit={handleSubmit(onLogin)}
        >
          <div>
            <Input
              id="login.email"
              type="email"
              autoComplete="email"
              label={intl.formatMessage({
                id: 'login.email.label',
              })}
              placeholder={intl.formatMessage({
                id: 'login.email.placeholder',
              })}
              {...register('email', {
                required: intl.formatMessage({
                  id: 'login.email.error.required',
                }),
                pattern: {
                  value: /^\S+@\S+\.\S+$/, // basic email regex
                  message: intl.formatMessage({
                    id: 'login.email.error.invalid',
                  }),
                },
              })}
            />
          </div>
          <button type="submit" className={style.submit}>
            <FormattedMessage id="login.submit" />
          </button>
        </form>
      </div>
      <div className={style.container}>
        <h1>
          <FormattedMessage id="register.title" />
        </h1>
        <form
          className={style.form}
          method="post"
          onSubmit={handleSubmit(onRegister)}
        >
          <div>
            <Input
              id="register.email"
              type="email"
              autoComplete="email"
              label={intl.formatMessage({
                id: 'register.email.label',
              })}
              placeholder={intl.formatMessage({
                id: 'register.email.placeholder',
              })}
              {...register('email', {
                required: intl.formatMessage({
                  id: 'register.email.error.required',
                }),
                pattern: {
                  value: /^\S+@\S+\.\S+$/, // basic email regex
                  message: intl.formatMessage({
                    id: 'register.email.error.invalid',
                  }),
                },
              })}
            />
          </div>
          <button type="submit" className={style.submit}>
            <FormattedMessage id="register.submit" />
          </button>
        </form>
      </div>
    </main>
  );
};
