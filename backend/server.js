const app = require('./src/app');

const port = process.env.PORT || 5000;

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Backend server running on http://localhost:${port}`);
    });
}

module.exports = app;
