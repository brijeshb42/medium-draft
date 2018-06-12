import { convertToRaw, CompositeDecorator } from 'draft-js';
import createEditorState from './content';
import { Block } from '../util/constants';

import preData from '../../docs/data.json';
import Link, { findLinkEntities } from '../components/entities/link';

describe('createEditorState', () => {
  const es = createEditorState();

  it('creates empty editorState when no argument or null is passed', () => {
    const raw = convertToRaw(es.getCurrentContent());
    expect(raw.blocks).toBeInstanceOf(Array);
    expect(raw.blocks[0].type).toEqual(Block.UNSTYLED);
    expect(raw.blocks[0].text).toEqual('');
    expect(Object.keys(raw.blocks[0])).toEqual(
      expect.arrayContaining(['data', 'key']),
    );
  });

  it('adds link decorator by default in CompositeDecorator', () => {
    expect(es.getDecorator()).toBeInstanceOf(CompositeDecorator);
    expect(es.getDecorator()._decorators.length).toEqual(1);
    expect(es.getDecorator()._decorators[0]).toEqual({
      strategy: findLinkEntities,
      component: Link,
    });
  });

  const esContent = createEditorState(preData);

  it('fills data from provided json', () => {
    const blocks = esContent.getCurrentContent().getBlockMap();
    expect(blocks.size).toBeGreaterThan(1);

    expect(esContent.getDecorator()).toBeInstanceOf(CompositeDecorator);
    expect(esContent.getDecorator()._decorators.length).toEqual(1);
    expect(esContent.getDecorator()._decorators[0]).toEqual({
      strategy: findLinkEntities,
      component: Link,
    });
  });
});
