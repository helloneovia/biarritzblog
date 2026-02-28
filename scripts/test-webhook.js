// Using native Node.js fetch
const mockEvent = {
    type: "checkout.session.completed",
    data: {
        object: {
            id: "cs_test_mocked_123456",
            amount_total: 4999,
            customer_details: {
                email: "test_customer@example.com",
                name: "John Doe",
                address: {
                    line1: "123 Main St",
                    city: "Paris",
                    postal_code: "75001",
                    country: "FR"
                }
            },
            metadata: {
                items: JSON.stringify([
                    { id: "cm7gttckp0001y1n8g67lpsg9", size: "EU 39-44", q: 2 } // Mock product DB ID, doesn't matter much for testing saving
                ])
            }
        }
    }
};

async function testWebhook() {
    try {
        const res = await fetch("http://localhost:3000/api/webhooks/stripe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(mockEvent)
        });

        const data = await res.json();
        console.log("Response:", res.status, data);
    } catch (e) {
        console.error("Fetch error:", e);
    }
}

testWebhook();
