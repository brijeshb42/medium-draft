import createEditorState from '../model/content';

import { Block, /* HANDLED,*/ NOT_HANDLED } from './constants';
import beforeInput from './beforeinput';

describe('beforeInput()', () => {
  it('returns NOT_HANDLED for atomic like blocks', () => {
    const dummyData = {
      entityMap: {},
      blocks: [{
        key: 'etee',
        text: 'E',
        type: 'atomic',
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [
          {
            offset: 0,
            length: 1,
            key: 3,
          },
        ],
        data: {},
      }],
    };
    let es = createEditorState(dummyData);
    expect(beforeInput(es)).to.equal(NOT_HANDLED);
    dummyData.blocks[0].type = Block.IMAGE;
    es = createEditorState(dummyData);
    expect(beforeInput(es)).to.equal(NOT_HANDLED);
  });
});
