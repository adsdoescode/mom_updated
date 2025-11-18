# Mars Orbiter Mission Event - Setup Instructions

## Overview
This web application is designed for a Mars Climate Orbiter 1999 mission debriefing event with two rounds.

## Round 1 Features
- **Briefing Video**: Embedded video from Google Drive
- **Rules Presentation**: PPT-style rules display
- **Mars Incident Report**: Contains hidden clickable passwords
- **Password-Protected Document**: Unlocks with password `METRIC2IMPERIAL`

## Hidden Password Locations in Round 1
Participants can find the password `METRIC2IMPERIAL` by clicking on:
1. The altitude value "140-150 km" in the Technical Parameters section
2. The word "inconsistencies" in the Navigation Data Anomalies
3. The text "metric units (Newtons)" in the Investigation Notes
4. The verification code in the debug log (most visible)

## Round 2 Setup

### Step 1: Update the Video Link
The briefing video is already embedded. The current link is:
```
https://drive.google.com/file/d/1FEtFErYTTHqe35B/preview
```

If you need to change it, edit `/components/BriefingVideo.tsx` line 17.

### Step 2: Add Your Round 2 Website Link
In `/components/PasswordProtected.tsx`, find this line (around line 221):
```tsx
href="#round2"
```
Replace `#round2` with your actual Round 2 website URL.

### Step 3: Add Your Google Drive Folder Link
In `/components/PasswordProtected.tsx`, find this line (around line 234):
```tsx
href="#folder"
```
Replace `#folder` with your Google Drive folder sharing link.

Example:
```tsx
href="https://drive.google.com/drive/folders/1AbCdEfGhIjKlMnOpQrStUvWxYz"
```

## Optional: Use the Included Round 2 Template
A Round 2 website template is included in `/components/Round2Website.tsx`. You can:
1. Use it as-is by creating a new page
2. Customize it for your needs
3. Use it as inspiration for your own Round 2 design

## Customization Tips

### Change the Password
To change the hidden password, search for `METRIC2IMPERIAL` in:
- `/components/PasswordProtected.tsx` (line 18)
- `/components/MarsIncident.tsx` (multiple locations where password is set)

### Adjust Time Limits
- Update time references in `/components/RulesPresentation.tsx`
- Modify the Round 2 timer in `/components/Round2Website.tsx`

### Modify Colors/Theme
The app uses a dark theme with red/purple accents. Colors are defined using Tailwind classes throughout the components.

## Testing Your Setup

1. **Test Round 1**:
   - Navigate through all tabs
   - Find and click the hidden passwords
   - Enter password in the Classified Document section
   - Verify the document unlocks

2. **Test Round 2 Links**:
   - After unlocking Round 1, check that both buttons work
   - Verify the Round 2 website loads correctly
   - Ensure the Google Drive folder is accessible

## Event Flow

1. Participants watch the briefing video
2. Review the rules and protocols
3. Investigate the Mars incident report
4. Find hidden password elements by clicking/hovering
5. Unlock the classified document
6. Access Round 2 website and folder
7. Complete Round 2 challenges (defined by you)

## Support

If you need to modify any component, the main files are:
- `/App.tsx` - Main application structure
- `/components/BriefingVideo.tsx` - Video section
- `/components/RulesPresentation.tsx` - Rules slides
- `/components/MarsIncident.tsx` - Incident report with hidden passwords
- `/components/PasswordProtected.tsx` - Document unlock and Round 2 access
- `/components/Round2Website.tsx` - Round 2 template (optional)
