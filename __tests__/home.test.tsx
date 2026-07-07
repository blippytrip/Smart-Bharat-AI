import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Home from '../app/page';

describe('Home Page', () => {
  it('renders a main section', () => {
    const { container } = render(<Home />);
    // simple test checking if container is rendered
    expect(container).toBeInTheDocument();
  });
});
