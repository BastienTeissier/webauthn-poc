import { ApiRoutes } from '../apiRoutes';
import { apiClient } from '../client';
import { startRegistration, startAuthentication } from '@simplewebauthn/browser';
import { getAccessFromResponse, setAccessToken } from './utils';

export type LoginData = {
  email: string;
};

export const beginRegistration = async (payload: LoginData): Promise<void> => {
  const { data } = await apiClient.post<PublicKeyCredentialCreationOptions>(
    ApiRoutes.startRegistration,
    payload,
  );
  debugger;
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
  debugger;
  const credential = await startAuthentication(options);

  const token = await apiClient.post<PublicKeyCredentialCreationOptions>(
    ApiRoutes.finishAuthentication,
    {userEmail: data.email ,credential},
  );

  setAccessToken(
    getAccessFromResponse(token),
  )
}
