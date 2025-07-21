package com.example.cart.model;
public class CartItem {
    private String title;
    private String image;
    private double price;

    public CartItem() {}

    public CartItem(String title, String image, double price) {
        this.title = title;
        this.image = image;
        this.price = price;
    }

    // Getters and Setters
    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }

    public String getImage() {
        return image;
    }
    public void setImage(String image) {
        this.image = image;
    }

    public double getPrice() {
        return price;
    }
    public void setPrice(double price) {
        this.price = price;
    }
}
