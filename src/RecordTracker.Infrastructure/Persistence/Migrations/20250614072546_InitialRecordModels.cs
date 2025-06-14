using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RecordTracker.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class InitialRecordModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RecordType",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    CreatedByUserId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RecordType", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RecordType_Users_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "RecordField",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    FieldType = table.Column<int>(type: "integer", nullable: false),
                    IsRequired = table.Column<bool>(type: "boolean", nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    RecordTypeId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RecordField", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RecordField_RecordType_RecordTypeId",
                        column: x => x.RecordTypeId,
                        principalTable: "RecordType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RecordItem",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    RecordTypeId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedByUserId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RecordItem", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RecordItem_RecordType_RecordTypeId",
                        column: x => x.RecordTypeId,
                        principalTable: "RecordType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RecordItem_Users_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "RecordValue",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Value = table.Column<string>(type: "text", nullable: false),
                    RecordItemId = table.Column<Guid>(type: "uuid", nullable: false),
                    RecordFieldId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RecordValue", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RecordValue_RecordField_RecordFieldId",
                        column: x => x.RecordFieldId,
                        principalTable: "RecordField",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RecordValue_RecordItem_RecordItemId",
                        column: x => x.RecordItemId,
                        principalTable: "RecordItem",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RecordField_RecordTypeId",
                table: "RecordField",
                column: "RecordTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_RecordItem_CreatedByUserId",
                table: "RecordItem",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_RecordItem_RecordTypeId",
                table: "RecordItem",
                column: "RecordTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_RecordType_CreatedByUserId",
                table: "RecordType",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_RecordValue_RecordFieldId",
                table: "RecordValue",
                column: "RecordFieldId");

            migrationBuilder.CreateIndex(
                name: "IX_RecordValue_RecordItemId",
                table: "RecordValue",
                column: "RecordItemId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RecordValue");

            migrationBuilder.DropTable(
                name: "RecordField");

            migrationBuilder.DropTable(
                name: "RecordItem");

            migrationBuilder.DropTable(
                name: "RecordType");
        }
    }
}
