using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RecordTracker.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class RenameRecordTypeToRecord : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RecordField_RecordType_RecordTypeId",
                table: "RecordField");

            migrationBuilder.DropForeignKey(
                name: "FK_RecordItem_RecordType_RecordTypeId",
                table: "RecordItem");

            migrationBuilder.DropTable(
                name: "RecordType");

            migrationBuilder.RenameColumn(
                name: "RecordTypeId",
                table: "RecordItem",
                newName: "RecordId");

            migrationBuilder.RenameIndex(
                name: "IX_RecordItem_RecordTypeId",
                table: "RecordItem",
                newName: "IX_RecordItem_RecordId");

            migrationBuilder.RenameColumn(
                name: "RecordTypeId",
                table: "RecordField",
                newName: "RecordId");

            migrationBuilder.RenameIndex(
                name: "IX_RecordField_RecordTypeId",
                table: "RecordField",
                newName: "IX_RecordField_RecordId");

            migrationBuilder.CreateTable(
                name: "Record",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    CreatedByUserId = table.Column<Guid>(type: "uuid", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DeletedByUserId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Record", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Record_User_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Record_User_DeletedByUserId",
                        column: x => x.DeletedByUserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Record_CreatedByUserId",
                table: "Record",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Record_DeletedByUserId",
                table: "Record",
                column: "DeletedByUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_RecordField_Record_RecordId",
                table: "RecordField",
                column: "RecordId",
                principalTable: "Record",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_RecordItem_Record_RecordId",
                table: "RecordItem",
                column: "RecordId",
                principalTable: "Record",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RecordField_Record_RecordId",
                table: "RecordField");

            migrationBuilder.DropForeignKey(
                name: "FK_RecordItem_Record_RecordId",
                table: "RecordItem");

            migrationBuilder.DropTable(
                name: "Record");

            migrationBuilder.RenameColumn(
                name: "RecordId",
                table: "RecordItem",
                newName: "RecordTypeId");

            migrationBuilder.RenameIndex(
                name: "IX_RecordItem_RecordId",
                table: "RecordItem",
                newName: "IX_RecordItem_RecordTypeId");

            migrationBuilder.RenameColumn(
                name: "RecordId",
                table: "RecordField",
                newName: "RecordTypeId");

            migrationBuilder.RenameIndex(
                name: "IX_RecordField_RecordId",
                table: "RecordField",
                newName: "IX_RecordField_RecordTypeId");

            migrationBuilder.CreateTable(
                name: "RecordType",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedByUserId = table.Column<Guid>(type: "uuid", nullable: false),
                    DeletedByUserId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RecordType", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RecordType_User_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RecordType_User_DeletedByUserId",
                        column: x => x.DeletedByUserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RecordType_CreatedByUserId",
                table: "RecordType",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_RecordType_DeletedByUserId",
                table: "RecordType",
                column: "DeletedByUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_RecordField_RecordType_RecordTypeId",
                table: "RecordField",
                column: "RecordTypeId",
                principalTable: "RecordType",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_RecordItem_RecordType_RecordTypeId",
                table: "RecordItem",
                column: "RecordTypeId",
                principalTable: "RecordType",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
