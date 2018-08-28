using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace NotificationCenter.Migrations
{
    public partial class Refactor2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SubscriptionGroups_Tags_NotificationGroupId",
                table: "SubscriptionGroups");

            migrationBuilder.RenameColumn(
                name: "NotificationGroupId",
                table: "SubscriptionGroups",
                newName: "TagId");

            migrationBuilder.AddForeignKey(
                name: "FK_SubscriptionGroups_Tags_TagId",
                table: "SubscriptionGroups",
                column: "TagId",
                principalTable: "Tags",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SubscriptionGroups_Tags_TagId",
                table: "SubscriptionGroups");

            migrationBuilder.RenameColumn(
                name: "TagId",
                table: "SubscriptionGroups",
                newName: "NotificationGroupId");

            migrationBuilder.AddForeignKey(
                name: "FK_SubscriptionGroups_Tags_NotificationGroupId",
                table: "SubscriptionGroups",
                column: "NotificationGroupId",
                principalTable: "Tags",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
