import Head from 'next/head';
import { useRouter } from 'next/router';
import { NextPage } from 'next/types';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';

import { Input, PasswordInput } from 'components/atoms';
import { Pages } from 'constant';
import { beginRegistration, LoginData, login } from 'services/api/auth/login';

import style from './Registration.module.css';

export const Registration: NextPage = () => {
  const intl = useIntl();
  const router = useRouter();

  const { register, handleSubmit } = useForm<LoginData>();
  const onRegister = (data: LoginData) => {
    return beginRegistration(data)
      .then(() => router.push(Pages.Login))
      .catch((e: Response) => {
        console.log(e);
      });
  };


  return (
    <main>
      <Head>
        <meta name="description" content="login" />
        <title>Registration | Bifrost</title>
      </Head>
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
