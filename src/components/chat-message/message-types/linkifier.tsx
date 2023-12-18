import React from 'react';
import Linkify from 'linkify-react';

const Linkifier = (props: { message: string | undefined }): JSX.Element => {
  const { message = '' } = props;

  const regex = /https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zõäöüA-ZÕÄÖÜ0-9()@:%_\+.~#?&//=]*)/;
  
  return (
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
        {message}
      </Linkify>
    </div>
  );
};

export default Linkifier;
