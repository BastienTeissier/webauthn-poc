import { ApiRoutes } from '../apiRoutes';
import { apiClient } from '../client';
import { startRegistration, startAuthentication } from '@simplewebauthn/browser';
// import { getAccessFromResponse, setAccessToken } from './utils';

export type LoginData = {
  email: string;
};

/* export const login = async (data: LoginData): Promise<void> =>
  setAccessToken(
    getAccessFromResponse(await apiClient.post<unknown>(ApiRoutes.login, data)),
  ); */

export const beginRegistration = async (payload: LoginData): Promise<void> => {
  const { data } = await apiClient.post<PublicKeyCredentialCreationOptions>(
    ApiRoutes.startRegistration,
    payload,
  );
  const credential = await startRegistration(data);

  await apiClient.post<PublicKeyCredentialCreationOptions>(
    ApiRoutes.finishRegistration,
    {userId: data.user.id ,credential},
  );
}

export const login = async (data: LoginData): Promise<void> => {
  const { data: options } = await apiClient.post<PublicKeyCredentialCreationOptions>(
    ApiRoutes.startAuthentication,
    data,
  );
  console.log(data)
  console.log(options);
  const credential = await startAuthentication(options);

  await apiClient.post<PublicKeyCredentialCreationOptions>(
    ApiRoutes.finishAuthentication,
    {userEmail: data.email ,credential},
  );
}
