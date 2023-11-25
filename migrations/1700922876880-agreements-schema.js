const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class AgreementsSchema1700922876880 {
    name = 'AgreementsSchema1700922876880'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "temporary_recipient" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "isSigned" boolean NOT NULL, "signLink" integer NOT NULL, "userId" integer, "agreementId" integer, CONSTRAINT "FK_0479d7ae6369c3e2a851d5f285f" FOREIGN KEY ("agreementId") REFERENCES "agreement" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_0df02885203e3466256b1424fc3" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_recipient"("id", "isSigned", "signLink", "userId", "agreementId") SELECT "id", "isSigned", "actionId", "userId", "agreementId" FROM "recipient"`);
        await queryRunner.query(`DROP TABLE "recipient"`);
        await queryRunner.query(`ALTER TABLE "temporary_recipient" RENAME TO "recipient"`);
        await queryRunner.query(`CREATE TABLE "temporary_recipient" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "isSigned" boolean NOT NULL, "signLink" varchar NOT NULL, "userId" integer, "agreementId" integer, CONSTRAINT "FK_0479d7ae6369c3e2a851d5f285f" FOREIGN KEY ("agreementId") REFERENCES "agreement" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_0df02885203e3466256b1424fc3" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_recipient"("id", "isSigned", "signLink", "userId", "agreementId") SELECT "id", "isSigned", "signLink", "userId", "agreementId" FROM "recipient"`);
        await queryRunner.query(`DROP TABLE "recipient"`);
        await queryRunner.query(`ALTER TABLE "temporary_recipient" RENAME TO "recipient"`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "recipient" RENAME TO "temporary_recipient"`);
        await queryRunner.query(`CREATE TABLE "recipient" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "isSigned" boolean NOT NULL, "signLink" integer NOT NULL, "userId" integer, "agreementId" integer, CONSTRAINT "FK_0479d7ae6369c3e2a851d5f285f" FOREIGN KEY ("agreementId") REFERENCES "agreement" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_0df02885203e3466256b1424fc3" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "recipient"("id", "isSigned", "signLink", "userId", "agreementId") SELECT "id", "isSigned", "signLink", "userId", "agreementId" FROM "temporary_recipient"`);
        await queryRunner.query(`DROP TABLE "temporary_recipient"`);
        await queryRunner.query(`ALTER TABLE "recipient" RENAME TO "temporary_recipient"`);
        await queryRunner.query(`CREATE TABLE "recipient" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "isSigned" boolean NOT NULL, "actionId" integer NOT NULL, "userId" integer, "agreementId" integer, CONSTRAINT "FK_0479d7ae6369c3e2a851d5f285f" FOREIGN KEY ("agreementId") REFERENCES "agreement" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_0df02885203e3466256b1424fc3" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "recipient"("id", "isSigned", "actionId", "userId", "agreementId") SELECT "id", "isSigned", "signLink", "userId", "agreementId" FROM "temporary_recipient"`);
        await queryRunner.query(`DROP TABLE "temporary_recipient"`);
    }
}
