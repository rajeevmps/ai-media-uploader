/**
 * n8n API Service Layer
 * Handles all communication with n8n workflow webhooks
 */

// Configuration - Update this with your n8n instance URL
const N8N_BASE_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || 'http://localhost:5678/webhook';

// API Endpoints (these correspond to n8n webhook paths)
const ENDPOINTS = {
    CAPTION: '/generate-caption',
    EDIT_IMAGE: '/edit-image',
    ENHANCE_MEDIA: '/enhance-media',
    POST_SOCIAL: '/post-social',
};

/**
 * Helper to create FormData from a file
 */
const createMediaFormData = (file, additionalData = {}) => {
    const formData = new FormData();
    formData.append('media', file);

    Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
    });

    return formData;
};

/**
 * Helper to convert file to base64 (for APIs that prefer base64)
 */
export const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

/**
 * Generate captions and hashtags for uploaded media
 * @param {File} mediaFile - The uploaded image or video file
 * @param {Object} options - Additional options (tone, platform, etc.)
 * @returns {Promise<{caption: string, hashtags: string[], success: boolean}>}
 */
export const generateCaption = async (mediaFile, options = {}) => {
    try {
        const formData = createMediaFormData(mediaFile, {
            tone: options.tone || 'professional',
            platform: options.platform || 'instagram',
            includeEmojis: options.includeEmojis ?? true,
        });

        const response = await fetch(`${N8N_BASE_URL}${ENDPOINTS.CAPTION}`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        return {
            success: true,
            caption: data.caption || '',
            hashtags: data.hashtags || [],
            rawResponse: data,
        };
    } catch (error) {
        console.error('[API] Caption generation failed:', error);

        // Return mock data for development/demo when n8n is not available
        if (import.meta.env.DEV) {
            return getMockCaptionResponse(mediaFile.name);
        }

        return {
            success: false,
            error: error.message,
            caption: '',
            hashtags: [],
        };
    }
};

/**
 * Edit an image using AI based on text instructions
 * @param {File} imageFile - The image file to edit
 * @param {string} prompt - Text instructions for editing
 * @returns {Promise<{editedImageUrl: string, success: boolean}>}
 */
export const editImage = async (imageFile, prompt) => {
    try {
        const formData = createMediaFormData(imageFile, {
            prompt: prompt,
            outputFormat: 'png',
        });

        const response = await fetch(`${N8N_BASE_URL}${ENDPOINTS.EDIT_IMAGE}`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        return {
            success: true,
            editedImageUrl: data.imageUrl || data.url,
            originalUrl: URL.createObjectURL(imageFile),
            prompt: prompt,
        };
    } catch (error) {
        console.error('[API] Image editing failed:', error);

        if (import.meta.env.DEV) {
            return getMockEditResponse(imageFile);
        }

        return {
            success: false,
            error: error.message,
            editedImageUrl: null,
        };
    }
};

/**
 * Enhance media quality (works for both images and videos)
 * @param {File} mediaFile - The media file to enhance
 * @param {Object} options - Enhancement options
 * @returns {Promise<{enhancedUrl: string, success: boolean}>}
 */
export const enhanceMedia = async (mediaFile, options = {}) => {
    try {
        const isVideo = mediaFile.type.startsWith('video');

        const formData = createMediaFormData(mediaFile, {
            type: isVideo ? 'video' : 'image',
            enhanceLevel: options.level || 'auto',
            upscale: options.upscale ?? false,
            denoise: options.denoise ?? true,
        });

        const response = await fetch(`${N8N_BASE_URL}${ENDPOINTS.ENHANCE_MEDIA}`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        return {
            success: true,
            enhancedUrl: data.enhancedUrl || data.url,
            originalUrl: URL.createObjectURL(mediaFile),
            mediaType: isVideo ? 'video' : 'image',
            improvements: data.improvements || ['Clarity', 'Color', 'Lighting'],
        };
    } catch (error) {
        console.error('[API] Media enhancement failed:', error);

        if (import.meta.env.DEV) {
            return getMockEnhanceResponse(mediaFile);
        }

        return {
            success: false,
            error: error.message,
            enhancedUrl: null,
        };
    }
};

/**
 * Post content to social media platforms
 * @param {File} mediaFile - The media to post
 * @param {Object} postData - Post details
 * @returns {Promise<{postUrl: string, success: boolean}>}
 */
export const postToSocial = async (mediaFile, postData) => {
    try {
        const formData = createMediaFormData(mediaFile, {
            platform: postData.platform,
            caption: postData.caption,
            hashtags: JSON.stringify(postData.hashtags || []),
            scheduleTime: postData.scheduleTime || null,
        });

        const response = await fetch(`${N8N_BASE_URL}${ENDPOINTS.POST_SOCIAL}`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        return {
            success: true,
            postUrl: data.postUrl,
            postId: data.postId,
            platform: postData.platform,
            publishedAt: data.publishedAt || new Date().toISOString(),
        };
    } catch (error) {
        console.error('[API] Social posting failed:', error);

        if (import.meta.env.DEV) {
            return getMockPostResponse(postData.platform);
        }

        return {
            success: false,
            error: error.message,
            postUrl: null,
        };
    }
};

// ============================================
// Mock Responses for Development/Demo
// ============================================

const getMockCaptionResponse = (filename) => {
    const captions = [
        "✨ Capturing moments that matter. Every frame tells a story worth sharing.",
        "🌟 Sometimes the best view comes after the hardest climb. Keep pushing forward!",
        "📸 Life is better when you're creating. What inspires you today?",
        "🎨 Art is not what you see, but what you make others see.",
    ];

    const hashtagSets = [
        ['photooftheday', 'instagood', 'creative', 'inspiration', 'content'],
        ['lifestyle', 'motivation', 'creativity', 'artisticAF', 'visualstorytelling'],
        ['contentcreator', 'digitalart', 'socialmedia', 'trending', 'viral'],
    ];

    return {
        success: true,
        caption: captions[Math.floor(Math.random() * captions.length)],
        hashtags: hashtagSets[Math.floor(Math.random() * hashtagSets.length)],
        isMock: true,
    };
};

const getMockEditResponse = (imageFile) => {
    return {
        success: true,
        editedImageUrl: URL.createObjectURL(imageFile), // In real case, this would be the edited image
        originalUrl: URL.createObjectURL(imageFile),
        prompt: 'Applied requested edits',
        isMock: true,
    };
};

const getMockEnhanceResponse = (mediaFile) => {
    return {
        success: true,
        enhancedUrl: URL.createObjectURL(mediaFile),
        originalUrl: URL.createObjectURL(mediaFile),
        mediaType: mediaFile.type.startsWith('video') ? 'video' : 'image',
        improvements: ['Enhanced clarity', 'Improved colors', 'Better lighting'],
        isMock: true,
    };
};

const getMockPostResponse = (platform) => {
    const mockUrls = {
        instagram: 'https://instagram.com/p/mock-post-id',
        youtube: 'https://youtube.com/watch?v=mock-video-id',
        twitter: 'https://twitter.com/user/status/mock-tweet-id',
        facebook: 'https://facebook.com/post/mock-post-id',
    };

    return {
        success: true,
        postUrl: mockUrls[platform] || mockUrls.instagram,
        postId: 'mock-' + Date.now(),
        platform: platform,
        publishedAt: new Date().toISOString(),
        isMock: true,
    };
};

export default {
    generateCaption,
    editImage,
    enhanceMedia,
    postToSocial,
    fileToBase64,
};
