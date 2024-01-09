let lastRequestTime = 0;
const requestInterval = 20000; // 20 seconds

async function applyStyle() {
    let now = new Date().getTime();
    if (now - lastRequestTime < requestInterval) {
        console.log('Waiting to meet API rate limit...');
        return; // Skip this request or implement a queue to handle it later
    }

    lastRequestTime = now;

    let prompt = document.getElementById('stylePrompt').value;
    let cssStyle = await getCSSFromGPT(prompt);

    // Apply the style to your content
    document.getElementById('content').style = cssStyle;

    // Display the generated output
    document.getElementById('output').textContent = `Generated CSS: ${cssStyle}`;
}


async function getCSSFromGPT(prompt, retries = 3) {
    const apiKey = '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'; // Replace with your actual API key

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                messages: [
                    {"role": "system", "content": "You are a helpful assistant designed to output CSS in JSON format."},
                    {"role": "user", "content": prompt}
                ],
                model: "gpt-3.5-turbo",
                response_format: { "type": "json_object" }
            })
        });

        if (!response.ok) {
            if (response.status === 429) {
                console.error("API request rate limit reached. Please try again later.");
                alert("API request limit reached. Please wait a bit and try again.");
            } else {
                console.error("API request failed:", response.status, response.statusText);
            }
            return ''; // Return a default or empty string if the API call fails
        }

        const data = await response.json();
        // Assuming the response contains CSS in a JSON object format
        return data.choices[0].message.content.trim();
    } catch (error) {
        console.error("Error in getCSSFromGPT:", error);
        return ''; // Return a default or empty string in case of an error
    }
}






/*
const apiKey = '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'; // Replace with your actual API key

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                messages: [
                    {"role": "system", "content": "You are a helpful assistant that provides CSS styling advice. Output only the css code, and apply it to body, h1, h2, and p tags."},
                    {"role": "user", "content": prompt}
                ],
                model: "gpt-3.5-turbo"
            })
        }); */