import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';

export const NoMultipleSpaces = Extension.create({
  name: 'noMultipleSpaces',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('noMultipleSpaces'),
        props: {
          handleKeyDown(view, event) {
            if (event.key !== ' ') return false;

            const { state } = view;
            const { $from } = state.selection;

            const charBefore = $from.nodeBefore?.text?.slice(-1);
            if (charBefore === ' ') {
              return true;
            }

            return false;
          }
        }
      })
    ];
  }
});