const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");

// Initialize Bedrock client using the Lambda's deployment region
const bedrockClient = new BedrockRuntimeClient({ 
  region: process.env.AWS_REGION || 'us-west-2'
});

// Comprehensive language code mappings for Claude translation
const LANGUAGE_NAMES = {
  // Major World Languages
  'en': 'English',
  'es': 'Spanish',
  'fr': 'French',
  'de': 'German',
  'it': 'Italian',
  'pt': 'Portuguese',
  'ru': 'Russian',
  'ja': 'Japanese',
  'ko': 'Korean',
  'zh': 'Chinese (Simplified)',
  'zh-cn': 'Chinese (Simplified)',
  'zh-tw': 'Chinese (Traditional)',
  'ar': 'Arabic',
  'hi': 'Hindi',
  'nl': 'Dutch',
  'sv': 'Swedish',
  'da': 'Danish',
  'no': 'Norwegian',
  'fi': 'Finnish',
  'pl': 'Polish',
  'tr': 'Turkish',
  'th': 'Thai',
  'vi': 'Vietnamese',
  
  // European Languages
  'cs': 'Czech',
  'sk': 'Slovak',
  'hu': 'Hungarian',
  'ro': 'Romanian',
  'bg': 'Bulgarian',
  'hr': 'Croatian',
  'sr': 'Serbian',
  'sl': 'Slovenian',
  'et': 'Estonian',
  'lv': 'Latvian',
  'lt': 'Lithuanian',
  'el': 'Greek',
  'mt': 'Maltese',
  'ga': 'Irish',
  'cy': 'Welsh',
  'is': 'Icelandic',
  'mk': 'Macedonian',
  'sq': 'Albanian',
  'bs': 'Bosnian',
  'me': 'Montenegrin',
  'be': 'Belarusian',
  'uk': 'Ukrainian',
  
  // Asian Languages
  'bn': 'Bengali',
  'ur': 'Urdu',
  'ta': 'Tamil',
  'te': 'Telugu',
  'ml': 'Malayalam',
  'kn': 'Kannada',
  'gu': 'Gujarati',
  'pa': 'Punjabi',
  'or': 'Odia',
  'as': 'Assamese',
  'ne': 'Nepali',
  'si': 'Sinhala',
  'my': 'Burmese',
  'km': 'Khmer',
  'lo': 'Lao',
  'ka': 'Georgian',
  'hy': 'Armenian',
  'az': 'Azerbaijani',
  'kk': 'Kazakh',
  'ky': 'Kyrgyz',
  'uz': 'Uzbek',
  'tg': 'Tajik',
  'mn': 'Mongolian',
  'id': 'Indonesian',
  'ms': 'Malay',
  'tl': 'Filipino',
  'ceb': 'Cebuano',
  'haw': 'Hawaiian',
  'mi': 'Maori',
  'sm': 'Samoan',
  'to': 'Tongan',
  'fj': 'Fijian',
  
  // Middle Eastern & African Languages
  'fa': 'Persian',
  'he': 'Hebrew',
  'ku': 'Kurdish',
  'ps': 'Pashto',
  'sd': 'Sindhi',
  'sw': 'Swahili',
  'zu': 'Zulu',
  'xh': 'Xhosa',
  'af': 'Afrikaans',
  'am': 'Amharic',
  'ti': 'Tigrinya',
  'om': 'Oromo',
  'so': 'Somali',
  'rw': 'Kinyarwanda',
  'rn': 'Kirundi',
  'lg': 'Luganda',
  'ny': 'Chichewa',
  'sn': 'Shona',
  'st': 'Sesotho',
  'tn': 'Setswana',
  'ts': 'Xitsonga',
  've': 'Tshivenda',
  'ss': 'Siswati',
  'nr': 'Ndebele',
  'nso': 'Northern Sotho',
  
  // Latin American Languages
  'pt-br': 'Portuguese (Brazilian)',
  'es-mx': 'Spanish (Mexican)',
  'es-ar': 'Spanish (Argentinian)',
  'qu': 'Quechua',
  'gn': 'Guarani',
  'ay': 'Aymara',
  'ht': 'Haitian Creole',
  
  // Additional European Languages
  'eu': 'Basque',
  'ca': 'Catalan',
  'gl': 'Galician',
  'co': 'Corsican',
  'br': 'Breton',
  'gd': 'Scottish Gaelic',
  'lb': 'Luxembourgish',
  'rm': 'Romansh',
  'fur': 'Friulian',
  'sc': 'Sardinian',
  'vec': 'Venetian',
  'lmo': 'Lombard',
  'pms': 'Piedmontese',
  'lij': 'Ligurian',
  'nap': 'Neapolitan',
  'scn': 'Sicilian',
  
  // Additional Asian Languages
  'dv': 'Dhivehi',
  'bo': 'Tibetan',
  'ug': 'Uyghur',
  'ii': 'Yi',
  'za': 'Zhuang',
  'jv': 'Javanese',
  'su': 'Sundanese',
  'mad': 'Madurese',
  'ban': 'Balinese',
  'bug': 'Buginese',
  'min': 'Minangkabau',
  'ace': 'Acehnese',
  'bjn': 'Banjarese',
  'tet': 'Tetum',
  
  // Pacific Languages
  'ty': 'Tahitian',
  'na': 'Nauru',
  'ch': 'Chamorro',
  'mh': 'Marshallese',
  'gil': 'Gilbertese',
  'tvl': 'Tuvaluan',
  'niu': 'Niuean',
  'tkl': 'Tokelauan',
  
  // Additional African Languages
  'yo': 'Yoruba',
  'ig': 'Igbo',
  'ha': 'Hausa',
  'ff': 'Fulah',
  'wo': 'Wolof',
  'bm': 'Bambara',
  'dyu': 'Dyula',
  'ee': 'Ewe',
  'tw': 'Twi',
  'ak': 'Akan',
  'gaa': 'Ga',
  'dag': 'Dagbani',
  'mos': 'Mossi',
  'sg': 'Sango',
  'ln': 'Lingala',
  'kg': 'Kongo',
  'lua': 'Luba-Kasai',
  'luo': 'Luo',
  'ki': 'Kikuyu',
  'kam': 'Kamba',
  'mer': 'Meru',
  'luy': 'Luhya',
  'kln': 'Kalenjin',
  'mas': 'Maasai',
  
  // Native American Languages
  'nv': 'Navajo',
  'chr': 'Cherokee',
  'lkt': 'Lakota',
  'dak': 'Dakota',
  'oj': 'Ojibwe',
  'cr': 'Cree',
  'iu': 'Inuktitut',
  'kl': 'Kalaallisut',
  
  // Additional Languages
  'eo': 'Esperanto',
  'ia': 'Interlingua',
  'ie': 'Interlingue',
  'vo': 'Volapük',
  'jbo': 'Lojban',
  'tlh': 'Klingon',
  'la': 'Latin',
  'sa': 'Sanskrit',
  'pi': 'Pali',
  'got': 'Gothic',
  'non': 'Old Norse',
  'ang': 'Old English',
  'gmh': 'Middle High German',
  'enm': 'Middle English',
  'frm': 'Middle French',
  'fro': 'Old French',
  'pro': 'Old Provençal',
  'osp': 'Old Spanish',
  'roa-opt': 'Old Portuguese',
  'odt': 'Old Dutch',
  'goh': 'Old High German',
  'sga': 'Old Irish',
  'mga': 'Middle Irish',
  'owl': 'Old Welsh',
  'wlm': 'Middle Welsh',
  'osx': 'Old Saxon',
  'gml': 'Middle Low German',
  'dum': 'Middle Dutch',
  'osc': 'Oscan',
  'xum': 'Umbrian',
  'ett': 'Etruscan',
  'grc': 'Ancient Greek',
  'cop': 'Coptic',
  'syc': 'Classical Syriac',
  'arc': 'Aramaic',
  'akk': 'Akkadian',
  'sux': 'Sumerian',
  'egy': 'Ancient Egyptian',
  'hit': 'Hittite',
  'xlu': 'Luwian',
  'pal': 'Pahlavi',
  'xpr': 'Parthian',
  'sog': 'Sogdian',
  'xbc': 'Bactrian',
  'kho': 'Khotanese',
  'xtg': 'Transoxianan Sogdian',
  'xco': 'Chorasmian',
  'ae': 'Avestan',
  'peo': 'Old Persian',
  'elx': 'Elamite',
  'xur': 'Urartian',
  'xhu': 'Hurrian',
  'qfa-sub': 'Substrate language',
  'mis': 'Uncoded language',
  'mul': 'Multiple languages',
  'und': 'Undetermined language',
  'zxx': 'No linguistic content'
};

// Get full language name from code
function getLanguageName(langCode) {
  return LANGUAGE_NAMES[langCode] || langCode;
}

// Validate if a language code is supported
function isLanguageSupported(langCode) {
  return langCode in LANGUAGE_NAMES;
}

// Get list of all supported language codes
function getSupportedLanguages() {
  return Object.keys(LANGUAGE_NAMES);
}

// Normalize language code (handle common variations)
function normalizeLanguageCode(langCode) {
  if (!langCode) return null;
  
  const normalized = langCode.toLowerCase().trim();
  
  // Handle common variations
  const variations = {
    'chinese': 'zh',
    'mandarin': 'zh',
    'cantonese': 'zh-tw',
    'traditional-chinese': 'zh-tw',
    'simplified-chinese': 'zh-cn',
    'brazilian-portuguese': 'pt-br',
    'mexican-spanish': 'es-mx',
    'argentinian-spanish': 'es-ar',
    'american-english': 'en',
    'british-english': 'en',
    'castilian': 'es',
    'farsi': 'fa',
    'dari': 'fa',
    'burmese': 'my',
    'myanmar': 'my'
  };
  
  return variations[normalized] || normalized;
}

// Create translation prompt optimized for contact center use with comprehensive language support
function createTranslationPrompt(text, sourceLang, targetLang) {
  const sourceLanguage = getLanguageName(sourceLang);
  const targetLanguage = getLanguageName(targetLang);
  
  return `You are a professional translator working in a customer service contact center environment with expertise in over 200 languages and dialects.

Your task is to translate the following text from ${sourceLanguage} to ${targetLanguage}.

CRITICAL TRANSLATION GUIDELINES:
- Maintain the exact tone and formality appropriate for customer service interactions
- Preserve all technical terms, product names, brand names, and proper nouns exactly as they appear
- Keep the same level of politeness, respect, and professionalism across all cultures
- For customer service phrases, use culturally appropriate equivalents that maintain the same meaning
- Maintain any formatting, punctuation, or structure in the original text
- Handle regional dialects and variations appropriately (e.g., Brazilian Portuguese vs European Portuguese)
- For languages with formal/informal distinctions, use the appropriate level based on context
- Preserve any numbers, dates, times, currencies, and measurements in their original format
- If the text contains mixed languages, translate only the parts in the source language
- For right-to-left languages (Arabic, Hebrew, etc.), maintain proper text direction
- Handle honorifics and titles appropriately for the target culture
- Only provide the direct translation with no explanations, notes, or additional text

Text to translate: "${text}"

Translation:`;
}

// Invoke Bedrock with fallback mechanism
async function invokeBedrockWithFallback(bedrockClient, requestBody) {
  // Models to try in order (all using us inference profiles)
  const modelsToTry = [
    'us.anthropic.claude-3-5-sonnet-20241022-v2:0',
    'us.anthropic.claude-3-sonnet-20240229-v1:0',
    'us.anthropic.claude-3-haiku-20240307-v1:0'
  ];
  
  console.log(`Using Bedrock region: ${process.env.AWS_REGION}`);
  
  let lastError;
  
  for (const modelId of modelsToTry) {
    try {
      console.log(`Attempting translation with model: ${modelId}`);
      
      const command = new InvokeModelCommand({
        modelId: modelId,
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify(requestBody)
      });
      
      const response = await bedrockClient.send(command);
      console.log(`Successfully used model: ${modelId}`);
      return response;
      
    } catch (error) {
      console.log(`Model ${modelId} failed:`, error.message);
      console.log(`Error name: ${error.name}`);
      console.log(`Full error:`, JSON.stringify(error, null, 2));
      lastError = error;
      
      // If it's a model-specific error, try the next model
      if (error.name === 'ValidationException' || 
          error.name === 'ModelNotReadyException' ||
          error.message.includes('model ID') ||
          error.message.includes('inference profile')) {
        continue;
      }
      
      // For other errors (permissions, throttling, etc.), don't retry
      throw error;
    }
  }
  
  // If all models failed, throw the last error
  throw lastError;
}

exports.handler = async (event, context) => {
  try {
    const payload = JSON.parse(event.body);
    console.log("Translation request:", JSON.stringify(payload, null, 2));
    
    let { content, sourceLang, targetLang } = payload;
    
    // Validate required parameters
    if (!content || !sourceLang || !targetLang) {
      return {
        statusCode: 400,
        headers: { 
          "Access-Control-Allow-Origin": "*", 
          "Access-Control-Allow-Headers": "*" 
        },
        body: JSON.stringify({ 
          error: "Missing required parameters: content, sourceLang, targetLang" 
        })
      };
    }
    
    // Normalize language codes
    sourceLang = normalizeLanguageCode(sourceLang);
    targetLang = normalizeLanguageCode(targetLang);
    
    // Validate language codes
    if (!isLanguageSupported(sourceLang)) {
      console.log(`Unsupported source language: ${sourceLang}. Supported languages: ${getSupportedLanguages().slice(0, 10).join(', ')}...`);
      // Continue anyway - Claude might still understand it
    }
    
    if (!isLanguageSupported(targetLang)) {
      console.log(`Unsupported target language: ${targetLang}. Supported languages: ${getSupportedLanguages().slice(0, 10).join(', ')}...`);
      // Continue anyway - Claude might still understand it
    }
    
    // Skip translation if source and target languages are the same
    if (sourceLang === targetLang) {
      return {
        statusCode: 200,
        headers: { 
          "Access-Control-Allow-Origin": "*", 
          "Access-Control-Allow-Headers": "*" 
        },
        body: JSON.stringify({
          TranslatedText: content,
          SourceLanguageCode: sourceLang,
          TargetLanguageCode: targetLang
        })
      };
    }
    
    // Create the prompt for Claude
    const prompt = createTranslationPrompt(content, sourceLang, targetLang);
    
    // Prepare the request for Claude
    const requestBody = {
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 2000, // Increased for longer translations
      temperature: 0.1, // Low temperature for consistent translations
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    };
    
    console.log("Bedrock request:", JSON.stringify(requestBody, null, 2));
    
    // Invoke Claude via Bedrock with fallback mechanism
    const response = await invokeBedrockWithFallback(bedrockClient, requestBody);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    
    console.log("Bedrock response:", JSON.stringify(responseBody, null, 2));
    
    // Extract the translated text
    const translatedText = responseBody.content[0].text.trim();
    
    // Return response in the same format as Amazon Translate for compatibility
    const translationResponse = {
      TranslatedText: translatedText,
      SourceLanguageCode: sourceLang,
      TargetLanguageCode: targetLang,
      SupportedLanguages: getSupportedLanguages().length // Include count of supported languages
    };
    
    console.log("Translation response:", JSON.stringify(translationResponse, null, 2));
    
    return {
      statusCode: 200,
      headers: { 
        "Access-Control-Allow-Origin": "*", 
        "Access-Control-Allow-Headers": "*" 
      },
      body: JSON.stringify(translationResponse)
    };
    
  } catch (error) {
    console.error("Translation error:", error);
    
    // Handle specific Bedrock errors
    let errorMessage = "Translation failed";
    let statusCode = 500;
    
    if (error.name === 'ValidationException') {
      errorMessage = "Invalid request parameters or unsupported language combination";
      statusCode = 400;
    } else if (error.name === 'AccessDeniedException') {
      errorMessage = "Access denied to Bedrock service";
      statusCode = 403;
    } else if (error.name === 'ThrottlingException') {
      errorMessage = "Request throttled, please try again";
      statusCode = 429;
    } else if (error.name === 'ModelNotReadyException') {
      errorMessage = "Translation model is not ready";
      statusCode = 503;
    }
    
    return {
      statusCode: statusCode,
      headers: { 
        "Access-Control-Allow-Origin": "*", 
        "Access-Control-Allow-Headers": "*" 
      },
      body: JSON.stringify({ 
        error: errorMessage,
        details: error.message,
        supportedLanguages: getSupportedLanguages().length
      })
    };
  }
};
