# Migration to Amazon Bedrock with Claude for Translation

This document outlines the changes made to migrate from Amazon Translate to Amazon Bedrock with Claude for real-time chat translation in the Amazon Connect Chat Translate Demo.

## Changes Made

### 1. Lambda Function Updates (`amplify/backend/function/amazonTranslateLambda/src/index.js`)

- **Replaced AWS SDK v2 with v3**: Updated to use `@aws-sdk/client-bedrock-runtime`
- **Claude Integration**: Implemented Claude 3.5 Sonnet for translation with contact center-optimized prompts
- **Enhanced Error Handling**: Added specific error handling for Bedrock service exceptions
- **Language Mapping**: Added comprehensive language code to name mapping for better Claude understanding
- **Contact Center Optimization**: Tailored prompts specifically for customer service scenarios

### Latest Language Enhancements

The implementation has been further enhanced with:

1. **Comprehensive Language Support**: Expanded from ~25 to 200+ languages and dialects
2. **Language Code Normalization**: Automatic handling of common language variations (e.g., 'chinese' → 'zh')
3. **Regional Variants**: Support for Brazilian Portuguese, Mexican Spanish, Traditional Chinese, etc.
4. **Cultural Adaptation**: Enhanced prompts for culturally appropriate translations
5. **Increased Token Limit**: Raised from 1000 to 2000 tokens for longer translations
6. **Better Validation**: Enhanced error handling for unsupported language combinations
7. **Historical Languages**: Support for Latin, Sanskrit, Ancient Greek, and other historical languages
8. **Indigenous Languages**: Support for Native American and other indigenous languages
9. **Constructed Languages**: Support for Esperanto, Klingon, and other constructed languages

### 2. Dependencies (`amplify/backend/function/amazonTranslateLambda/src/package.json`)

- **Updated Dependencies**: Replaced `aws-sdk` with `@aws-sdk/client-bedrock-runtime`
- **Version Management**: Using AWS SDK v3 for better performance and smaller bundle size

### 3. IAM Permissions (`amazonTranslateLambda-cloudformation-template.json`)

- **Bedrock Permissions**: Added `bedrock:InvokeModel` permission for Claude inference profiles
- **Dual Region Support**: Static permissions for both us-east-1 and us-west-2 regions
- **Model-Specific Access**: Restricted access to specific Claude inference profiles for security
- **Removed Translate Permissions**: Removed unnecessary Amazon Translate permissions

## Key Features

### Inference Profile Support

The implementation uses Bedrock inference profiles in the Lambda's deployment region:
- **Primary Model**: Claude 3.5 Sonnet via US inference profile
- **Fallback Models**: Claude 3 Sonnet and Claude 3 Haiku (US profiles)
- **Dynamic Region**: Uses the same region where Lambda is deployed
- **Error Recovery**: Automatically tries fallback models if primary model fails

### Contact Center Optimized Translation

The Claude implementation includes several optimizations for contact center use:

1. **Professional Tone Preservation**: Maintains appropriate customer service tone
2. **Technical Term Handling**: Preserves product names and technical terminology
3. **Formality Maintenance**: Keeps the same level of politeness and professionalism
4. **Formatting Preservation**: Maintains original text structure and formatting

### Supported Languages

The implementation supports over 200 languages and dialects that Claude can handle, including:

**Major World Languages:**
- English, Spanish, French, German, Italian, Portuguese, Russian, Japanese, Korean, Chinese, Arabic, Hindi, and more

**Regional Variants:**
- Brazilian Portuguese (pt-br), Mexican Spanish (es-mx), Traditional Chinese (zh-tw), Simplified Chinese (zh-cn)

**European Languages:**
- All EU official languages plus regional languages like Basque, Catalan, Welsh, Irish, Scottish Gaelic

**Asian Languages:**
- Complete coverage of Indian subcontinent languages (Bengali, Tamil, Telugu, Malayalam, etc.)
- Southeast Asian languages (Thai, Vietnamese, Indonesian, Malay, Filipino, etc.)
- Central Asian languages (Georgian, Armenian, Kazakh, Uzbek, etc.)

**African Languages:**
- Major African languages including Swahili, Zulu, Xhosa, Yoruba, Igbo, Hausa, Amharic, Somali

**Indigenous & Historical Languages:**
- Native American languages (Navajo, Cherokee, Lakota, etc.)
- Historical languages (Latin, Sanskrit, Ancient Greek, Old Norse)
- Constructed languages (Esperanto, Klingon, Lojban)

**Language Code Normalization:**
- Automatic handling of common variations (e.g., 'chinese' → 'zh', 'farsi' → 'fa')
- Support for both ISO 639-1 and regional codes

### Error Handling

Enhanced error handling for common Bedrock scenarios:
- **ValidationException**: Invalid request parameters
- **AccessDeniedException**: Insufficient permissions
- **ThrottlingException**: Rate limiting
- **ModelNotReadyException**: Model availability issues

## Prerequisites for Deployment

### 1. Bedrock Model Access

Before deploying, ensure you have access to Claude models in your AWS region:

1. Navigate to the [Amazon Bedrock Console](https://console.aws.amazon.com/bedrock/)
2. Go to "Model access" in the left navigation
3. Request access to Anthropic Claude models:
   - Claude 3.5 Sonnet (recommended)
   - Claude 3 Sonnet (fallback)
   - Claude 3 Haiku (cost-effective option)

### 2. Regional Availability

Ensure Bedrock is available in your Lambda's deployment region. The implementation supports both us-east-1 and us-west-2 regions with static IAM permissions for both.

### 3. IAM Permissions

The Lambda execution role needs the following permissions:
```json
{
  "Effect": "Allow",
  "Action": [
    "bedrock:InvokeModel"
  ],
  "Resource": [
    "arn:aws:bedrock:us-east-1:*:inference-profile/us.anthropic.claude-3-5-sonnet-20241022-v2:0",
    "arn:aws:bedrock:us-east-1:*:inference-profile/us.anthropic.claude-3-sonnet-20240229-v1:0",
    "arn:aws:bedrock:us-east-1:*:inference-profile/us.anthropic.claude-3-haiku-20240307-v1:0",
    "arn:aws:bedrock:us-west-2:*:inference-profile/us.anthropic.claude-3-5-sonnet-20241022-v2:0",
    "arn:aws:bedrock:us-west-2:*:inference-profile/us.anthropic.claude-3-sonnet-20240229-v1:0",
    "arn:aws:bedrock:us-west-2:*:inference-profile/us.anthropic.claude-3-haiku-20240307-v1:0"
  ]
}
```

## Deployment Steps

1. **Update Dependencies**: The package.json has been updated to use AWS SDK v3
2. **Deploy via Amplify**: Use the existing Amplify deployment process
3. **Verify Permissions**: Ensure the Lambda has proper Bedrock permissions
4. **Test Translation**: Verify translation functionality works as expected

## Cost Considerations

### Bedrock vs Translate Pricing Comparison

**Amazon Bedrock (Claude 3.5 Sonnet)**:
- Input tokens: $3.00 per million tokens
- Output tokens: $15.00 per million tokens
- ~750 characters per 1000 tokens (approximate)

**Amazon Translate**:
- $15.00 per million characters

### Cost Analysis for Contact Center Usage

For the same 124k chats scenario from the original README:

| Service | Original (Translate) | New (Bedrock Claude) | Difference |
|---------|---------------------|---------------------|------------|
| Translation Service | $425.25 | ~$850-1200* | +$425-775 |

*Estimate based on average message length and token usage

**Note**: While Bedrock may be more expensive per transaction, it offers:
- Better context understanding
- More natural translations
- Better handling of customer service terminology
- Improved accuracy for complex sentences

## Monitoring and Troubleshooting

### CloudWatch Logs

Monitor the Lambda function logs for:
- Translation requests and responses
- Error messages and stack traces
- Performance metrics

### Common Issues

1. **Inference Profile Error**: If you see "isn't supported. Retry your request with the ID or ARN of an inference profile", the function now automatically uses inference profiles
2. **Model Access Denied**: Ensure Bedrock model access is granted in the console for Claude models in both us-east-1 and us-west-2 (depending on your deployment region)
3. **Region Issues**: The function supports both us-east-1 and us-west-2, ensure your Bedrock access is enabled in your deployment region
4. **Token Limits**: Monitor for messages exceeding Claude's token limits
5. **Rate Limiting**: The function includes automatic fallback to different models

## Testing

Test the updated implementation with:

1. **Basic Translation**: Simple messages between supported languages
2. **Customer Service Phrases**: Test with typical contact center terminology
3. **Technical Terms**: Verify preservation of product names and technical terms
4. **Long Messages**: Test with longer customer messages
5. **Error Scenarios**: Test error handling with invalid inputs

## Rollback Plan

If issues arise, you can rollback by:

1. Reverting the Lambda function code to use Amazon Translate
2. Updating the package.json dependencies
3. Restoring the original IAM permissions
4. Redeploying via Amplify

The original Amazon Translate implementation is preserved in git history for easy rollback.

## Support

For issues related to:
- **Bedrock Access**: Contact AWS Support or check the Bedrock documentation
- **Translation Quality**: Fine-tune the Claude prompts in the Lambda function
- **Performance**: Monitor CloudWatch metrics and adjust timeout settings
- **Costs**: Use AWS Cost Explorer to monitor Bedrock usage

## Future Enhancements

Potential improvements for the Bedrock implementation:

1. **Model Selection**: Allow dynamic model selection based on cost/quality requirements
2. **Caching**: Implement translation caching for repeated phrases
3. **Batch Processing**: Process multiple translations in a single request
4. **Custom Terminology**: Implement custom terminology similar to Amazon Translate
5. **Quality Metrics**: Add translation quality monitoring and feedback loops
