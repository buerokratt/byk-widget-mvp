import reducer, { closeConfirmationModal, showConfirmationModal, WidgetState } from './widget-slice';

const initialState: WidgetState = {
  showConfirmationModal: false,
};

describe('Widget slice', () => {
  it('should showConfirmationModal', () => {
    expect(reducer(initialState, showConfirmationModal())).toEqual({
      showConfirmationModal: true,
    });
  });

  it('should closeConfirmationModal', () => {
    expect(reducer(initialState, closeConfirmationModal())).toEqual({ ...initialState, showConfirmationModal: false });
  });
});
