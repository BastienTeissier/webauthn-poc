import Head from 'next/head';
import Link from 'next/link';

import { useGetMe } from 'services/api/user/useUser';

import style from './Home.module.css';

export const Home = (): JSX.Element => {
  const user = useGetMe();

  return (
    <div>
      <Head>
        <title>Bifrost</title>
        <meta name="description" content="Generated with bifrost" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={style.main}>
        {user && (
          <>
            <h1>
              Welcome {user.email}
            </h1>

            <p>
              Congratulations for login using Webauthn !
            </p>
          </>
        )}
      </main>
    </div>
  );
};
