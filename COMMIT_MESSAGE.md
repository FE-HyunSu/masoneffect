# 커밋 메시지

## 메인 커밋

```
feat: v2.0.1 - Multi-effect architecture with Tree-shaking support

BREAKING CHANGE: Restructured package to support multiple effects with Tree-shaking

### Major Changes
- Refactored from single-effect to multi-effect package architecture
- Added Tree-shaking support for optimal bundle size
- Introduced Count effect (animated number counting)
- Reorganized TextToParticle as independent module

### New Features
- Count effect with IntersectionObserver support
- Multiple easing functions for Count animation
- Independent import paths for each effect
- Framework-specific component exports (React, Vue, Svelte)

### Architecture
- Core effects: src/core/{textToParticle,count}/
- Framework wrappers: src/{react,vue,svelte}/{textToParticle,count}/
- Independent builds for each effect
- package.json exports field for Tree-shaking

### Backward Compatibility
- Maintained MasonEffect alias for TextToParticle
- Legacy import paths still work
- Migration guide in README

### Build System
- Rollup: Core & React builds (7 builds)
- Vite: Vue & Svelte builds (6 builds)
- Total: 13 independent builds

### Documentation
- Updated README with new structure
- Added examples for both effects
- Tree-shaking usage guide

Version: 2.0.1
```

## 간단한 버전

```
feat: v2.0.1 - Multi-effect architecture with Tree-shaking

- Refactored to multi-effect package (TextToParticle, Count)
- Added Tree-shaking support for optimal bundle size
- New Count effect with IntersectionObserver
- Independent import paths for each effect
- Maintained backward compatibility

BREAKING CHANGE: Package structure changed. Use direct imports for Tree-shaking.
```

## 더 간단한 버전

```
feat: v2.0.1 - Multi-effect package with Tree-shaking

Refactored MasonEffect to support multiple effects with Tree-shaking.
Added Count effect. Maintained backward compatibility.
```

