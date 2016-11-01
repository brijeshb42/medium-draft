import jsdom from 'jsdom';
import chai, { expect } from 'chai';
import React from 'react';


const doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
const win = doc.defaultView;

global.document = doc;
global.window = win;
global.React = React;
global.expect = expect;

Object.keys(window).forEach((key) => {
  if (!(key in global)) {
    global[key] = window[key];
  }
});
