import React from 'react';
import { render } from '../utils/test-utils';
import useInterval from './use-interval';

type IntervalProps = {
  callback: () => void;
  delay: number | null;
};

const Interval = ({ callback, delay }: IntervalProps) => {
  useInterval(callback, delay);
  return null;
};

describe('useInterval', () => {
  it('calls provided callback with correct intervals and cancels timer when delay is null', () => {
    jest.useFakeTimers();
    const callback: () => void = jest.fn();

    const { rerender } = render(<Interval callback={callback} delay={500} />);
    expect(callback).toBeCalledTimes(0);

    jest.advanceTimersByTime(500);
    expect(callback).toBeCalledTimes(1);

    jest.advanceTimersByTime(1500);
    expect(callback).toBeCalledTimes(4);

    rerender(<Interval callback={callback} delay={null} />);
    jest.advanceTimersByTime(7500);
    expect(callback).toBeCalledTimes(4);
    jest.clearAllTimers();
  });
});
