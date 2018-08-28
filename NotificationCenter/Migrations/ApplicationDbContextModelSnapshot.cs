﻿// <auto-generated />
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.EntityFrameworkCore.Storage.Internal;
using NotificationCenter.Data;
using System;

namespace NotificationCenter.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    partial class ApplicationDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.0.3-rtm-10026")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("NotificationCenter.Models.Notification", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<bool>("IsDeleted");

                    b.Property<DateTime?>("LastUpdate");

                    b.Property<string>("NotificationIcon");

                    b.Property<string>("NotificationImage");

                    b.Property<string>("NotificationLink");

                    b.Property<string>("NotificationLinkIcon");

                    b.Property<string>("NotificationLinkTitle");

                    b.Property<string>("NotificationName")
                        .IsRequired()
                        .HasMaxLength(50);

                    b.Property<string>("NotificationText")
                        .IsRequired()
                        .HasMaxLength(180);

                    b.Property<string>("NotificationTitle")
                        .IsRequired()
                        .HasMaxLength(50);

                    b.Property<DateTime>("SetupAt");

                    b.HasKey("Id");

                    b.ToTable("Notifications");
                });

            modelBuilder.Entity("NotificationCenter.Models.NotificationTags", b =>
                {
                    b.Property<int>("NotificationId");

                    b.Property<int>("TagId");

                    b.HasKey("NotificationId", "TagId");

                    b.HasIndex("TagId");

                    b.ToTable("NotificationTags");
                });

            modelBuilder.Entity("NotificationCenter.Models.Subscription", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Auth");

                    b.Property<string>("Browser");

                    b.Property<string>("BrowserVersion");

                    b.Property<string>("Code");

                    b.Property<string>("Description");

                    b.Property<string>("Device");

                    b.Property<string>("EndPoint");

                    b.Property<DateTime?>("ExpirationTime");

                    b.Property<bool>("IsDeleted");

                    b.Property<bool>("IsDisabled");

                    b.Property<DateTime?>("LastUpdate");

                    b.Property<string>("Platform");

                    b.Property<string>("PlatformVersion");

                    b.Property<DateTime>("SetupAt");

                    b.HasKey("Id");

                    b.ToTable("Subscriptions");
                });

            modelBuilder.Entity("NotificationCenter.Models.SubscriptionTags", b =>
                {
                    b.Property<int>("TagId");

                    b.Property<int>("SubscriptionId");

                    b.HasKey("TagId", "SubscriptionId");

                    b.HasIndex("SubscriptionId");

                    b.ToTable("SubscriptionGroups");
                });

            modelBuilder.Entity("NotificationCenter.Models.Tag", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<bool>("IsDeleted");

                    b.Property<DateTime?>("LastUpdate");

                    b.Property<DateTime>("SetupAt");

                    b.Property<string>("TagName")
                        .IsRequired()
                        .HasMaxLength(50);

                    b.HasKey("Id");

                    b.HasIndex("TagName")
                        .IsUnique();

                    b.ToTable("Tags");
                });

            modelBuilder.Entity("NotificationCenter.Models.NotificationTags", b =>
                {
                    b.HasOne("NotificationCenter.Models.Notification")
                        .WithMany("Tags")
                        .HasForeignKey("NotificationId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("NotificationCenter.Models.Tag", "Tag")
                        .WithMany("Notifications")
                        .HasForeignKey("TagId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("NotificationCenter.Models.SubscriptionTags", b =>
                {
                    b.HasOne("NotificationCenter.Models.Subscription")
                        .WithMany("Tags")
                        .HasForeignKey("SubscriptionId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("NotificationCenter.Models.Tag", "Tag")
                        .WithMany("Subscriptions")
                        .HasForeignKey("TagId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
#pragma warning restore 612, 618
        }
    }
}
