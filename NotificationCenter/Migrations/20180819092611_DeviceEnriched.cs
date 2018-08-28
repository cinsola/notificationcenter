using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace NotificationCenter.Migrations
{
    public partial class DeviceEnriched : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Browser",
                table: "Subscriptions",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BrowserVersion",
                table: "Subscriptions",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Platform",
                table: "Subscriptions",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PlatformVersion",
                table: "Subscriptions",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Browser",
                table: "Subscriptions");

            migrationBuilder.DropColumn(
                name: "BrowserVersion",
                table: "Subscriptions");

            migrationBuilder.DropColumn(
                name: "Platform",
                table: "Subscriptions");

            migrationBuilder.DropColumn(
                name: "PlatformVersion",
                table: "Subscriptions");
        }
    }
}
