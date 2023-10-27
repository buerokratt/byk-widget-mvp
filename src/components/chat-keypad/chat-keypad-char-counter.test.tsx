import React from 'react';
import { Provider } from 'react-redux';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { fireEvent, screen } from '@testing-library/react';
import { render } from '../../utils/test-utils';
import ChatKeyPad from './chat-keypad';
import chatReducer from '../../slices/chat-slice';
import ChatKeypadCharCounter from './chat-keypad-char-counter';

let store: EnhancedStore;

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: { language: 'et' },
  }),
}));

function createTestStore() {
  return configureStore({
    reducer: {
      chat: chatReducer,
    },
  });
}

const grayLongMessage =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean dignissim mauris vel sapien ornare mattis. Pellentesque in dui risus. Aliquam luctus metus eget luctus pellentesque. Donec sodales, magna sit amet dignissim ultricies, arcu est egestas est, non blandit lacus metus sed nibh. Proin hendrerit justo vel risus gravida venenatis. Pellentesque nec mollis erat. Duis tincidunt, metus dictum fringilla imperdiet, lorem odio imperdiet massa, fermentum varius risus nunc vitae massa. Duis in purus id.';

const warninglongCharMessage =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sit amet malesuada felis, sit amet venenatis massa. Mauris vitae odio fermentum ipsum tincidunt vehicula. Donec non urna ex. Maecenas rutrum ornare erat, nec scelerisque nulla. Aenean ipsum elit, fringilla eu augue nec, viverra luctus dolor. Nunc tempor felis et mi posuere maximus. Suspendisse in massa enim. Nulla euismod ante non bibendum sodales. Ut eu risus at nisl iaculis tincidunt. Aenean commodo mauris velit, ut elementum justo dignissim non. Nulla congue nibh eget metus vehicula ultrices. Quisque quis nulla vitae ligula gravida molestie. Morbi ultricies nibh eu nisi feugiat, id ullamcorper tortor porttitor. Donec a odio imperdiet, dignissim velit non, egestas augue. Cras ut ante vitae erat commodo finibus et tincidunt libero.Etiam a ligula sit amet augue consequat tincidunt vitae eget est. Aenean tincidunt consequat urna, non porttitor purus. Suspendisse bibendum eros nec ipsum tincidunt efficitur. Ut tristique a orci ac ultricies. Aenean molestie efficitur metus sit amet tempor. Ut eu fringilla libero, eu placerat lorem. Donec tincidunt enim eros, in tristique nisi hendrerit ut. Integer egestas eros quis enim posuere, sed molestie augue tempus. Sed sed dui maximus, mattis purus id, lacinia est.Etiam rhoncus, quam a porttitor convallis, lorem elit facilisis dolor, eget pellentesque lacus sem in quam. Praesent eget finibus ex. Pellentesque facilisis nunc vel urna tempor ultrices. Mauris facilisis bibendum turpis, lobortis iaculis massa cursus eget. Donec eget diam varius, accumsan massa sed, bibendum lacus. Morbi vestibulum quam at finibus dictum. Praesent ac mollis mi. Nulla vestibulum dapibus augue, volutpat faucibus ligula rutrum a. Vestibulum erat lacus, placerat interdum tempus fringilla, rhoncus in ex. Sed blandit convallis efficitur. Etiam massa lectus, rutrum vitae sapien nec, convallis accumsan mauris. Maecenas tellus dui, euismod sit amet volutpat sed, dignissim in orci. Morbi dictum, metus eget vestibulum gravida, enim arcu pellentesque ex, eu hendrerit lorem lacus eget massa. Integer at faucibus justo. Donec semper euismod egestas.Quisque vitae posuere nisi, elementum aliquam magna. Ut rutrum velit eget sapien tempus, sed cursus eros lacinia. Duis porttitor, ligula sed posuere luctus, ex quam elementum quam, quis mollis leo ipsum vel diam. Morbi luctus efficitur eros, nec placerat dui gravida et. Phasellus vulputate, leo ac consectetur pulvinar, erat est posuere nibh, at blandit ipsum ex nec urna. Cras ac pretium purus. Mauris et condimentum nisi, quis consectetur arcu. Proin ut velit facilisis, suscipit arcu sit amet, luctus augue. Proin a urna in dui auctor porta et eget nisi.Phasellus sem ex, imperdiet non odio ac, elementum eleifend magna. Aliquam porttitor ex id nunc tristique, id facilisis est ullamcorper. Mauris fringilla elit sed aliquam interdum. Vestibulum in.';

const overLimitMessage =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent tincidunt nisl at vehicula sollicitudin. Quisque ornare elit et magna tincidunt ornare. Etiam euismod dolor eget malesuada tristique. Praesent ex tortor, congue quis eros non, porttitor dictum magna. Sed ut metus a ex feugiat posuere. Morbi purus enim, luctus et enim non, laoreet facilisis orci. Vivamus at nulla non turpis facilisis tempus. Ut sit amet convallis tortor. Duis quis tincidunt metus. Praesent rhoncus commodo neque, in vestibulum diam. Quisque luctus, felis a faucibus lacinia, sapien ex tristique arcu, nec facilisis lectus quam sit amet nisl. Donec ultrices erat id leo lobortis, eget iaculis nulla volutpat. Integer pulvinar metus tellus, vel euismod enim congue non. Nunc eu tortor et eros ultricies porttitor. In hac habitasse platea dictumst.Praesent non placerat diam. Quisque augue elit, ultrices vitae tellus id, auctor tincidunt libero. Sed quis tincidunt sapien, nec rutrum felis. Integer suscipit eget arcu vitae blandit. Integer at ipsum sed diam molestie pretium ullamcorper sed nunc. Etiam finibus sed odio non consectetur. Curabitur leo dolor, vehicula eget sapien eget, interdum ullamcorper nunc. Praesent orci risus, sodales non tortor ac, condimentum sagittis mi. Sed et venenatis velit. Mauris lacinia tortor vel ligula imperdiet, eget condimentum justo commodo. Duis euismod placerat orci, id rutrum sem aliquam ac. In mi leo, laoreet at nibh a, mattis mollis felis.Aenean facilisis tortor sed est viverra fermentum vel in metus. Donec ac imperdiet quam, a feugiat elit. Phasellus blandit leo ut varius dapibus. Morbi dapibus quam vitae dui maximus, id auctor urna bibendum. Curabitur enim orci, sodales quis iaculis eget, egestas vel massa. Aliquam molestie sapien ut malesuada ultrices. Mauris et lacinia est. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Mauris id tellus laoreet elit eleifend egestas. Duis dignissim porta purus vel egestas. Etiam accumsan interdum massa. Maecenas vulputate dapibus velit, at viverra sapien vehicula vitae. Pellentesque id pretium ligula. Aliquam cursus massa sed justo aliquam volutpat. Suspendisse vitae nisi et eros gravida ornare nec et turpis. Suspendisse luctus laoreet nunc quis volutpat.In libero ex, cursus a sodales nec, imperdiet at eros. Nullam dui dolor, facilisis id aliquet non, viverra at erat. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aenean ante lectus, faucibus et erat at, tristique mattis sem. Sed nec tincidunt augue. Integer commodo nunc et turpis maximus feugiat. Aenean vel dolor nisi. Nunc odio ante, aliquet eget ligula vel, rutrum dignissim ipsum. Nulla non nisi a lacus vestibulum pellentesque vel vitae felis. Nunc id mattis nunc, vitae hendrerit velit. Mauris commodo placerat pretium.Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. In hac habitasse platea dictumst. Morbi molestie sem cras.';

describe('Keypad char counter', () => {
  beforeEach(() => {
    store = createTestStore();
  });

  it('keypad character counter is displayed and over limit', () => {
    render(
      <Provider store={store}>
        <ChatKeypadCharCounter userInput={warninglongCharMessage} />
      </Provider>,
    );
    const counterText = screen.getByText(/2901\/3000/i);
    expect(counterText).toBeInTheDocument();
    expect(counterText).toHaveStyle('color: #ff4800');
  });

  it('keypad character counter is gray color when under limit', () => {
    render(
      <Provider store={store}>
        <ChatKeypadCharCounter userInput={grayLongMessage} />
      </Provider>,
    );
    const counterText = screen.getByText(/505\/3000/i);
    expect(counterText).toBeInTheDocument();
    expect(counterText).toHaveStyle('color: #a7a9ab');
  });

  it('renders error message when typing too long message', () => {
    render(
      <Provider store={store}>
        <ChatKeyPad />
      </Provider>,
    );

    fireEvent.change(
      screen.getByRole('textbox', {
        name: /keypad.input.label/i,
      }),
      { target: { value: overLimitMessage } },
    );
    fireEvent.click(
      screen.getByRole('img', {
        name: /send icon/i,
      }),
    );
    screen.getByText('keypad.long-message-warning');
  });
});
