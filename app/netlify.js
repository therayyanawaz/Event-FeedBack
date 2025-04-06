// Netlify Functions handler for Next.js API routes
exports.handler = async (event, context) => {
  // Force Node.js runtime for all API routes
  process.env.NEXT_RUNTIME = 'nodejs';
  
  // Handle the request
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Next.js API route on Netlify' }),
  };
}; 