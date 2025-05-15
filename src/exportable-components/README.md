
# Exportable Hero Video + Text Components

This directory contains components for implementing a scrollable hero video with text overlay.

## Required Dependencies

Make sure your target project has these dependencies installed:
- gsap
- @tanstack/react-query
- contentful

## How to Port to a New Project

### Step 1: Copy Components
Copy this entire `exportable-components` directory to your target project.

### Step 2: Update Contentful Configuration

#### 2.1 Update Contentful Client Credentials
Update `contentfulClient.ts` with your Contentful space ID and access token:

```typescript
export const contentfulClient = createClient({
  space: "YOUR_CONTENTFUL_SPACE_ID",
  accessToken: "YOUR_CONTENTFUL_ACCESS_TOKEN",
});
```

#### 2.2 Update Hero Text Entry IDs
In `useHeroText.ts`, update the hero text entry IDs to match your Contentful entries:

```typescript
const HERO_TEXT_IDS = ['YOUR_FIRST_HERO_TEXT_ID', 'YOUR_SECOND_HERO_TEXT_ID'];
```

#### 2.3 Update Default Video Asset ID
In `Video.tsx`, update the default video asset ID:

```typescript
const DEFAULT_VIDEO_ASSET_ID = "YOUR_VIDEO_ASSET_ID";
```

### Step 3: Import and Use in Your Project

```jsx
import { Video } from './path/to/exportable-components';

const YourPage = () => {
  return (
    <div>
      <Video />
      {/* Rest of your page content */}
    </div>
  );
};
```

### Using Video Without Contentful

If you prefer to use a direct video URL instead of fetching from Contentful:

```jsx
<Video videoSrc="/path/to/your-video.mp4" />
```

## Contentful Content Structure Requirements

### Video Asset
- Upload an MP4 video to Contentful that's optimized for scroll performance
- Note the Asset ID for use in Video.tsx

### Hero Text Entries
Create two "heroText" content type entries in Contentful with these fields:
- `heroTextEyebrow`: String - Small text shown above the title
- `heroTextTitle`: String - Main title text 
- `heroTextText`: String - Body text content
- `orderNumber`: Number - Sequence number (1 for first section, 2 for second section)

## Troubleshooting

### Video Not Appearing
- Verify Contentful credentials and asset IDs
- Check browser console for API errors
- Try the direct videoSrc approach as a fallback

### GSAP Scrolling Issues
- Ensure ScrollTrigger is properly registered with GSAP
- On mobile devices, check that the video has the proper playsinline attributes

### Text Not Loading
- Verify your Contentful heroText entries have the correct field structure
- Check that the entry IDs in useHeroText.ts match your Contentful entries
