import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';


type CredentialDeviceType = 'singleDevice' | 'multiDevice';

@Entity('authenticators')
export class Authenticator {
  // SQL: Encode to base64url then store as `TEXT`. Index this column
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text', { unique: true, nullable: true })
  rawId!: string;

  @Column('bytea', { unique: true })
  credentialID!: Uint8Array;
  // SQL: Store raw bytes as `BYTEA`/`BLOB`/etc...
  @Column('bytea')
  credentialPublicKey!: Uint8Array;
  // SQL: Consider `BIGINT` since some authenticators return atomic timestamps as counters
  @Column('bigint')
  counter!: number;
  // SQL: `VARCHAR(32)` or similar, longest possible value is currently 12 characters
  // Ex: 'singleDevice' | 'multiDevice'
  @Column('varchar', { length: 32 })
  credentialDeviceType!: CredentialDeviceType;
  // SQL: `BOOL` or whatever similar type is supported
  @Column('boolean')
  credentialBackedUp!: boolean;
  // SQL: `VARCHAR(255)` and store string array as a CSV string
  // Ex: ['usb' | 'ble' | 'nfc' | 'internal']
  @Column('varchar', { length: 255, nullable: true })
  transports?: AuthenticatorTransport[];

  @ManyToOne('User', 'id')
  user!: User; 
}
