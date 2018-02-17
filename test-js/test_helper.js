import { JSDOM } from 'jsdom';
import chai, { expect } from 'chai';
import React from 'react';


const doc = new JSDOM('<!doctype html><html><body><div id="app"></div></body></html>');
const win = doc.window;

global.window = win;
global.document = global.window.document;
global.React = React;
global.expect = expect;

Object.keys(window).forEach((key) => {
  if (!(key in global)) {
    global[key] = window[key];
  }
});
