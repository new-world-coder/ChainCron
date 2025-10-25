#!/bin/bash

# 🎬 ChainCron AI-Zapier Demo Recording Script
# Records a comprehensive demo of the AI-Zapier for Flow platform

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
DEMO_DIR="demo-recordings"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
OUTPUT_FILE="${DEMO_DIR}/chaincron_ai_zapier_demo_${TIMESTAMP}.mp4"
DEV_SERVER_URL="http://localhost:3001"
DEMO_SCRIPT="demo-script.md"

echo -e "${PURPLE}🎬 ChainCron AI-Zapier Demo Recorder${NC}"
echo -e "${CYAN}=====================================${NC}"

# Create demo directory
mkdir -p "$DEMO_DIR"

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo -e "${RED}❌ ffmpeg is not installed. Please install it first:${NC}"
    echo -e "${YELLOW}   macOS: brew install ffmpeg${NC}"
    echo -e "${YELLOW}   Ubuntu: sudo apt install ffmpeg${NC}"
    echo -e "${YELLOW}   Windows: Download from https://ffmpeg.org/${NC}"
    exit 1
fi

# Check if development server is running
echo -e "${BLUE}🔍 Checking if development server is running...${NC}"
if ! curl -s "$DEV_SERVER_URL/api/health" > /dev/null; then
    echo -e "${RED}❌ Development server is not running at $DEV_SERVER_URL${NC}"
    echo -e "${YELLOW}   Please start the server with: npm run dev${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Development server is running${NC}"

# Display demo script
echo -e "${BLUE}📋 Demo Script Preview:${NC}"
echo -e "${CYAN}======================${NC}"
cat << 'EOF'

🎯 DEMO FLOW: AI-Zapier for Flow Platform

1. 🏠 LANDING PAGE (30s)
   - Show main ChainCron interface
   - Highlight "AI-Zapier" navigation item
   - Explain: "First conversational AI automation platform for Flow"

2. 🤖 AI WORKFLOW BUILDER (2min)
   - Navigate to /ai-zapier
   - Show conversational interface
   - Demo prompts:
     * "Every Monday, mint NFT for my subscribers"
     * "Auto-stake my FLOW rewards daily"
   - Show AI generating workflows
   - Explain natural language processing

3. 📚 TEMPLATE GALLERY (1min)
   - Browse pre-built templates
   - Show categories: DeFi, NFT, Social, Gaming
   - Highlight success rates and ratings
   - Demo template selection

4. 🌐 PUBLIC API DEMO (1min)
   - Show API endpoints in browser dev tools
   - Test /api/health endpoint
   - Explain RESTful API structure
   - Show workflow execution

5. 👥 SOCIAL FEATURES (1min)
   - Show community feed
   - Demonstrate workflow sharing
   - Show creator profiles and ratings
   - Explain social actions (like, fork, share)

6. 🚀 DEPLOYMENT READY (30s)
   - Show Vercel configuration
   - Explain Docker setup
   - Highlight production readiness

7. 🏆 COMPETITION SUMMARY (30s)
   - Recap all features
   - Emphasize "Best Killer App on Flow" readiness
   - Show USDC 40k+ bounty alignment

Total Duration: ~7 minutes
EOF

echo -e "${CYAN}======================${NC}"

# Get screen resolution
SCREEN_RES=$(system_profiler SPDisplaysDataType | grep Resolution | head -1 | awk '{print $2, $4}' | sed 's/ /x/')
if [ -z "$SCREEN_RES" ]; then
    SCREEN_RES="1920x1080"
fi

echo -e "${BLUE}📺 Screen Resolution: $SCREEN_RES${NC}"

# Recording options
echo -e "${YELLOW}🎥 Recording Options:${NC}"
echo -e "${CYAN}1. Full Screen Recording${NC}"
echo -e "${CYAN}2. Browser Window Only${NC}"
echo -e "${CYAN}3. Custom Area Selection${NC}"
echo -e "${CYAN}4. Audio + Screen Recording${NC}"

read -p "Select recording option (1-4): " RECORD_OPTION

case $RECORD_OPTION in
    1)
        echo -e "${BLUE}🎬 Starting full screen recording...${NC}"
        RECORD_AREA="0,0,$SCREEN_RES"
        ;;
    2)
        echo -e "${BLUE}🎬 Starting browser window recording...${NC}"
        echo -e "${YELLOW}   Please open your browser to $DEV_SERVER_URL/ai-zapier${NC}"
        read -p "Press Enter when ready to start recording..."
        RECORD_AREA="0,0,$SCREEN_RES"
        ;;
    3)
        echo -e "${BLUE}🎬 Custom area selection...${NC}"
        echo -e "${YELLOW}   Please select the area to record${NC}"
        read -p "Enter coordinates (x,y,width,height): " RECORD_AREA
        ;;
    4)
        echo -e "${BLUE}🎬 Starting audio + screen recording...${NC}"
        RECORD_AREA="0,0,$SCREEN_RES"
        AUDIO_OPTION="-f avfoundation -i :0"
        ;;
    *)
        echo -e "${RED}❌ Invalid option${NC}"
        exit 1
        ;;
esac

# Start recording
echo -e "${GREEN}🎬 Recording started!${NC}"
echo -e "${YELLOW}📁 Output file: $OUTPUT_FILE${NC}"
echo -e "${CYAN}⏹️  Press Ctrl+C to stop recording${NC}"

# FFmpeg command for screen recording
if [ "$RECORD_OPTION" = "4" ]; then
    ffmpeg -f avfoundation -i :0 -f avfoundation -i "1:0" -r 30 -s "$SCREEN_RES" -c:v libx264 -preset ultrafast -c:a aac -strict experimental -f mp4 "$OUTPUT_FILE"
else
    ffmpeg -f avfoundation -i "1:0" -r 30 -s "$SCREEN_RES" -c:v libx264 -preset ultrafast -f mp4 "$OUTPUT_FILE"
fi

echo -e "${GREEN}✅ Recording completed!${NC}"
echo -e "${BLUE}📁 Demo saved to: $OUTPUT_FILE${NC}"

# Generate demo summary
cat > "${DEMO_DIR}/demo_summary_${TIMESTAMP}.txt" << EOF
ChainCron AI-Zapier Demo Recording Summary
=========================================

Recording Date: $(date)
Duration: ~7 minutes
Output File: $OUTPUT_FILE
Screen Resolution: $SCREEN_RES

Features Demonstrated:
- AI Workflow Builder (Conversational Interface)
- Template Gallery (Pre-built Automations)
- Public API (RESTful Endpoints)
- Social Features (Community Sharing)
- Deployment Ready (Vercel + Docker)

Competition Ready:
- "Best Killer App on Flow" (16,000 USDC)
- Complete AI-Zapier platform
- All technical issues resolved
- Production-ready deployment

Next Steps:
1. Review recording quality
2. Edit if needed
3. Upload to competition platform
4. Submit for USDC 40k+ bounty
EOF

echo -e "${GREEN}📋 Demo summary saved to: ${DEMO_DIR}/demo_summary_${TIMESTAMP}.txt${NC}"
echo -e "${PURPLE}🎉 Demo recording complete! Ready for competition submission.${NC}"
