package com.techcart.tests;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.time.Duration;

public class LoginTest extends BaseTest {

    @Test
    public void testRegistrationPageNavigation() {
        // Navigate to the TechCart application (default local Vite port)
        driver.get("http://localhost:5173");

        // Set up explicit wait
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        // Verify the title is present or page header exists
        WebElement logo = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//h1[contains(text(),'TechCart')]")));
        Assert.assertTrue(logo.isDisplayed(), "TechCart application header should be visible.");

        // Click on the Register navigation button
        WebElement registerTabButton = driver.findElement(By.xpath("//button[text()='Register']"));
        registerTabButton.click();

        // Verify registration form loads successfully
        WebElement registrationHeader = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//h2[text()='Register']")));
        Assert.assertTrue(registrationHeader.isDisplayed(), "Registration form header should be visible.");

        // Find input elements
        WebElement usernameInput = driver.findElement(By.name("username"));
        WebElement emailInput = driver.findElement(By.name("email"));
        WebElement passwordInput = driver.findElement(By.name("password"));
        WebElement registerBtn = driver.findElement(By.id("register-btn-v2"));

        // Verify all elements are enabled
        Assert.assertTrue(usernameInput.isEnabled(), "Username input should be enabled.");
        Assert.assertTrue(emailInput.isEnabled(), "Email input should be enabled.");
        Assert.assertTrue(passwordInput.isEnabled(), "Password input should be enabled.");
        Assert.assertTrue(registerBtn.isEnabled(), "Register button should be enabled.");
    }
}
