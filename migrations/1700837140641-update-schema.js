const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class UpdateSchema1700837140641 {
    name = 'UpdateSchema1700837140641'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "temporary_document" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "agreementId" integer, CONSTRAINT "REL_01ff53c98ad85454ea5d8b6a96" UNIQUE ("agreementId"), CONSTRAINT "FK_01ff53c98ad85454ea5d8b6a966" FOREIGN KEY ("agreementId") REFERENCES "agreement" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_document"("id", "agreementId") SELECT "id", "agreementId" FROM "document"`);
        await queryRunner.query(`DROP TABLE "document"`);
        await queryRunner.query(`ALTER TABLE "temporary_document" RENAME TO "document"`);
        await queryRunner.query(`CREATE TABLE "temporary_document" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "agreementId" integer, "link" varchar NOT NULL, CONSTRAINT "REL_01ff53c98ad85454ea5d8b6a96" UNIQUE ("agreementId"), CONSTRAINT "FK_01ff53c98ad85454ea5d8b6a966" FOREIGN KEY ("agreementId") REFERENCES "agreement" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_document"("id", "agreementId") SELECT "id", "agreementId" FROM "document"`);
        await queryRunner.query(`DROP TABLE "document"`);
        await queryRunner.query(`ALTER TABLE "temporary_document" RENAME TO "document"`);
        await queryRunner.query(`CREATE TABLE "temporary_agreement" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "signedByUser1" boolean NOT NULL DEFAULT (0), "signedByUser2" boolean NOT NULL DEFAULT (0), "user1Id" integer, "user2Id" integer, "requestId" varchar, "documentId" integer, "isDraft" boolean NOT NULL DEFAULT (1), CONSTRAINT "UQ_0e5922013f1342a781e331b3be9" UNIQUE ("documentId"), CONSTRAINT "FK_34291c344829f41b8677db9b6d4" FOREIGN KEY ("user2Id") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_4f39b39bd82fa9d9535e9e55a47" FOREIGN KEY ("user1Id") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_059546e11fe51714faecc204eea" FOREIGN KEY ("documentId") REFERENCES "document" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_agreement"("id", "signedByUser1", "signedByUser2", "user1Id", "user2Id", "requestId", "documentId") SELECT "id", "signedByUser1", "signedByUser2", "user1Id", "user2Id", "requestId", "documentId" FROM "agreement"`);
        await queryRunner.query(`DROP TABLE "agreement"`);
        await queryRunner.query(`ALTER TABLE "temporary_agreement" RENAME TO "agreement"`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "agreement" RENAME TO "temporary_agreement"`);
        await queryRunner.query(`CREATE TABLE "agreement" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "signedByUser1" boolean NOT NULL DEFAULT (0), "signedByUser2" boolean NOT NULL DEFAULT (0), "user1Id" integer, "user2Id" integer, "requestId" varchar, "documentId" integer, CONSTRAINT "UQ_0e5922013f1342a781e331b3be9" UNIQUE ("documentId"), CONSTRAINT "FK_34291c344829f41b8677db9b6d4" FOREIGN KEY ("user2Id") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_4f39b39bd82fa9d9535e9e55a47" FOREIGN KEY ("user1Id") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_059546e11fe51714faecc204eea" FOREIGN KEY ("documentId") REFERENCES "document" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "agreement"("id", "signedByUser1", "signedByUser2", "user1Id", "user2Id", "requestId", "documentId") SELECT "id", "signedByUser1", "signedByUser2", "user1Id", "user2Id", "requestId", "documentId" FROM "temporary_agreement"`);
        await queryRunner.query(`DROP TABLE "temporary_agreement"`);
        await queryRunner.query(`ALTER TABLE "document" RENAME TO "temporary_document"`);
        await queryRunner.query(`CREATE TABLE "document" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "agreementId" integer, CONSTRAINT "REL_01ff53c98ad85454ea5d8b6a96" UNIQUE ("agreementId"), CONSTRAINT "FK_01ff53c98ad85454ea5d8b6a966" FOREIGN KEY ("agreementId") REFERENCES "agreement" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "document"("id", "agreementId") SELECT "id", "agreementId" FROM "temporary_document"`);
        await queryRunner.query(`DROP TABLE "temporary_document"`);
        await queryRunner.query(`ALTER TABLE "document" RENAME TO "temporary_document"`);
        await queryRunner.query(`CREATE TABLE "document" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "pdf" varchar NOT NULL, "isDraft" boolean NOT NULL, "agreementId" integer, CONSTRAINT "REL_01ff53c98ad85454ea5d8b6a96" UNIQUE ("agreementId"), CONSTRAINT "FK_01ff53c98ad85454ea5d8b6a966" FOREIGN KEY ("agreementId") REFERENCES "agreement" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "document"("id", "agreementId") SELECT "id", "agreementId" FROM "temporary_document"`);
        await queryRunner.query(`DROP TABLE "temporary_document"`);
    }
}
