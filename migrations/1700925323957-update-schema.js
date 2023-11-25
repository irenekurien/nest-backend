const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class UpdateSchema1700925323957 {
    name = 'UpdateSchema1700925323957'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "isAdmin" boolean NOT NULL DEFAULT (0))`);
        await queryRunner.query(`CREATE TABLE "recipient" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "isSigned" boolean NOT NULL, "signLink" varchar NOT NULL, "userId" integer, "agreementId" integer)`);
        await queryRunner.query(`CREATE TABLE "document" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "link" varchar NOT NULL, "agreementId" integer, CONSTRAINT "REL_01ff53c98ad85454ea5d8b6a96" UNIQUE ("agreementId"))`);
        await queryRunner.query(`CREATE TABLE "agreement" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "requestId" integer NOT NULL, "docId" integer NOT NULL, "documentId" integer, CONSTRAINT "REL_059546e11fe51714faecc204ee" UNIQUE ("documentId"))`);
        await queryRunner.query(`CREATE TABLE "temporary_recipient" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "isSigned" boolean NOT NULL, "signLink" varchar NOT NULL, "userId" integer, "agreementId" integer, CONSTRAINT "FK_0df02885203e3466256b1424fc3" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_0479d7ae6369c3e2a851d5f285f" FOREIGN KEY ("agreementId") REFERENCES "agreement" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_recipient"("id", "isSigned", "signLink", "userId", "agreementId") SELECT "id", "isSigned", "signLink", "userId", "agreementId" FROM "recipient"`);
        await queryRunner.query(`DROP TABLE "recipient"`);
        await queryRunner.query(`ALTER TABLE "temporary_recipient" RENAME TO "recipient"`);
        await queryRunner.query(`CREATE TABLE "temporary_document" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "link" varchar NOT NULL, "agreementId" integer, CONSTRAINT "REL_01ff53c98ad85454ea5d8b6a96" UNIQUE ("agreementId"), CONSTRAINT "FK_01ff53c98ad85454ea5d8b6a966" FOREIGN KEY ("agreementId") REFERENCES "agreement" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_document"("id", "link", "agreementId") SELECT "id", "link", "agreementId" FROM "document"`);
        await queryRunner.query(`DROP TABLE "document"`);
        await queryRunner.query(`ALTER TABLE "temporary_document" RENAME TO "document"`);
        await queryRunner.query(`CREATE TABLE "temporary_agreement" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "requestId" integer NOT NULL, "docId" integer NOT NULL, "documentId" integer, CONSTRAINT "REL_059546e11fe51714faecc204ee" UNIQUE ("documentId"), CONSTRAINT "FK_059546e11fe51714faecc204eea" FOREIGN KEY ("documentId") REFERENCES "document" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_agreement"("id", "requestId", "docId", "documentId") SELECT "id", "requestId", "docId", "documentId" FROM "agreement"`);
        await queryRunner.query(`DROP TABLE "agreement"`);
        await queryRunner.query(`ALTER TABLE "temporary_agreement" RENAME TO "agreement"`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "agreement" RENAME TO "temporary_agreement"`);
        await queryRunner.query(`CREATE TABLE "agreement" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "requestId" integer NOT NULL, "docId" integer NOT NULL, "documentId" integer, CONSTRAINT "REL_059546e11fe51714faecc204ee" UNIQUE ("documentId"))`);
        await queryRunner.query(`INSERT INTO "agreement"("id", "requestId", "docId", "documentId") SELECT "id", "requestId", "docId", "documentId" FROM "temporary_agreement"`);
        await queryRunner.query(`DROP TABLE "temporary_agreement"`);
        await queryRunner.query(`ALTER TABLE "document" RENAME TO "temporary_document"`);
        await queryRunner.query(`CREATE TABLE "document" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "link" varchar NOT NULL, "agreementId" integer, CONSTRAINT "REL_01ff53c98ad85454ea5d8b6a96" UNIQUE ("agreementId"))`);
        await queryRunner.query(`INSERT INTO "document"("id", "link", "agreementId") SELECT "id", "link", "agreementId" FROM "temporary_document"`);
        await queryRunner.query(`DROP TABLE "temporary_document"`);
        await queryRunner.query(`ALTER TABLE "recipient" RENAME TO "temporary_recipient"`);
        await queryRunner.query(`CREATE TABLE "recipient" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "isSigned" boolean NOT NULL, "signLink" varchar NOT NULL, "userId" integer, "agreementId" integer)`);
        await queryRunner.query(`INSERT INTO "recipient"("id", "isSigned", "signLink", "userId", "agreementId") SELECT "id", "isSigned", "signLink", "userId", "agreementId" FROM "temporary_recipient"`);
        await queryRunner.query(`DROP TABLE "temporary_recipient"`);
        await queryRunner.query(`DROP TABLE "agreement"`);
        await queryRunner.query(`DROP TABLE "document"`);
        await queryRunner.query(`DROP TABLE "recipient"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }
}
