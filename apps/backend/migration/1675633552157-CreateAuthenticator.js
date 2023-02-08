const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class CreateAuthenticator1675633552157 {
    name = 'CreateAuthenticator1675633552157'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "authenticators" ("credentialID" character varying(255) NOT NULL, "credentialPublicKey" bytea NOT NULL, "counter" bigint NOT NULL, "credentialDeviceType" character varying(32) NOT NULL, "credentialBackedUp" boolean NOT NULL, "transports" character varying(255) NOT NULL, "userId" uuid, CONSTRAINT "PK_c7ef5a624fc426569bbac3186b8" PRIMARY KEY ("credentialID"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "currentChallenge" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "authenticators" ADD CONSTRAINT "FK_1d5625123057c56b97b3b06d360" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "authenticators" DROP CONSTRAINT "FK_1d5625123057c56b97b3b06d360"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "password" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "currentChallenge"`);
        await queryRunner.query(`DROP TABLE "authenticators"`);
    }
}
