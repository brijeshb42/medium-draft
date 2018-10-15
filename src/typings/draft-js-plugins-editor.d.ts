declare module "draft-js/lib/isSoftNewlineEvent" {
  import * as React from 'react';

  function isSoftNewlineEvent(ev: React.KeyboardEvent<{}>): boolean;

  export default isSoftNewlineEvent;
}

// declare module "draft-js-prism-plugin" {

//   function prismPlugin(options: Object): any;

//   export default prismPlugin;
// }
