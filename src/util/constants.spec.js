import { KEY_COMMANDS, Block, Inline } from './constants';

describe('constants', () => {
  it('changeType should return appended with block type', () => {
    expect(KEY_COMMANDS.changeType()).to.equal('changetype:');
    expect(KEY_COMMANDS.changeType('')).to.equal('changetype:');
    expect(KEY_COMMANDS.changeType(Block.ATOMIC)).to.equal(`changetype:${Block.ATOMIC}`);
    expect(KEY_COMMANDS.changeType(Block.IMAGE)).to.equal(`changetype:${Block.IMAGE}`);
  });

  it('toggleInline should return appended with inline type', () => {
    expect(KEY_COMMANDS.toggleInline()).to.equal('toggleinline:');
    expect(KEY_COMMANDS.toggleInline('')).to.equal('toggleinline:');
    expect(KEY_COMMANDS.toggleInline(Inline.BOLD)).to.equal(`toggleinline:${Inline.BOLD}`);
    expect(KEY_COMMANDS.toggleInline(Inline.ITALIC)).to.equal(`toggleinline:${Inline.ITALIC}`);
  });
});
