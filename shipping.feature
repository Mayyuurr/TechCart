Feature: TechCart Checkout Free Shipping

Scenario: Apply free shipping for orders strictly above %50
    Given User has added items to their TechCart
    AND the cart total is exactly $55
    When User Proceed to Checkout page
    Then shipping fee Calculated as $0.00
    AND total cost should remain $55.00