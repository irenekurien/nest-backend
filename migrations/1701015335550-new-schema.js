const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class NewSchema1701015335550 {
    name = 'NewSchema1701015335550'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "isAdmin" boolean NOT NULL DEFAULT (0))`);
        await queryRunner.query(`CREATE TABLE "recipient" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "isSigned" boolean NOT NULL, "signLink" varchar NOT NULL, "userId" integer, "agreement1Id" integer, "agreement2Id" integer, CONSTRAINT "REL_5a963766fc36e9c281d56c60d1" UNIQUE ("agreement1Id"), CONSTRAINT "REL_37ec52851e71fa347a5c0d9a41" UNIQUE ("agreement2Id"))`);
        await queryRunner.query(`CREATE TABLE "agreement" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "requestId" integer NOT NULL, "certificateLink" varchar, "recipient1Id" integer, "recipient2Id" integer, CONSTRAINT "REL_8df851209337317de2a56048f2" UNIQUE ("recipient1Id"), CONSTRAINT "REL_47fd22393870867e4ef27b0872" UNIQUE ("recipient2Id"))`);
        await queryRunner.query(`CREATE TABLE "temporary_recipient" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "isSigned" boolean NOT NULL, "signLink" varchar NOT NULL, "userId" integer, "agreement1Id" integer, "agreement2Id" integer, CONSTRAINT "REL_5a963766fc36e9c281d56c60d1" UNIQUE ("agreement1Id"), CONSTRAINT "REL_37ec52851e71fa347a5c0d9a41" UNIQUE ("agreement2Id"), CONSTRAINT "FK_0df02885203e3466256b1424fc3" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_5a963766fc36e9c281d56c60d1f" FOREIGN KEY ("agreement1Id") REFERENCES "agreement" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_37ec52851e71fa347a5c0d9a41a" FOREIGN KEY ("agreement2Id") REFERENCES "agreement" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_recipient"("id", "isSigned", "signLink", "userId", "agreement1Id", "agreement2Id") SELECT "id", "isSigned", "signLink", "userId", "agreement1Id", "agreement2Id" FROM "recipient"`);
        await queryRunner.query(`DROP TABLE "recipient"`);
        await queryRunner.query(`ALTER TABLE "temporary_recipient" RENAME TO "recipient"`);
        await queryRunner.query(`CREATE TABLE "temporary_agreement" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "requestId" integer NOT NULL, "certificateLink" varchar, "recipient1Id" integer, "recipient2Id" integer, CONSTRAINT "REL_8df851209337317de2a56048f2" UNIQUE ("recipient1Id"), CONSTRAINT "REL_47fd22393870867e4ef27b0872" UNIQUE ("recipient2Id"), CONSTRAINT "FK_8df851209337317de2a56048f20" FOREIGN KEY ("recipient1Id") REFERENCES "recipient" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_47fd22393870867e4ef27b08729" FOREIGN KEY ("recipient2Id") REFERENCES "recipient" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_agreement"("id", "requestId", "certificateLink", "recipient1Id", "recipient2Id") SELECT "id", "requestId", "certificateLink", "recipient1Id", "recipient2Id" FROM "agreement"`);
        await queryRunner.query(`DROP TABLE "agreement"`);
        await queryRunner.query(`ALTER TABLE "temporary_agreement" RENAME TO "agreement"`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "agreement" RENAME TO "temporary_agreement"`);
        await queryRunner.query(`CREATE TABLE "agreement" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "requestId" integer NOT NULL, "certificateLink" varchar, "recipient1Id" integer, "recipient2Id" integer, CONSTRAINT "REL_8df851209337317de2a56048f2" UNIQUE ("recipient1Id"), CONSTRAINT "REL_47fd22393870867e4ef27b0872" UNIQUE ("recipient2Id"))`);
        await queryRunner.query(`INSERT INTO "agreement"("id", "requestId", "certificateLink", "recipient1Id", "recipient2Id") SELECT "id", "requestId", "certificateLink", "recipient1Id", "recipient2Id" FROM "temporary_agreement"`);
        await queryRunner.query(`DROP TABLE "temporary_agreement"`);
        await queryRunner.query(`ALTER TABLE "recipient" RENAME TO "temporary_recipient"`);
        await queryRunner.query(`CREATE TABLE "recipient" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "isSigned" boolean NOT NULL, "signLink" varchar NOT NULL, "userId" integer, "agreement1Id" integer, "agreement2Id" integer, CONSTRAINT "REL_5a963766fc36e9c281d56c60d1" UNIQUE ("agreement1Id"), CONSTRAINT "REL_37ec52851e71fa347a5c0d9a41" UNIQUE ("agreement2Id"))`);
        await queryRunner.query(`INSERT INTO "recipient"("id", "isSigned", "signLink", "userId", "agreement1Id", "agreement2Id") SELECT "id", "isSigned", "signLink", "userId", "agreement1Id", "agreement2Id" FROM "temporary_recipient"`);
        await queryRunner.query(`DROP TABLE "temporary_recipient"`);
        await queryRunner.query(`DROP TABLE "agreement"`);
        await queryRunner.query(`DROP TABLE "recipient"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }
}
