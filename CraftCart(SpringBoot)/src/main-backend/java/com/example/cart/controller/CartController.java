package com.example.cart.controller;

import org.springframework.web.bind.annotation.*;

import com.example.cart.model.CartItem;

import java.util.LinkedList;
import java.util.List;
import java.util.Iterator;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*") // Allow frontend access (optional config for CORS)
public class CartController {

    private final LinkedList<CartItem> cart = new LinkedList<>();

    @PostMapping("/add")
    public String addItem(@RequestBody CartItem item) {
        cart.add(item);
        return "Item added to cart.";
    }

    // View all cart items
    @GetMapping
    public List<CartItem> getCartItems() {
        return cart;
    }

    // Remove item from cart by title
    @DeleteMapping("/remove/{title}")
    public String removeItem(@PathVariable String title) {
        Iterator<CartItem> iterator = cart.iterator();
        while (iterator.hasNext()) {
            CartItem item = iterator.next();
            if (item.getTitle().equalsIgnoreCase(title)) {
                iterator.remove();
                return "Item removed from cart.";
            }
        }
        return "Item not found in cart.";
    }
}
