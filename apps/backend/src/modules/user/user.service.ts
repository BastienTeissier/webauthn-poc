import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateUserDto,
  GetUserDto,
} from '@webauthn-poc/interfaces';
import { Repository } from 'typeorm';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
} from '@simplewebauthn/server';



import { User } from './user.entity';
import { Authenticator } from './authenticator.entity';

const rpName = 'SimpleWebAuthn Example';
const rpID = 'localhost';
const origin = `http://${rpID}:3000`;

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>, @InjectRepository(Authenticator) private readonly authenticatorRepository: Repository<Authenticator>) {}

  getUser = async (userId: string): Promise<GetUserDto> => {
    return await this.userRepository.findOneByOrFail({ id: userId });
  };

  setUserCurrentChallenge = async (userId: string, challenge: string) => {
    await this.userRepository.save({ id: userId, currentChallenge: challenge });
  };

  startRegistration = async (userDto: CreateUserDto): Promise<PublicKeyCredentialCreationOptions> => {
    const existingUser = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email: userDto.email })
      .getOne();

    if (existingUser) {
      throw new ConflictException();
    }

    const user = await this.userRepository.save({
      ...userDto,
      roles: [],
    });

    const options = generateRegistrationOptions({
      rpName,
      rpID,
      userID: user.id,
      userName: user.email,
      // Don't prompt users for additional information about the authenticator
      // (Recommended for smoother UX)
      attestationType: 'none',
      // Prevent users from re-registering existing authenticators
      /* excludeCredentials: userAuthenticators.map(authenticator => ({
        id: authenticator.credentialID,
        type: 'public-key',
        // Optional
        transports: authenticator.transports,
      })), */
    });
    
    this.setUserCurrentChallenge(user.id, options.challenge);
    
    return options;
  }

  finishRegistration = async (userId: string, credential: any) => {
    const user = await this.userRepository.findOneByOrFail({ id: userId });
    const existingAuthenticator = await this.authenticatorRepository.findOneBy({ credentialID: credential.rawId });

    if (existingAuthenticator) {
      throw new ConflictException();
    }

    const { verified, registrationInfo } = await verifyRegistrationResponse({
      response: credential,
      expectedChallenge: user.currentChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
    });

    if (!verified || !registrationInfo) {
      throw new ConflictException();
    }


    this.setUserCurrentChallenge(user.id, '');

    const authenticator = {} as Authenticator;
    authenticator.rawId = credential.rawId;
    authenticator.credentialID = registrationInfo.credentialID;
    authenticator.credentialPublicKey = registrationInfo.credentialPublicKey;
    authenticator.counter = registrationInfo.counter;
    authenticator.credentialDeviceType = credential.type;
    authenticator.credentialBackedUp = false;
    authenticator.user = user;

    await this.authenticatorRepository.save(authenticator);
  }

}
