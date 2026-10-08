# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Colour palette presets via the `palette` option: `yeti`, `black`, `blue`, `green`, `orange`, `purple`, `red` and `yellow`
- Changelog page rendered from a Keep a Changelog file via the `changelog` option
  - Appended as the last sidebar entry, with an optional footer link (`showInFooter`)
  - Release notes grouped into Added / Changed / Fixed badges

### Changed

- Components now use Starlight's `--sl-color-*` tokens instead of hard-coded colours

### Fixed

- Peer dependency range allows Starlight 0.42+

## [1.1.0] - 2026-09-15

### Added

- `linkableGroups` sidebar helper: groups with a `slug` get a clickable heading
- `[lucide:*]` icon syntax in sidebar labels, rendered through [astro-icon](https://www.astroicon.dev/)
- Branded 404 page with the `notFoundImage` option to swap or disable the artwork

### Fixed

- Collapsed groups no longer reset when navigating between their pages
- 404 hero image respects the site `base`

## [1.0.0] - 2026-08-31

### Added

- Initial release with 18 component overrides, Tailwind CSS v4 styling and lucide icon support

[Unreleased]: https://github.com/myerscode/starlight-theme-yeti/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/myerscode/starlight-theme-yeti/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/myerscode/starlight-theme-yeti/releases/tag/v1.0.0
