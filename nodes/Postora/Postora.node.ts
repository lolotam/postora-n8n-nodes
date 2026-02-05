import {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    IDataObject,
    ILoadOptionsFunctions,
    INodePropertyOptions,
} from 'n8n-workflow';

export class Postora implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Postora',
        name: 'postora',
        icon: 'file:postora.png',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Interact with Postora API for social media posting',
        defaults: {
            name: 'Postora',
        },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [
            {
                name: 'postoraApi',
                required: true,
            },
        ],
        properties: [
            // Resource selector
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Post',
                        value: 'post',
                    },
                    {
                        name: 'Media',
                        value: 'media',
                    },
                    {
                        name: 'Account',
                        value: 'account',
                    },
                ],
                default: 'post',
            },

            // ========== POST OPERATIONS ==========
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: ['post'],
                    },
                },
                options: [
                    {
                        name: 'Create',
                        value: 'create',
                        description: 'Create a new post',
                        action: 'Create a post',
                    },
                    {
                        name: 'Get Many',
                        value: 'getAll',
                        description: 'Get many posts',
                        action: 'Get many posts',
                    },
                ],
                default: 'create',
            },

            // POST: Create - Platform (single selection to load accounts)
            {
                displayName: 'Platform',
                name: 'platform',
                type: 'options',
                displayOptions: {
                    show: {
                        resource: ['post'],
                        operation: ['create'],
                    },
                },
                options: [
                    { name: 'Facebook', value: 'facebook' },
                    { name: 'Instagram', value: 'instagram' },
                    { name: 'YouTube', value: 'youtube' },
                    { name: 'TikTok', value: 'tiktok' },
                    { name: 'Pinterest', value: 'pinterest' },
                    { name: 'LinkedIn', value: 'linkedin' },
                    { name: 'Twitter', value: 'twitter' },
                ],
                default: 'facebook',
                required: true,
                description: 'Select platform to post to',
            },

            // POST: Create - Account Selection
            {
                displayName: 'Account',
                name: 'accountId',
                type: 'options',
                typeOptions: {
                    loadOptionsMethod: 'getAccounts',
                    loadOptionsDependsOn: ['platform'],
                },
                displayOptions: {
                    show: {
                        resource: ['post'],
                        operation: ['create'],
                    },
                },
                default: '',
                required: true,
                description: 'Select the account to post from',
            },

            // POST: Create - Caption
            {
                displayName: 'Caption',
                name: 'caption',
                type: 'string',
                typeOptions: {
                    rows: 4,
                },
                displayOptions: {
                    show: {
                        resource: ['post'],
                        operation: ['create'],
                    },
                },
                default: '',
                description: 'Post caption/text content',
            },

            // POST: Create - Media URL
            {
                displayName: 'Media URL',
                name: 'mediaUrl',
                type: 'string',
                displayOptions: {
                    show: {
                        resource: ['post'],
                        operation: ['create'],
                    },
                },
                default: '',
                description: 'URL of media file to attach',
            },

            // POST: Create - Additional Options
            {
                displayName: 'Additional Options',
                name: 'additionalOptions',
                type: 'collection',
                placeholder: 'Add Option',
                default: {},
                displayOptions: {
                    show: {
                        resource: ['post'],
                        operation: ['create'],
                    },
                },
                options: [
                    {
                        displayName: 'Title',
                        name: 'title',
                        type: 'string',
                        default: '',
                        description: 'Post title (used for some platforms)',
                    },
                    {
                        displayName: 'Schedule Date',
                        name: 'scheduledAt',
                        type: 'dateTime',
                        default: '',
                        description: 'Date and time to schedule the post',
                    },
                ],
            },

            // POST: Create - Pinterest Options
            {
                displayName: 'Pinterest Options',
                name: 'pinterestOptions',
                type: 'collection',
                placeholder: 'Add Pinterest Option',
                default: {},
                displayOptions: {
                    show: {
                        resource: ['post'],
                        operation: ['create'],
                        platform: ['pinterest'],
                    },
                },
                options: [
                    {
                        displayName: 'Board ID',
                        name: 'boardId',
                        type: 'string',
                        default: '',
                        description: 'Pinterest board ID to post to',
                    },
                    {
                        displayName: 'Title',
                        name: 'title',
                        type: 'string',
                        default: '',
                        description: 'Pin title (max 100 characters)',
                    },
                    {
                        displayName: 'Link',
                        name: 'link',
                        type: 'string',
                        default: '',
                        description: 'Destination link for the pin',
                    },
                    {
                        displayName: 'Alt Text',
                        name: 'altText',
                        type: 'string',
                        default: '',
                        description: 'Alt text for accessibility',
                    },
                ],
            },

            // POST: Create - YouTube Options
            {
                displayName: 'YouTube Options',
                name: 'youtubeOptions',
                type: 'collection',
                placeholder: 'Add YouTube Option',
                default: {},
                displayOptions: {
                    show: {
                        resource: ['post'],
                        operation: ['create'],
                        platform: ['youtube'],
                    },
                },
                options: [
                    {
                        displayName: 'Title',
                        name: 'title',
                        type: 'string',
                        default: '',
                        description: 'Video title (required for YouTube)',
                    },
                    {
                        displayName: 'Privacy',
                        name: 'privacy',
                        type: 'options',
                        options: [
                            { name: 'Public', value: 'public' },
                            { name: 'Private', value: 'private' },
                            { name: 'Unlisted', value: 'unlisted' },
                        ],
                        default: 'public',
                        description: 'Video privacy setting',
                    },
                    {
                        displayName: 'Category',
                        name: 'category',
                        type: 'string',
                        default: '22',
                        description: 'YouTube category ID (22 = People & Blogs)',
                    },
                ],
            },

            // ========== MEDIA OPERATIONS ==========
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: ['media'],
                    },
                },
                options: [
                    {
                        name: 'Upload',
                        value: 'upload',
                        description: 'Upload media file',
                        action: 'Upload media',
                    },
                ],
                default: 'upload',
            },

            // MEDIA: Upload - URL
            {
                displayName: 'Media URL',
                name: 'mediaUrl',
                type: 'string',
                displayOptions: {
                    show: {
                        resource: ['media'],
                        operation: ['upload'],
                    },
                },
                default: '',
                required: true,
                description: 'URL of the media file to upload',
            },

            // ========== ACCOUNT OPERATIONS ==========
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: ['account'],
                    },
                },
                options: [
                    {
                        name: 'Get Many',
                        value: 'getAll',
                        description: 'Get all connected accounts',
                        action: 'Get many accounts',
                    },
                ],
                default: 'getAll',
            },
        ],
    };

    methods = {
        loadOptions: {
            async getAccounts(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
                const credentials = await this.getCredentials('postoraApi');
                const baseUrl = credentials.supabaseUrl as string;
                const apiKey = credentials.apiKey as string;
                const platform = this.getCurrentNodeParameter('platform') as string;

                console.log('Loading accounts for platform:', platform);
                console.log('API URL:', `${baseUrl}/functions/v1/n8n-api/api/v1/accounts`);

                try {
                    const response = await this.helpers.httpRequest({
                        method: 'GET',
                        url: `${baseUrl}/functions/v1/n8n-api/api/v1/accounts`,
                        headers: {
                            'x-api-key': apiKey,
                            'Authorization': `Bearer ${apiKey}`,
                            'Content-Type': 'application/json',
                        },
                        json: true,
                    });

                    console.log('API Response:', JSON.stringify(response));

                    // Parse the response which is in format { success: true, accounts: [...] }
                    const responseData = response as any;
                    const accounts = responseData.accounts || responseData; // Fallback to response if it is directly an array (for backward compatibility)

                    if (!Array.isArray(accounts)) {
                        console.error('Response is not an array:', accounts);
                        throw new Error('Invalid response format from API');
                    }

                    console.log(`Total accounts: ${accounts.length}`);

                    // Filter accounts by selected platform
                    const filteredAccounts = accounts.filter((account: any) =>
                        account.platform === platform
                    );

                    console.log(`Filtered accounts for ${platform}: ${filteredAccounts.length}`);

                    if (filteredAccounts.length === 0) {
                        console.log('No accounts found for platform:', platform);
                        return [{
                            name: `No ${platform} accounts connected`,
                            value: '',
                        }];
                    }

                    return filteredAccounts.map((account: any) => ({
                        name: account.platform_username || account.platform_user_id || account.id,
                        value: account.id,
                    }));
                } catch (error) {
                    console.error('Error loading accounts:', error);
                    return [{
                        name: 'Error loading accounts - check credentials',
                        value: '',
                    }];
                }
            },
        },
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: IDataObject[] = [];
        const resource = this.getNodeParameter('resource', 0) as string;
        const operation = this.getNodeParameter('operation', 0) as string;

        const credentials = await this.getCredentials('postoraApi');
        const baseUrl = credentials.supabaseUrl as string;
        const apiKey = credentials.apiKey as string;

        for (let i = 0; i < items.length; i++) {
            try {
                if (resource === 'post') {
                    if (operation === 'create') {
                        // Build request body
                        const platform = this.getNodeParameter('platform', i) as string;
                        const accountId = this.getNodeParameter('accountId', i) as string;
                        const caption = this.getNodeParameter('caption', i, '') as string;
                        const mediaUrl = this.getNodeParameter('mediaUrl', i, '') as string;
                        const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;

                        const body: IDataObject = {
                            platforms: [platform],
                            account_ids: [accountId],
                            caption,
                            ...additionalOptions,
                        };

                        // Add media if provided
                        if (mediaUrl) {
                            body.media_url = mediaUrl;
                        }

                        // Add Pinterest-specific options
                        if (platform === 'pinterest') {
                            const pinterestOptions = this.getNodeParameter('pinterestOptions', i, {}) as IDataObject;
                            if (pinterestOptions.boardId) body.pinterest_board_id = pinterestOptions.boardId;
                            if (pinterestOptions.title) body.pinterest_title = pinterestOptions.title;
                            if (pinterestOptions.link) body.pinterest_link = pinterestOptions.link;
                            if (pinterestOptions.altText) body.pinterest_alt_text = pinterestOptions.altText;
                        }

                        // Add YouTube-specific options
                        if (platform === 'youtube') {
                            const youtubeOptions = this.getNodeParameter('youtubeOptions', i, {}) as IDataObject;
                            if (youtubeOptions.title) body.youtube_title = youtubeOptions.title;
                            if (youtubeOptions.privacy) body.youtube_privacy = youtubeOptions.privacy;
                            if (youtubeOptions.category) body.youtube_category = youtubeOptions.category;
                        }

                        // Make API request
                        const response = await this.helpers.httpRequest({
                            method: 'POST',
                            url: `${baseUrl}/functions/v1/n8n-api/api/v1/post`,
                            headers: {
                                'x-api-key': apiKey,
                                'Authorization': `Bearer ${apiKey}`,
                                'Content-Type': 'application/json',
                            },
                            body,
                            json: true,
                        });

                        returnData.push(response as IDataObject);
                    } else if (operation === 'getAll') {
                        const response = await this.helpers.httpRequest({
                            method: 'GET',
                            url: `${baseUrl}/functions/v1/n8n-api/api/v1/posts`,
                            headers: {
                                'x-api-key': apiKey,
                                'Authorization': `Bearer ${apiKey}`,
                            },
                            json: true,
                        });

                        returnData.push(response as IDataObject);
                    }
                } else if (resource === 'media') {
                    if (operation === 'upload') {
                        const mediaUrl = this.getNodeParameter('mediaUrl', i) as string;

                        const response = await this.helpers.httpRequest({
                            method: 'POST',
                            url: `${baseUrl}/functions/v1/n8n-api/api/v1/upload-media`,
                            headers: {
                                'x-api-key': apiKey,
                                'Authorization': `Bearer ${apiKey}`,
                                'Content-Type': 'application/json',
                            },
                            body: {
                                media_url: mediaUrl,
                            },
                            json: true,
                        });

                        returnData.push(response as IDataObject);
                    }
                } else if (resource === 'account') {
                    if (operation === 'getAll') {
                        const response = await this.helpers.httpRequest({
                            method: 'GET',
                            url: `${baseUrl}/functions/v1/n8n-api/api/v1/accounts`,
                            headers: {
                                'x-api-key': apiKey,
                                'Authorization': `Bearer ${apiKey}`,
                            },
                            json: true,
                        });

                        returnData.push(response as IDataObject);
                    }
                }
            } catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({ error: (error as Error).message });
                    continue;
                }
                throw error;
            }
        }

        return [this.helpers.returnJsonArray(returnData)];
    }
}
