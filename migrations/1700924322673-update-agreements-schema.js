const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class UpdateAgreementsSchema1700924322673 {
    name = 'UpdateAgreementsSchema1700924322673'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "temporary_agreement" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "documentId" integer, "requestId" integer NOT NULL, "docId" integer NOT NULL, CONSTRAINT "UQ_0e5922013f1342a781e331b3be9" UNIQUE ("documentId"), CONSTRAINT "FK_059546e11fe51714faecc204eea" FOREIGN KEY ("documentId") REFERENCES "document" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_agreement"("id", "documentId", "requestId", "docId") SELECT "id", "documentId", "requestId", "doc1Id" FROM "agreement"`);
        await queryRunner.query(`DROP TABLE "agreement"`);
        await queryRunner.query(`ALTER TABLE "temporary_agreement" RENAME TO "agreement"`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "agreement" RENAME TO "temporary_agreement"`);
        await queryRunner.query(`CREATE TABLE "agreement" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "documentId" integer, "requestId" integer NOT NULL, "doc1Id" integer NOT NULL, CONSTRAINT "UQ_0e5922013f1342a781e331b3be9" UNIQUE ("documentId"), CONSTRAINT "FK_059546e11fe51714faecc204eea" FOREIGN KEY ("documentId") REFERENCES "document" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "agreement"("id", "documentId", "requestId", "doc1Id") SELECT "id", "documentId", "requestId", "docId" FROM "temporary_agreement"`);
        await queryRunner.query(`DROP TABLE "temporary_agreement"`);
    }
}
