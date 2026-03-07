exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
    }

    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json",
    };

    try {
        const { email } = JSON.parse(event.body);

        if (!email || !email.includes("@")) {
            return { statusCode: 400, headers, body: JSON.stringify({ error: "بريد غير صالح" }) };
        }

        const API_KEY = process.env.BEEHIIV_API_KEY;
        const PUB_ID = process.env.BEEHIIV_PUB_ID;

        const response = await fetch(
            `https://api.beehiiv.com/v2/publications/${PUB_ID}/subscriptions`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${API_KEY}`,
                },
                body: JSON.stringify({
                    email,
                    reactivate_existing: true,
                    send_welcome_email: true,
                    utm_source: "shafrh_website",
                    utm_medium: "landing_page",
                    referring_site: "https://shafrh.com",
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return { statusCode: response.status, headers, body: JSON.stringify({ error: data.message || "خطأ" }) };
        }

        return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    } catch (err) {
        return { statusCode: 500, headers, body: JSON.stringify({ error: "خطأ غير متوقع" }) };
    }
};