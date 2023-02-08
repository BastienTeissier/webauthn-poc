const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class UpdateAuthenticatorId1675715670308 {
    name = 'UpdateAuthenticatorId1675715670308'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "authenticators" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "authenticators" DROP CONSTRAINT "PK_c7ef5a624fc426569bbac3186b8"`);
        await queryRunner.query(`ALTER TABLE "authenticators" ADD CONSTRAINT "PK_499b26ad4cdfdd8fb7c025a790d" PRIMARY KEY ("credentialID", "id")`);
        await queryRunner.query(`ALTER TABLE "authenticators" DROP CONSTRAINT "PK_499b26ad4cdfdd8fb7c025a790d"`);
        await queryRunner.query(`ALTER TABLE "authenticators" ADD CONSTRAINT "PK_1f524613bc876f10f9ba8b0f394" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "authenticators" DROP COLUMN "credentialID"`);
        await queryRunner.query(`ALTER TABLE "authenticators" ADD "credentialID" bytea NOT NULL`);
        await queryRunner.query(`ALTER TABLE "authenticators" ADD CONSTRAINT "UQ_c7ef5a624fc426569bbac3186b8" UNIQUE ("credentialID")`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "authenticators" DROP CONSTRAINT "UQ_c7ef5a624fc426569bbac3186b8"`);
        await queryRunner.query(`ALTER TABLE "authenticators" DROP COLUMN "credentialID"`);
        await queryRunner.query(`ALTER TABLE "authenticators" ADD "credentialID" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "authenticators" DROP CONSTRAINT "PK_1f524613bc876f10f9ba8b0f394"`);
        await queryRunner.query(`ALTER TABLE "authenticators" ADD CONSTRAINT "PK_499b26ad4cdfdd8fb7c025a790d" PRIMARY KEY ("credentialID", "id")`);
        await queryRunner.query(`ALTER TABLE "authenticators" DROP CONSTRAINT "PK_499b26ad4cdfdd8fb7c025a790d"`);
        await queryRunner.query(`ALTER TABLE "authenticators" ADD CONSTRAINT "PK_c7ef5a624fc426569bbac3186b8" PRIMARY KEY ("credentialID")`);
        await queryRunner.query(`ALTER TABLE "authenticators" DROP COLUMN "id"`);
    }
}
