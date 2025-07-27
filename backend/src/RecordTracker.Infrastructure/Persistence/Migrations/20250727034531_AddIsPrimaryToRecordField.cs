using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RecordTracker.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddIsPrimaryToRecordField : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsPrimary",
                table: "RecordField",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsPrimary",
                table: "RecordField");
        }
    }
}
