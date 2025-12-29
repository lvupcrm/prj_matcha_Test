# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**NanoDetail AI** - AI-powered smart product detail page builder using Google Gemini API. This React + TypeScript + Vite application generates high-conversion product landing pages with AI-generated copy and imagery.

### Core Workflow
1. User inputs product information (name, category, features, tone, optional base image)
2. Gemini 3 Pro generates structured detail page content with conversion-optimized copy
3. Gemini 2.5 Flash Image generates section images (optionally compositing user's base product image)
4. User can export as standalone HTML or print to PDF

## Development Commands

### Setup
```bash
npm install
```

Set `GEMINI_API_KEY` in `.env.local` (see `.env.local` file)

### Development
```bash
npm run dev
```
Runs dev server on `http://localhost:3000` (configured in vite.config.ts)

### Build
```bash
npm run build
```
Creates production build using Vite

### Preview
```bash
npm run preview
```
Preview production build locally

## Architecture

### Data Flow Architecture

**Two-Phase AI Generation**:
1. **Content Generation** (geminiService.ts `generateDetailPageContent`)
   - Input: ProductInfo (name, category, features, targetAudience, tone, baseImage)
   - LLM: gemini-3-pro-preview with structured JSON schema output
   - Output: DetailPageData with sections[] + brandColors
   - System instruction implements CRO (Conversion Rate Optimization) strategy

2. **Image Generation** (geminiService.ts `generateSectionImage`)
   - Triggered per-section on component mount (SectionItem.tsx)
   - LLM: gemini-2.5-flash-image
   - Two modes:
     - **With baseImage**: Composites user's product photo into AI-generated scene
     - **Without baseImage**: Generates standalone scene from imagePrompt
   - Returns base64 image data

### Component Structure

**App.tsx** (Main orchestrator)
- Manages two-step flow: form → preview
- GenerationStatus state machine: IDLE → LOADING_TEXT → SUCCESS/ERROR
- Handles HTML export (standalone with embedded Tailwind CDN)

**SectionItem.tsx** (Section renderer + lazy image generator)
- Auto-triggers image generation when baseImage available
- Section type variants: hero, problem, solution, features, trust, cta
- Loading states with skeleton animation
- Error handling with retry mechanism

### Type System (types.ts)

**Key Types**:
- `ProductInfo`: User input form data
- `DetailSection`: Individual page section with type, title, content, imagePrompt
- `DetailPageData`: Complete page structure
- `SectionType`: Union type for section variants
- `GenerationStatus`: Enum for generation state tracking

### Environment Configuration

**API Key Handling**:
- `.env.local` stores `GEMINI_API_KEY`
- `vite.config.ts` exposes as `process.env.API_KEY` (line 14)
- Used in `geminiService.ts` (line 5)

**Important**: The service reads `process.env.API_KEY`, which is defined in Vite config from `GEMINI_API_KEY` environment variable.

## Gemini API Integration Patterns

### Structured Output Generation
Uses `responseMimeType: "application/json"` + `responseSchema` with Type definitions from `@google/genai`. The schema enforces:
- Section structure (type, title, content, imagePrompt required)
- BrandColors object (primary, secondary hex codes)

### System Instruction Strategy
geminiService.ts contains detailed CRO copywriting instructions:
- Feature → Benefit conversion emphasis
- Pain point agitation methodology
- Mobile-optimized formatting (short sentences, bullets)
- Required section flow: Hooking → Agitation → Solution → Trust → CTA

### Image Generation with Product Compositing
When `baseImage` provided:
- Extracts base64 data (strips data URL prefix)
- Passes as `inlineData` with mimeType
- Instructs model to "Maintain the exact product from the image" + place in new environment

## Korean Language Context

This app is designed for Korean e-commerce market:
- All UI text in Korean
- Copy generation instructions in Korean
- System instruction references Korean CRO best practices
- Export filenames use Korean (e.g., `${name}_상세페이지.html`)

## HTML Export Behavior

The export function (App.tsx:60-94):
- Extracts `#preview-content` innerHTML
- Wraps in standalone HTML with Tailwind CDN script
- Includes Font Awesome CDN for icons
- Adds `.no-print` class styling to hide UI controls in PDF export
- Downloads as `.html` file (can be directly uploaded to e-commerce platforms)

## Path Alias Configuration

Uses `@/` alias pointing to project root:
- Configured in tsconfig.json (paths: `"@/*": ["./*"]`)
- Configured in vite.config.ts (resolve.alias)
- Currently not heavily used (most imports are relative)
