import { Inline } from './constants';

/*
Custom style map for custom entities like Hihglight.
*/
const customStyleMap = {
  [Inline.HIGHLIGHT]: {
    backgroundColor: 'yellow',
  },
  [Inline.CODE]: {
    fontFamily: 'Consolas, "Liberation Mono", Menlo, Courier, monospace',
    margin: '4px 0',
    fontSize: '0.9em',
    padding: '1px 3px',
    color: '#555',
    backgroundColor: '#fcfcfc',
    border: '1px solid #ccc',
    borderBottomColor: '#bbb',
    borderRadius: 3,
    boxShadow: 'inset 0 -1px 0 #bbb',
  },
};

export default customStyleMap;
