import React from 'react';
import Linkify from 'linkify-react';

interface LinkifierProps {
  message: string | undefined;
}

const regex = /https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zõäöüA-ZÕÄÖÜ0-9()@:%_\+.~#?&//=]*)/;

const Linkifier: React.FC<LinkifierProps> = ({ message }) => (
  <div>
    <Linkify
      options={{
        attributes: { target: '_blank' },
        defaultProtocol: 'https',
        validate: {
          url: (value: string) => regex.test(value),
          email: false,
        },
      }}
    >
      {message || ''}
    </Linkify>
  </div>
);

export default Linkifier;
