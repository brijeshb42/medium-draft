import renderMap from './rendermap';
import { Block } from './constants';

describe('rendermap', () => {
  it('returns cite for CAPTION', () => {
    expect(renderMap.get(Block.CAPTION)).to.deep.equal({
      element: 'cite',
    });
  });

  it('returns blockquote for BLOCKQUOTE_CAPTION', () => {
    expect(renderMap.get(Block.BLOCKQUOTE_CAPTION)).to.deep.equal({
      element: 'blockquote',
    });
  });

  it('returns div for TODO', () => {
    expect(renderMap.get(Block.TODO)).to.deep.equal({
      element: 'div',
    });
  });

  it('returns figure for IMAGE', () => {
    expect(renderMap.get(Block.IMAGE)).to.deep.equal({
      element: 'figure',
    });
  });
});
