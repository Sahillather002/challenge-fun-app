# Shared UI Components

This directory contains reusable UI components that are designed to work across both web and mobile applications. The components follow a consistent design system and are built with accessibility and responsiveness in mind.

## Architecture

```
components/
├── src/
│   ├── atoms/           # Basic building blocks
│   ├── molecules/       # Combinations of atoms
│   ├── organisms/       # Complex UI sections
│   ├── templates/       # Page layouts and containers
│   ├── contexts/        # React contexts for state management
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Utility functions
│   └── types/           # TypeScript type definitions
├── web/                 # Web-specific implementations
├── mobile/              # Mobile-specific implementations
└── shared/              # Platform-agnostic components
```

## Design Principles

1. **Consistency**: All components follow the same design system and theme
2. **Accessibility**: Built with WCAG 2.0 AA standards in mind
3. **Responsiveness**: Work across all screen sizes and devices
4. **Reusability**: Components are designed to be reused in multiple contexts
5. **Maintainability**: Clean, well-documented code structure

## Getting Started

### Installation

```bash
npm install @health-competition/ui
```

### Usage

```jsx
// Import components
import { Button, Card, Avatar } from '@health-competition/ui';

// Use components
export default function MyComponent() {
  return (
    <Card>
      <Avatar src="https://example.com/avatar.jpg" alt="User avatar" />
      <Button variant="primary">Click Me</Button>
    </Card>
  );
}
```

## Theme System

The components use a shared theme system with both light and dark modes. The theme can be customized using CSS variables or context providers.

### Theme Variables

```css
:root {
  /* Light Theme */
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  --card: 0 0% 100%;
  --card-foreground: 0 0% 3.9%;
  
  /* Dark Theme */
  --background: 224 71% 4%;
  --foreground: 210 40% 98%;
  --card: 224 71% 6%;
  --card-foreground: 210 40% 98%;
  
  /* Primary Colors */
  --primary: 142 76% 44%;
  --primary-foreground: 224 71% 4%;
  --secondary: 217 92% 59%;
  --secondary-foreground: 210 40% 98%;
  
  /* Muted Colors */
  --muted: 224 47% 11%;
  --muted-foreground: 215 20% 65%;
  
  /* Accent Colors */
  --accent: 263 86% 61%;
  --accent-foreground: 210 40% 98%;
}
```

## Components

### Atoms

- **Button**: Interactive button component
- **Input**: Text input field
- **Checkbox**: Checkbox component
- **Radio**: Radio button component
- **Slider**: Range slider component
- **Toggle**: Toggle switch component
- **Badge**: Badge/tag component
- **Avatar**: User avatar component
- **Icon**: Icon component

### Molecules

- **Card**: Container card with optional header and footer
- **Form**: Form container with validation
- **Modal**: Modal dialog component
- **Dropdown**: Dropdown menu component
- **Tabs**: Tab navigation component
- **Accordion**: Accordion component
- **Carousel**: Image carousel component
- **Pagination**: Pagination component

### Organisms

- **Header**: Top navigation bar
- **Footer**: Bottom footer
- **Sidebar**: Side navigation panel
- **Hero**: Hero section
- **Features**: Feature list section
- **Testimonials**: Testimonial section
- **Pricing**: Pricing table section
- **Contact**: Contact form section

### Templates

- **Dashboard**: Dashboard layout
- **Competition**: Competition details page layout
- **Profile**: User profile page layout
- **Settings**: Settings page layout
- **Login**: Login page layout
- **Register**: Register page layout

## Documentation

For detailed documentation, please refer to the [Storybook](https://storybook.example.com) or the [API Documentation](https://docs.example.com).

## Contributing

Please read our [Contributing Guide](CONTRIBUTING.md) before submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
