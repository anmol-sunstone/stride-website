exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the request body
    const { email, userAgent } = JSON.parse(event.body);

    // Get the real IP address from Netlify headers
    const ip = event.headers['x-forwarded-for'] ||
               event.headers['x-real-ip'] ||
               context.ip ||
               'Unknown';

    // Forward to Google Sheets
    const response = await fetch(
      'https://script.google.com/macros/s/AKfycbzRw7QTS9oKnm0gVTNRqAiXgOzljDk5JefFtIwaNHXh_dHePCbYwkAr3tE6aynVvbHuCg/exec',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          userAgent: userAgent,
          ip: ip
        })
      }
    );

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify(data)
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: 'Server error: ' + error.message
      })
    };
  }
};
