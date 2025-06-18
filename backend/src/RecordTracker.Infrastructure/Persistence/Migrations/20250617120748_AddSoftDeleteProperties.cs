using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RecordTracker.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddSoftDeleteProperties : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "DeactivatedAt",
                table: "User",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                table: "RecordType",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "DeletedByUserId",
                table: "RecordType",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "RecordType",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                table: "RecordItem",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "DeletedByUserId",
                table: "RecordItem",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "RecordItem",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "RecordField",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_RecordType_DeletedByUserId",
                table: "RecordType",
                column: "DeletedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_RecordItem_DeletedByUserId",
                table: "RecordItem",
                column: "DeletedByUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_RecordItem_User_DeletedByUserId",
                table: "RecordItem",
                column: "DeletedByUserId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_RecordType_User_DeletedByUserId",
                table: "RecordType",
                column: "DeletedByUserId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RecordItem_User_DeletedByUserId",
                table: "RecordItem");

            migrationBuilder.DropForeignKey(
                name: "FK_RecordType_User_DeletedByUserId",
                table: "RecordType");

            migrationBuilder.DropIndex(
                name: "IX_RecordType_DeletedByUserId",
                table: "RecordType");

            migrationBuilder.DropIndex(
                name: "IX_RecordItem_DeletedByUserId",
                table: "RecordItem");

            migrationBuilder.DropColumn(
                name: "DeactivatedAt",
                table: "User");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "RecordType");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                table: "RecordType");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "RecordType");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "RecordItem");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                table: "RecordItem");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "RecordItem");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "RecordField");
        }
    }
}
