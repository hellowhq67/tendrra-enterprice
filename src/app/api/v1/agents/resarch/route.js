import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { userInput } = await req.json();

        if (!userInput) {
            return NextResponse.json(
                { error: 'User input is required' },
                { status: 400 }
            );
        }

        // 1. Extract User Intent
        const { location, productType, platform, purpose } = extractUserIntent(userInput);

        // 2. Generate Dynamic Prompt
        const prompt = generatePrompt(location, productType, platform, purpose);

        // Initialize the Google Generative AI client
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // 3. Generate Content using the model
        const result = await model.generateContent(prompt);

        // 4. Extract relevant information from the generated content.
        const extractedData = extractRelevantInformation(result.response.text());

        // 5. Return the extracted data
         return NextResponse.json(
            { result: extractedData },
            { status: 200 }
        );


    } catch (error) {
        console.error('Error:', error.message);
        return NextResponse.json(
            { error: error.message || 'Something went wrong' },
            { status: 500 }
        );
    }
}

function extractUserIntent(userInput) {
  // Implement simple keyword detection
    const locationMatch = userInput.match(/(in|from)\s+([\w\s]+)/i);
    const platformMatch = userInput.match(/(amazon|alibaba)/i);
    const productTypeMatch = userInput.match(/product (?:type|of)?\s*([\w\s]+)/i) || userInput.match(/(for|about|like)\s+([\w\s]+)/i);
    const purposeMatch = userInput.match(/(dropshipping|sale)/i);

  return {
      location: locationMatch ? locationMatch[2].trim() : null,
      productType: productTypeMatch ? productTypeMatch[2].trim() : null,
      platform: platformMatch ? platformMatch[0].trim() : null,
      purpose: purposeMatch ? purposeMatch[0].trim() : null,
    };
}


function generatePrompt(location, productType, platform, purpose) {
    let prompt = `
        RESEARCH OBJECTIVE:
        [Identify top-performing e-commerce products based on user specifications to support ${purpose === "dropshipping" ? "dropshipping" : "direct sale"} business.]

        USER INPUT:
        Location: ${location || "Not specified"}
        Product Type: ${productType || "General products"}
        Platform: ${platform || "Any platform"}
        Purpose: ${purpose || "General"}

        SEARCH PRIORITIES:
        [Sources to Focus On:]
    `;

  if (platform === "amazon") {
    prompt += `
      [- Amazon's Best Sellers and Movers & Shakers pages]
      [- Amazon product reviews and ratings]
    `;
  } else if (platform === "alibaba") {
    prompt += `
        [- Alibaba's trending product listings and dropshipping sections]
        [- Supplier ratings and feedback]
    `;
  } else {
    prompt += `
      [- Amazon's Best Sellers and Movers & Shakers pages]
      [- Alibaba's trending product listings and dropshipping sections]
      [- Industry reports on e-commerce and retail trends (e.g., Statista, Shopify blogs)]
      [- Academic papers and reliable blogs discussing e-commerce strategies]
    `;
  }

   prompt += `
        [Key Aspects to Investigate:]
        [- Categories of products with high sales volumes (e.g., electronics, apparel, health & beauty)]
        [- Emerging consumer preferences and seasonal demand patterns]
        [- ${purpose === "dropshipping" ? "Dropshipping-friendly products with low competition and high profit margins" : "High demand products for direct sales"}]
        [- Effective methods for analyzing sales data and trends across platforms]
    `;

    if (platform === "alibaba" ) {
        prompt += `
        [Specific Areas to Explore:]
        [- Comparison of sourcing costs and shipping times for trending products on Alibaba versus other platforms]
        [- Case studies or success stories of e-commerce businesses leveraging trending items for growth on Alibaba.]
        [- Tools and APIs to analyze sales trends and find profitable products on Alibaba.]
        `;

    } else if (platform === "amazon" ) {
        prompt += `
        [Specific Areas to Explore:]
        [- Comparison of prices and reviews for trending products on Amazon.]
        [- Case studies or success stories of e-commerce businesses leveraging trending items for growth on Amazon.]
         [- Tools and APIs to analyze sales trends and find profitable products on Amazon.]
        `;

    }else{
         prompt += `
        [Specific Areas to Explore:]
        [- Comparison of sourcing costs and shipping times for trending products on Alibaba versus other platforms]
        [- Case studies or success stories of e-commerce businesses leveraging trending items for growth.]
        [- Tools and APIs (e.g., Jungle Scout, Helium 10) to analyze sales trends and find profitable products]
        `;
    }

     prompt += `
      KEY SEARCH QUERIES:
        [1. Top-selling products on ${platform || "e-commerce platforms"} in ${location ? location : "general locations"}]
        [2. Trending ${purpose === "dropshipping" ? "dropshipping" : "sale"} products and niches for ${productType || "general products"} on ${platform || "e-commerce platforms"}]
        [3. High-demand e-commerce products for ${purpose === "dropshipping" ? "dropshipping" : "sales"} business growth and profitability]
        [4. How to identify and capitalize on trending products for e-commerce success]
        [5. Best strategies for sourcing trending items from ${platform || "e-commerce platforms"}]
    `;

    return prompt;
}


function extractRelevantInformation(text) {
    // Implement basic extraction logic (needs improvement)
    const productMatches = text.match(/(?:Product|Item):\s*(.+?)(?:\n|$)/gi)

    if (productMatches) {
        return productMatches.map(match => match.replace(/Product|Item:\s*/gi, '').trim());
    }
    return text; // Return all the text if no product is matched
}