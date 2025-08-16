import { render, screen } from '@testing-library/react';
import { GlassCard } from '../GlassCard';

describe('GlassCard', () => {
  it('renders children correctly', () => {
    render(
      <GlassCard>
        <div data-testid="test-content">Test Content</div>
      </GlassCard>
    );

    expect(screen.getByTestId('test-content')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <GlassCard className="custom-class">
        <div>Test Content</div>
      </GlassCard>
    );

    const card = screen.getByText('Test Content').parentElement;
    expect(card).toHaveClass('custom-class');
  });

  it('applies glassmorphic classes by default', () => {
    render(
      <GlassCard>
        <div>Test Content</div>
      </GlassCard>
    );

    const card = screen.getByText('Test Content').parentElement;
    expect(card).toHaveClass('glass-card');
    expect(card).toHaveClass('glass-card-hover');
  });
});
