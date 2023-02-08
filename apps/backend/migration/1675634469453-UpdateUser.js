const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class UpdateUser1675634469453 {
    name = 'UpdateUser1675634469453'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "currentChallenge" DROP NOT NULL`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "currentChallenge" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD "name" character varying(50) NOT NULL`);
    }
}
