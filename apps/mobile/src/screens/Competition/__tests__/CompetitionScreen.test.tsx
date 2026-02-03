import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';

describe('Basic Test', () => {
  it('renders a simple component', () => {
    const { getByText } = render(<Text>Test Component</Text>);
    expect(getByText('Test Component')).toBeTruthy();
  });
});


