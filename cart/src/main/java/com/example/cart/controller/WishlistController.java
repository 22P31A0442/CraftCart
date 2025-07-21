package com.example.cart.controller;

import org.springframework.web.bind.annotation.*;
import com.example.cart.model.CartItem;

import java.util.LinkedList;
import java.util.List;
import java.util.Iterator;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = "*")
public class WishlistController {

    private final LinkedList<CartItem> wishlist = new LinkedList<>();

    // Add item to wishlist
    @PostMapping("/add")
    public String addItem(@RequestBody CartItem item) {
        wishlist.add(item);
        return "Item added to wishlist.";
    }

    // View all wishlist items
    @GetMapping
    public List<CartItem> getWishlistItems() {
        return wishlist;
    }

    // Remove item from wishlist by title
    @DeleteMapping("/remove/{title}")
    public String removeItem(@PathVariable String title) {
        Iterator<CartItem> iterator = wishlist.iterator();
        while (iterator.hasNext()) {
            CartItem item = iterator.next();
            if (item.getTitle().equalsIgnoreCase(title)) {
                iterator.remove();
                return "Item removed from wishlist.";
            }
        }
        return "Item not found in wishlist.";
    }
}
