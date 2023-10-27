import React from 'react';
import { render, screen } from '@testing-library/react';
import Linkifier from './linkifier';

describe('Linkifier', () => {
  it('should render message link between strings', () => {
    const sentMessage = 'mine palun https://www.google.com/ eerfe';
    const link = 'https://www.google.com/';
    render(<Linkifier message={sentMessage} />);
    expect(screen.getByText(link)).toHaveAttribute('href', link);
  });

  it('should render link with unicode characters', () => {
    const sentMessage = 'mine palun https://bürokröäõatt.ee/ eerfe';
    const link = 'https://bürokröäõatt.ee/';
    render(<Linkifier message={sentMessage} />);
    expect(screen.getByText(link)).toHaveProperty('href');
  });

  it.each`
    correctLink
    ${'https://wwdw.google.com/24ir/dir'}
    ${'https://www.google.com/'}
    ${'https://www.google.com'}
  `("should render '$correctLink", async ({ correctLink }) => {
    render(<Linkifier message={correctLink} />);
    expect(screen.getByText(correctLink)).toHaveAttribute('href', correctLink);
  });

  it.each`
    inCorrectLink
    ${'Terekest'}
    ${'https://kasutaja@veebisait.com'}
    ${'http://kasutaja@veebisait.com'}
    ${'https://kasutajatunnus:parool@veebisait.com'}
    ${'https://eesti.ee:mingi-kasutaja-tahelepanu-hajutav-pikk-tekst@p0c.eu'}
    ${'mailto:test@eesti.ee'}
    ${'mailto:test@eesti.ee?subject=kiri&html-body=<h1><a%20href="http://eriti-paha-sait.com">KLIKI%20SIIA</a>'}
    ${'google.com'}
    ${'http://www.google.com'}
    ${'ftp://www.google.com'}
    ${'ftps://www.google.com'}
  `("should not render '$inCorrectLink'", async ({ inCorrectLink }) => {
    render(<Linkifier message={inCorrectLink} />);
    expect(screen.getByText(inCorrectLink)).not.toHaveAttribute('href');
  });
});
