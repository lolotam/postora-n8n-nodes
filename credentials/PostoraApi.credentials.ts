import {
    ICredentialType,
    INodeProperties,
} from 'n8n-workflow';

export class PostoraApi implements ICredentialType {
    name = 'postoraApi';
    displayName = 'Postora API';
    documentationUrl = 'https://docs.postora.app';
    properties: INodeProperties[] = [
        {
            displayName: 'Supabase URL',
            name: 'supabaseUrl',
            type: 'string',
            default: 'https://efruibswazzuuupgyzmf.supabase.co',
            description: 'Your Postora Supabase URL',
            required: true,
        },
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            typeOptions: {
                password: true,
            },
            default: '',
            description: 'Your Postora API key (found in your Postora profile settings)',
            required: true,
        },
    ];
}
