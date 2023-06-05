import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import MainPage from '../src/features/mainPage/mainPageContainer';

describe('MainPage', () => {
  test('updates search term state correctly', () => {
    const { getByLabelText } = render(<MainPage />);
    const searchInput = getByLabelText('Search') as HTMLInputElement;

    // Simulate user input
    fireEvent.change(searchInput, { target: { value: 'example' } });

    // Verify that the state is updated correctly
    expect(searchInput.value).toBe('example');
  });
});
