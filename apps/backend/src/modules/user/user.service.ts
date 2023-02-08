import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AdminUpdateUserDto,
  CreateUserDto,
  GetUserDto,
  UpdateUserDto,
} from '@webauthn-poc/interfaces';
import { hash } from 'bcrypt';
import { Repository } from 'typeorm';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
} from '@simplewebauthn/server';



import { User } from './user.entity';
import { Authenticator } from './authenticator.entity';

const SALT_ROUNDS = 10;

// Human-readable title for your website
const rpName = 'SimpleWebAuthn Example';
// A unique identifier for your website
const rpID = 'localhost';
// The URL at which registrations and authentications should occur
const origin = `http://${rpID}:3000`;

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>, @InjectRepository(Authenticator) private readonly authenticatorRepository: Repository<Authenticator>) {}

  private hashPassword = async (password: string) => {
    return await hash(password, SALT_ROUNDS);
  };

  /* getUser = async (userId: string): Promise<GetUserDto> => {
    return await this.userRepository.findOneByOrFail({ id: userId });
  }; */

/*   createUser = async (userDto: CreateUserDto): Promise<GetUserDto> => {
    const existingUser = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email: userDto.email })
      .getOne();

    if (existingUser) {
      throw new ConflictException();
    }

    const hashedPassword = await this.hashPassword(userDto.password);
    const { id: userId } = await this.userRepository.save({
      ...userDto,
      roles: [],
      password: hashedPassword,
    });

    return await this.getUser(userId);
  }; */

  /* updateUser = async (
    userId: string,
    userDto: UpdateUserDto | AdminUpdateUserDto,
  ): Promise<GetUserDto> => {
    await this.userRepository.findOneByOrFail({ id: userId });
    let user = userDto;

    if (userDto.password !== undefined) {
      const hashedPassword = await this.hashPassword(userDto.password);
      user = { ...user, password: hashedPassword };
    }

    await this.userRepository.save({ ...user, id: userId });

    return await this.getUser(userId);
  }; */

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
    
    // (Pseudocode) Remember the challenge for this user
    this.setUserCurrentChallenge(user.id, options.challenge);
    
    return options;
  }

  finishRegistration = async (userId: string, credential: any) => {
    const user = await this.userRepository.findOneByOrFail({ id: userId });
    const existingAuthenticator = await this.authenticatorRepository.findOneBy({ credentialID: credential.rawId });

    if (existingAuthenticator) {
      throw new ConflictException();
    }

    console.log('credential', credential);

    const { verified, registrationInfo } = await verifyRegistrationResponse({
      response: credential,
      expectedChallenge: user.currentChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
    });

    if (!verified || !registrationInfo) {
      throw new ConflictException();
    }

    console.log('registrationInfo', registrationInfo);

    // (Pseudocode) Clear the challenge for this user
    this.setUserCurrentChallenge(user.id, '');

    const authenticator = {} as Authenticator;
    authenticator.rawId = credential.rawId;
    authenticator.credentialID = registrationInfo.credentialID;
    authenticator.credentialPublicKey = registrationInfo.credentialPublicKey;
    authenticator.counter = registrationInfo.counter;
    authenticator.credentialDeviceType = credential.type;
    //authenticator.transports = [];
    authenticator.credentialBackedUp = false;
    authenticator.user = user;

    const response = await this.authenticatorRepository.save(authenticator);

    /* const response = await this.userRepository
      .createQueryBuilder('user')
      .relation(User, 'authenticators')
      .of(user)
      .add({
        credentialID: registrationInfo.credentialID,
        publicKey: registrationInfo.credentialPublicKey,
        counter: registrationInfo.counter,
      }); */

      console.log('response', response);
  }

}
