import { Map } from 'immutable';
import { EditorState, SelectionState } from 'draft-js';
import createEditorState from './content';
import {
  getDefaultBlockData,
  getCurrentBlock,
  resetBlockWithType,
  updateDataOfBlock,
  addNewBlockAt,
} from './';
import { Block } from '../util/constants';

describe('model/index', () => {
  describe('getDefaultBlockData()', () => {
    it('returns proper data for todo block', () => {
      expect(getDefaultBlockData(Block.TODO)).toEqual({
        checked: false,
      });
    });

    it('returns passed data for any other block', () => {
      expect(
        getDefaultBlockData(Block.IMAGE, {
          src: 'https://www.google.com',
          alt: 'Google',
        }),
      ).toEqual({
        src: 'https://www.google.com',
        alt: 'Google',
      });
    });
  });

  const block1 = {
    key: '2vr7c',
    text: 'medium-draft',
    type: 'header-three',
    depth: 0,
    inlineStyleRanges: [],
    entityRanges: [],
    data: {},
  };
  const block2 = {
    key: 'fksil',
    text: 'This page is fully editable.',
    type: 'header-three',
    depth: 0,
    inlineStyleRanges: [],
    entityRanges: [],
    data: {},
  };
  const es = createEditorState({
    entityMap: {},
    blocks: [block1, block2],
  });

  describe('getCurrentBlock()', () => {
    it('always returns currently focused/selected block', () => {
      expect(getCurrentBlock(es).getKey()).toEqual(block1.key);

      const selection = SelectionState.createEmpty(block2.key);
      const es2 = EditorState.acceptSelection(es, selection);
      expect(getCurrentBlock(es2).getKey()).toEqual(block2.key);
    });
  });

  describe('resetBlockWithType()', () => {
    it('change selected block type to provided type', () => {
      const es3 = resetBlockWithType(es, Block.UNSTYLED, { text: 'hola' });
      let currentBlock = getCurrentBlock(es3);
      expect(currentBlock.getType()).toEqual(Block.UNSTYLED);
      expect(currentBlock.getText()).toEqual('hola');
      const es4 = resetBlockWithType(es, Block.TODO);
      currentBlock = getCurrentBlock(es4);
      expect(currentBlock.getType()).toEqual(Block.TODO);
      expect(currentBlock.getData().toJS()).toEqual({
        checked: false,
      });
      expect(currentBlock.getText()).toEqual(block1.text);
      expect(es4.getLastChangeType()).toEqual('change-block-type');
    });
  });

  describe('updateDataOfBlock()', () => {
    it('should update data of provided block', () => {
      const es3 = resetBlockWithType(es, Block.TODO);
      const es4 = updateDataOfBlock(
        es3,
        getCurrentBlock(es),
        Map({
          checked: true,
        }),
      );
      expect(
        getCurrentBlock(es4)
          .getData()
          .toJS(),
      ).toEqual({
        checked: true,
      });
      expect(es4.getLastChangeType()).toEqual('change-block-data');
    });
  });

  describe('addNewBlockAt()', () => {
    it('should add new block after pivot block', () => {
      const es3 = addNewBlockAt(es, block1.key);
      expect(
        es3
          .getCurrentContent()
          .getBlockMap()
          .count(),
      ).toEqual(3);
      let currentBlock = getCurrentBlock(es3);
      expect(currentBlock.toJS()).toEqual(
        es3
          .getCurrentContent()
          .getBlockMap()
          .get(currentBlock.getKey())
          .toJS(),
      );
      expect(currentBlock.getData().toJS()).toEqual({});

      const es4 = addNewBlockAt(es3, currentBlock.getKey(), Block.TODO, {
        checked: true,
      });
      currentBlock = getCurrentBlock(es4);
      expect(
        es4
          .getCurrentContent()
          .getBlockMap()
          .count(),
      ).toEqual(4);

      expect(() => addNewBlockAt(es, 'random-key')).toThrow(Error);
    });
  });
});
