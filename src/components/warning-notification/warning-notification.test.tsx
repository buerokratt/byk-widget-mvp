import React from 'react';
import { render, screen } from '../../utils/test-utils';
import WarningNotification from './warning-notification';

describe('warning notification', () => {
  it('should render with given text', () => {
    const message = 'Hello world!';
    render(<WarningNotification warningMessage={message} />);
    screen.getByText(message);
  });
});
