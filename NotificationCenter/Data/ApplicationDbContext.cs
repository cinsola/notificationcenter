using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.EntityFrameworkCore.Infrastructure;
using NotificationCenter.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NotificationCenter.Data
{
    public class ApplicationDbContext : DbContext
    {
        public DbSet<Subscription> Subscriptions { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Tag> Tags { get; set; }

        public DbSet<SubscriptionTags> SubscriptionGroups { get; set; }
        public DbSet<NotificationTags> NotificationTags { get; set; }
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Tag>().HasIndex(u => u.TagName).IsUnique();

            modelBuilder.Entity<SubscriptionTags>()
                        .HasKey(t => new { t.TagId, t.SubscriptionId });
            modelBuilder.Entity<NotificationTags>()
                        .HasKey(t => new { t.NotificationId, t.TagId });
            base.OnModelCreating(modelBuilder);
        }
    }
}
