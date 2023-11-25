const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class UpdateSchema1700919374160 {
    name = 'UpdateSchema1700919374160'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "temporary_agreement" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "signedByUser1" boolean NOT NULL DEFAULT (0), "signedByUser2" boolean NOT NULL DEFAULT (0), "user1Id" integer, "user2Id" integer, "requestId" varchar, "documentId" integer, "isDraft" boolean NOT NULL DEFAULT (1), CONSTRAINT "UQ_0e5922013f1342a781e331b3be9" UNIQUE ("documentId"), CONSTRAINT "FK_059546e11fe51714faecc204eea" FOREIGN KEY ("documentId") REFERENCES "document" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_agreement"("id", "signedByUser1", "signedByUser2", "user1Id", "user2Id", "requestId", "documentId", "isDraft") SELECT "id", "signedByUser1", "signedByUser2", "user1Id", "user2Id", "requestId", "documentId", "isDraft" FROM "agreement"`);
        await queryRunner.query(`DROP TABLE "agreement"`);
        await queryRunner.query(`ALTER TABLE "temporary_agreement" RENAME TO "agreement"`);
        await queryRunner.query(`CREATE TABLE "recipient" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "isSigned" boolean NOT NULL, "actionId" integer NOT NULL, "userId" integer, "agreementId" integer)`);
        await queryRunner.query(`CREATE TABLE "temporary_agreement" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "documentId" integer, CONSTRAINT "UQ_0e5922013f1342a781e331b3be9" UNIQUE ("documentId"), CONSTRAINT "FK_059546e11fe51714faecc204eea" FOREIGN KEY ("documentId") REFERENCES "document" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_agreement"("id", "documentId") SELECT "id", "documentId" FROM "agreement"`);
        await queryRunner.query(`DROP TABLE "agreement"`);
        await queryRunner.query(`ALTER TABLE "temporary_agreement" RENAME TO "agreement"`);
        await queryRunner.query(`CREATE TABLE "temporary_agreement" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "documentId" integer, "requestId" integer NOT NULL, "doc1Id" integer NOT NULL, CONSTRAINT "UQ_0e5922013f1342a781e331b3be9" UNIQUE ("documentId"), CONSTRAINT "FK_059546e11fe51714faecc204eea" FOREIGN KEY ("documentId") REFERENCES "document" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_agreement"("id", "documentId") SELECT "id", "documentId" FROM "agreement"`);
        await queryRunner.query(`DROP TABLE "agreement"`);
        await queryRunner.query(`ALTER TABLE "temporary_agreement" RENAME TO "agreement"`);
        await queryRunner.query(`CREATE TABLE "temporary_recipient" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "isSigned" boolean NOT NULL, "actionId" integer NOT NULL, "userId" integer, "agreementId" integer, CONSTRAINT "FK_0df02885203e3466256b1424fc3" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_0479d7ae6369c3e2a851d5f285f" FOREIGN KEY ("agreementId") REFERENCES "agreement" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_recipient"("id", "isSigned", "actionId", "userId", "agreementId") SELECT "id", "isSigned", "actionId", "userId", "agreementId" FROM "recipient"`);
        await queryRunner.query(`DROP TABLE "recipient"`);
        await queryRunner.query(`ALTER TABLE "temporary_recipient" RENAME TO "recipient"`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "recipient" RENAME TO "temporary_recipient"`);
        await queryRunner.query(`CREATE TABLE "recipient" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "isSigned" boolean NOT NULL, "actionId" integer NOT NULL, "userId" integer, "agreementId" integer)`);
        await queryRunner.query(`INSERT INTO "recipient"("id", "isSigned", "actionId", "userId", "agreementId") SELECT "id", "isSigned", "actionId", "userId", "agreementId" FROM "temporary_recipient"`);
        await queryRunner.query(`DROP TABLE "temporary_recipient"`);
        await queryRunner.query(`ALTER TABLE "agreement" RENAME TO "temporary_agreement"`);
        await queryRunner.query(`CREATE TABLE "agreement" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "documentId" integer, CONSTRAINT "UQ_0e5922013f1342a781e331b3be9" UNIQUE ("documentId"), CONSTRAINT "FK_059546e11fe51714faecc204eea" FOREIGN KEY ("documentId") REFERENCES "document" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "agreement"("id", "documentId") SELECT "id", "documentId" FROM "temporary_agreement"`);
        await queryRunner.query(`DROP TABLE "temporary_agreement"`);
        await queryRunner.query(`ALTER TABLE "agreement" RENAME TO "temporary_agreement"`);
        await queryRunner.query(`CREATE TABLE "agreement" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "signedByUser1" boolean NOT NULL DEFAULT (0), "signedByUser2" boolean NOT NULL DEFAULT (0), "user1Id" integer, "user2Id" integer, "requestId" varchar, "documentId" integer, "isDraft" boolean NOT NULL DEFAULT (1), CONSTRAINT "UQ_0e5922013f1342a781e331b3be9" UNIQUE ("documentId"), CONSTRAINT "FK_059546e11fe51714faecc204eea" FOREIGN KEY ("documentId") REFERENCES "document" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "agreement"("id", "documentId") SELECT "id", "documentId" FROM "temporary_agreement"`);
        await queryRunner.query(`DROP TABLE "temporary_agreement"`);
        await queryRunner.query(`DROP TABLE "recipient"`);
        await queryRunner.query(`ALTER TABLE "agreement" RENAME TO "temporary_agreement"`);
        await queryRunner.query(`CREATE TABLE "agreement" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "signedByUser1" boolean NOT NULL DEFAULT (0), "signedByUser2" boolean NOT NULL DEFAULT (0), "user1Id" integer, "user2Id" integer, "requestId" varchar, "documentId" integer, "isDraft" boolean NOT NULL DEFAULT (1), CONSTRAINT "UQ_0e5922013f1342a781e331b3be9" UNIQUE ("documentId"), CONSTRAINT "FK_059546e11fe51714faecc204eea" FOREIGN KEY ("documentId") REFERENCES "document" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_4f39b39bd82fa9d9535e9e55a47" FOREIGN KEY ("user1Id") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_34291c344829f41b8677db9b6d4" FOREIGN KEY ("user2Id") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "agreement"("id", "signedByUser1", "signedByUser2", "user1Id", "user2Id", "requestId", "documentId", "isDraft") SELECT "id", "signedByUser1", "signedByUser2", "user1Id", "user2Id", "requestId", "documentId", "isDraft" FROM "temporary_agreement"`);
        await queryRunner.query(`DROP TABLE "temporary_agreement"`);
    }
}
