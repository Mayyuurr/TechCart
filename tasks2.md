Open your main Express server file (usually server.js or app.js) and add this route. We will use an asynchronous, non-blocking delay to simulate heavy network latency or slow database lookups:
// SIMULATED BOTTLENECK ENDPOINT FOR PERFORMANCE DEMO
app.get('/api/products/heavy-search', (req, res) => {
    // We use setTimeout to mimic a slow, unoptimized database lookup
    setTimeout(() => {
        // Mock data to return once the "heavy query" finishes
        const mockHeavyResults = [
            { id: 101, name: "Premium Mechanical Keyboard", price: 129.99, category: "Accessories" },
            { id: 102, name: "Ultra-Wide Gaming Monitor", price: 349.99, category: "Electronics" },
            { id: 103, name: "Wireless Ergonomic Mouse", price: 59.99, category: "Accessories" }
        ];

        res.status(200).json({
            status: "Success",
            results: mockHeavyResults.length,
            data: mockHeavyResults
        });
    }, 1500); // 1.5-second artificial delay
});