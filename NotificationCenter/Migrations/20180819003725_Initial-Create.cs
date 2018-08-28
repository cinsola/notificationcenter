using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace NotificationCenter.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Notifications",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    IsDeleted = table.Column<bool>(nullable: false),
                    LastUpdate = table.Column<DateTime>(nullable: true),
                    NotificationIcon = table.Column<string>(nullable: true),
                    NotificationImage = table.Column<string>(nullable: true),
                    NotificationLink = table.Column<string>(nullable: true),
                    NotificationLinkIcon = table.Column<string>(nullable: true),
                    NotificationLinkTitle = table.Column<string>(nullable: true),
                    NotificationName = table.Column<string>(maxLength: 50, nullable: false),
                    NotificationText = table.Column<string>(maxLength: 180, nullable: false),
                    NotificationTitle = table.Column<string>(maxLength: 50, nullable: false),
                    SetupAt = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notifications", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "NotificationsGroup",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    IsDeleted = table.Column<bool>(nullable: false),
                    LastUpdate = table.Column<DateTime>(nullable: true),
                    SetupAt = table.Column<DateTime>(nullable: false),
                    TagName = table.Column<string>(maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NotificationsGroup", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Subscriptions",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Auth = table.Column<string>(nullable: true),
                    Code = table.Column<string>(nullable: true),
                    Device = table.Column<string>(nullable: true),
                    EndPoint = table.Column<string>(nullable: true),
                    ExpirationTime = table.Column<DateTime>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    LastUpdate = table.Column<DateTime>(nullable: true),
                    SetupAt = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Subscriptions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "NotificationTags",
                columns: table => new
                {
                    NotificationId = table.Column<int>(nullable: false),
                    TagId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NotificationTags", x => new { x.NotificationId, x.TagId });
                    table.ForeignKey(
                        name: "FK_NotificationTags_Notifications_NotificationId",
                        column: x => x.NotificationId,
                        principalTable: "Notifications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_NotificationTags_NotificationsGroup_TagId",
                        column: x => x.TagId,
                        principalTable: "NotificationsGroup",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SubscriptionGroups",
                columns: table => new
                {
                    NotificationGroupId = table.Column<int>(nullable: false),
                    SubscriptionId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SubscriptionGroups", x => new { x.NotificationGroupId, x.SubscriptionId });
                    table.ForeignKey(
                        name: "FK_SubscriptionGroups_NotificationsGroup_NotificationGroupId",
                        column: x => x.NotificationGroupId,
                        principalTable: "NotificationsGroup",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SubscriptionGroups_Subscriptions_SubscriptionId",
                        column: x => x.SubscriptionId,
                        principalTable: "Subscriptions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_NotificationTags_TagId",
                table: "NotificationTags",
                column: "TagId");

            migrationBuilder.CreateIndex(
                name: "IX_SubscriptionGroups_SubscriptionId",
                table: "SubscriptionGroups",
                column: "SubscriptionId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "NotificationTags");

            migrationBuilder.DropTable(
                name: "SubscriptionGroups");

            migrationBuilder.DropTable(
                name: "Notifications");

            migrationBuilder.DropTable(
                name: "NotificationsGroup");

            migrationBuilder.DropTable(
                name: "Subscriptions");
        }
    }
}
