import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import AlertBanner from './alert-banner';

describe('AlertBanner', () => {
  it('should render the alert banner', () => {
    render(<AlertBanner title="Test title" description="Test description" />);
    expect(screen.getByText('Test title')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });
});