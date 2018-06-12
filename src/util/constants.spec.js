import { KEY_COMMANDS, Block, Inline } from './constants';

describe('constants', () => {
  it('changeType should return appended with block type', () => {
    expect(KEY_COMMANDS.changeType()).toEqual('changetype:');
    expect(KEY_COMMANDS.changeType('')).toEqual('changetype:');
    expect(KEY_COMMANDS.changeType(Block.ATOMIC)).toEqual(
      `changetype:${Block.ATOMIC}`,
    );
    expect(KEY_COMMANDS.changeType(Block.IMAGE)).toEqual(
      `changetype:${Block.IMAGE}`,
    );
  });

  it('toggleInline should return appended with inline type', () => {
    expect(KEY_COMMANDS.toggleInline()).toEqual('toggleinline:');
    expect(KEY_COMMANDS.toggleInline('')).toEqual('toggleinline:');
    expect(KEY_COMMANDS.toggleInline(Inline.BOLD)).toEqual(
      `toggleinline:${Inline.BOLD}`,
    );
    expect(KEY_COMMANDS.toggleInline(Inline.ITALIC)).toEqual(
      `toggleinline:${Inline.ITALIC}`,
    );
  });

  it('showLinkInput', () => {
    expect(KEY_COMMANDS.showLinkInput()).toEqual('showlinkinput');
  });

  it('addNewBlock', () => {
    expect(KEY_COMMANDS.addNewBlock()).toEqual('add-new-block');
  });

  it('deleteBlock', () => {
    expect(KEY_COMMANDS.deleteBlock()).toEqual('delete-block');
  });
});
