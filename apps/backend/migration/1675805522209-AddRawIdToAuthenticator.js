const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class AddRawIdToAuthenticator1675805522209 {
    name = 'AddRawIdToAuthenticator1675805522209'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "authenticators" ADD "rawId" text`);
        await queryRunner.query(`ALTER TABLE "authenticators" ADD CONSTRAINT "UQ_8ae759ea30843f96d24299186ff" UNIQUE ("rawId")`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "authenticators" DROP CONSTRAINT "UQ_8ae759ea30843f96d24299186ff"`);
        await queryRunner.query(`ALTER TABLE "authenticators" DROP COLUMN "rawId"`);
    }
}
