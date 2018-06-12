import renderMap from './rendermap';
import { Block } from './constants';

describe('rendermap', () => {
  it('returns cite for CAPTION', () => {
    expect(renderMap.get(Block.CAPTION)).toEqual({
      element: 'cite',
    });
  });

  it('returns blockquote for BLOCKQUOTE_CAPTION', () => {
    expect(renderMap.get(Block.BLOCKQUOTE_CAPTION)).toEqual({
      element: 'blockquote',
    });
  });

  it('returns div for TODO', () => {
    expect(renderMap.get(Block.TODO)).toEqual({
      element: 'div',
    });
  });

  it('returns figure for IMAGE', () => {
    expect(renderMap.get(Block.IMAGE)).toEqual({
      element: 'figure',
    });
  });
});
