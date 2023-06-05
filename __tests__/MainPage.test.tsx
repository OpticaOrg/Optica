import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import MainPage from '../src/components/App';

describe('MainPage', () => {
  
  it('updates search term state correctly', () => {
    const { getByLabelText } = render(<MainPage />);
    const searchInput = getByLabelText('Search') as HTMLInputElement;

    // Simulate user input
    fireEvent.change(searchInput, { target: { value: 'example' } });

    // Verify that the state is updated correctly
    expect(searchInput.value).toBe('example');
  });

  // Tests that the header and search component are rendered correctly.
  it("test_render_header_and_search_component", () => {
    render(<MainPage />);
    expect(screen.getByText('Optica')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search for an image')).toBeInTheDocument();
  });
});
