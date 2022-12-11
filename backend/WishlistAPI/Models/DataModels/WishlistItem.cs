﻿using System.ComponentModel.DataAnnotations;

namespace WishlistAPI.Models.DataModels
{
    public class WishlistItem
    {
        [Key]
        public int ProductId { get; set; }
        public string Note { get; set; } = string.Empty;
        public DateTime AddedOn { get; set; } = DateTime.Now;

    }
}
