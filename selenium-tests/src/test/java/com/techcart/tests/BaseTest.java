package com.techcart.tests;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.BeforeSuite;

/**
 * BaseTest provides WebDriver setup and teardown logic.
 * Every test class should extend BaseTest to reuse browser management code.
 */
public class BaseTest {
    protected WebDriver driver;

    @BeforeSuite
    public void setupSuite() {
        // Automatically download and configure the driver binary matching the browser version
        WebDriverManager.chromedriver().setup();
    }

    @BeforeMethod
    public void setUp() {
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--start-maximized");
        options.addArguments("--disable-notifications");
        
        // Headless execution option (can be enabled as needed)
        // options.addArguments("--headless");

        driver = new ChromeDriver(options);
    }

    @AfterMethod
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}
