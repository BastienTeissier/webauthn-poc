const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class MakeAuthentacatorTransportNullable1675802309496 {
    name = 'MakeAuthentacatorTransportNullable1675802309496'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "authenticators" ALTER COLUMN "transports" DROP NOT NULL`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "authenticators" ALTER COLUMN "transports" SET NOT NULL`);
    }
}
