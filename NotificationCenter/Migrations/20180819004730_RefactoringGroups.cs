using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace NotificationCenter.Migrations
{
    public partial class RefactoringGroups : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_NotificationTags_NotificationsGroup_TagId",
                table: "NotificationTags");

            migrationBuilder.DropForeignKey(
                name: "FK_SubscriptionGroups_NotificationsGroup_NotificationGroupId",
                table: "SubscriptionGroups");

            migrationBuilder.DropPrimaryKey(
                name: "PK_NotificationsGroup",
                table: "NotificationsGroup");

            migrationBuilder.RenameTable(
                name: "NotificationsGroup",
                newName: "Tags");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Tags",
                table: "Tags",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_NotificationTags_Tags_TagId",
                table: "NotificationTags",
                column: "TagId",
                principalTable: "Tags",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SubscriptionGroups_Tags_NotificationGroupId",
                table: "SubscriptionGroups",
                column: "NotificationGroupId",
                principalTable: "Tags",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_NotificationTags_Tags_TagId",
                table: "NotificationTags");

            migrationBuilder.DropForeignKey(
                name: "FK_SubscriptionGroups_Tags_NotificationGroupId",
                table: "SubscriptionGroups");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Tags",
                table: "Tags");

            migrationBuilder.RenameTable(
                name: "Tags",
                newName: "NotificationsGroup");

            migrationBuilder.AddPrimaryKey(
                name: "PK_NotificationsGroup",
                table: "NotificationsGroup",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_NotificationTags_NotificationsGroup_TagId",
                table: "NotificationTags",
                column: "TagId",
                principalTable: "NotificationsGroup",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SubscriptionGroups_NotificationsGroup_NotificationGroupId",
                table: "SubscriptionGroups",
                column: "NotificationGroupId",
                principalTable: "NotificationsGroup",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
