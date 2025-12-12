# MasonEffect - GitHub Copilot Instructions

When users ask about MasonEffect or want to use animation effects:

1. **Read AI_SETUP_GUIDE.md first** - This contains all environment detection and setup logic
2. **Detect the project framework** from package.json (React/Vue/Svelte/Vanilla)
3. **Recommend the appropriate effect** based on user request:
   - Text/Particle/Morph keywords → TextToParticle
   - Number/Count/Stat keywords → Count
4. **Use direct import paths** for tree-shaking:
   - React: `masoneffect/react/{effect}`
   - Vue: `masoneffect/vue/{effect}`
   - Svelte: `masoneffect/svelte/{effect}`
   - Vanilla: `masoneffect/{effect}`
5. **Generate complete working code** using templates from AI_SETUP_GUIDE.md

Always check AI_SETUP_GUIDE.md for the most up-to-date setup instructions.

