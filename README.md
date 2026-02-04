# n8n-nodes-postora

This is an n8n community node that lets you use [Postora](https://postora.app) in your n8n workflows.

Postora is a social media management platform that allows you to schedule and post content to multiple platforms including Facebook, Instagram, YouTube, TikTok, Pinterest, LinkedIn, and Twitter.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### Community Nodes (Recommended)

1. Open your n8n instance
2. Go to **Settings > Community Nodes**
3. Click **Install** and search for `n8n-nodes-postora`
4. Install the package

### Manual Installation

To get started with the Postora node in n8n:

```bash
# Install in your n8n instance
npm install n8n-nodes-postora
```

## Operations

### Post

- **Create**: Create and publish/schedule a post to multiple social media platforms
- **Get Many**: Retrieve your post history

### Media

- **Upload**: Upload media files to use in your posts

### Account

- **Get Many**: List all your connected social media accounts

## Credentials

To use this node, you need:

1. **Supabase URL**: Your Postora Supabase URL (default: `https://efruibswazzuuupgyzmf.supabase.co`)
2. **API Key**: Your Postora API key (found in your Postora profile settings)

### Getting Your API Key

1. Log in to your Postora account
2. Navigate to **Settings > Profile**
3. Find your **API Key** in the API section
4. Copy and paste it into the n8n credentials

## Compatibility

This node has been tested with n8n version 1.0.0+

## Usage

### Example: Create a Multi-Platform Post

1. Add the **Postora** node to your workflow
2. Select **Resource: Post**, **Operation: Create**
3. Choose your target **Platforms** (e.g., Facebook, Instagram, Pinterest)
4. Enter your post **Caption**
5. Add a **Media URL** (optional)
6. Configure platform-specific options:
   - **Pinterest**: Board ID, title, link, alt text
   - **YouTube**: Title, privacy, category
7. Execute the workflow

### Example: Upload Media First

```
HTTP Request (Get Image) → Postora (Upload Media) → Postora (Create Post)
```

1. Use HTTP Request to get your image
2. Upload it via Postora's Upload Media operation
3. Use the returned `media_file_id` in your Create Post operation

### Example: Get Connected Accounts

1. Add **Postora** node
2. Select **Resource: Account**, **Operation: Get Many**
3. Execute to see all your connected social media accounts

## Platform-Specific Options

### Pinterest
- **Board ID**: Target Pinterest board
- **Title**: Pin title (max 100 chars)
- **Link**: Destination URL
- **Alt Text**: Accessibility text

### YouTube
- **Title**: Video title (required)
- **Privacy**: public, private, or unlisted
- **Category**: YouTube category ID

More platform options coming soon for:
- Instagram (share to feed, collaborators)
- TikTok (privacy, duet/stitch)
- Facebook (page posting)
- LinkedIn (visibility)

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [Postora Documentation](https://docs.postora.app)
* [Postora Website](https://postora.app)

## License

MIT

## Support

For bugs or feature requests, please [open an issue](https://github.com/lolotam/n8n-nodes-postora/issues).

For Postora-specific questions, contact support@postora.app
