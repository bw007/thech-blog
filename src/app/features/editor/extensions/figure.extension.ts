import { Node, mergeAttributes, isNodeSelection } from '@tiptap/core';

const deleteImageFigure = (editor: any): boolean => {
  const { selection } = editor.state;
  if (isNodeSelection(selection) && selection.node.type.name === 'image') {
    return editor.chain().selectParentNode().deleteSelection().run();
  }
  return false;
};

const deleteFigureFromCaption = (editor: any): boolean => {
  const { state } = editor;
  
  let figurePos = -1;
  let figureSize = -1;
  
  state.doc.descendants((node: { type: { name: string; }; nodeSize: number; }, pos: number) => {
    if (node.type.name === 'figure') {
      figurePos = pos;
      figureSize = node.nodeSize;
    }
  });
  
  if (figurePos === -1) return false;
  
  const tr = state.tr.delete(figurePos, figurePos + figureSize);
  editor.view.dispatch(tr);
  return true;
};

export const Figure = Node.create({
  name: 'figure',
  group: 'block',
  content: 'image figcaption',
  draggable: true,
  selectable: true,

  parseHTML() {
    return [{ tag: 'figure' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['figure', mergeAttributes(HTMLAttributes), 0];
  },

  addKeyboardShortcuts() {
    return {
      Backspace: ({ editor }) => deleteImageFigure(editor),
      Delete: ({ editor }) => deleteImageFigure(editor),
    };
  }
});

export const Figcaption = Node.create({
  name: 'figcaption',
  group: 'block',
  content: 'inline*',
  selectable: true,
  addAttributes: () => ({
    'data-placeholder': {
      default: 'Rasm tavsifi...',
    }
  }),
  parseHTML() {
    return [{ tag: 'figcaption' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['figcaption', mergeAttributes(HTMLAttributes), 0];
  },

  addKeyboardShortcuts() {
    return {
      Backspace: ({ editor }) => {
        if (deleteImageFigure(editor)) return true;

        if (editor.isActive('figcaption')) {
          const { $from } = editor.state.selection;
          const isEmpty = $from.parent.textContent === '';
          if (isEmpty) {
            return deleteFigureFromCaption(editor);
          }
        }

        return false;
      },
      Delete: ({ editor }) => deleteImageFigure(editor),
      Enter: ({ editor }) => {
        if (!editor.isActive('figcaption')) return false;

        const { state } = editor;
        let figureEnd = -1;

        state.doc.descendants((node, pos) => {
          if (node.type.name === 'figure') {
            figureEnd = pos + node.nodeSize;
          }
        });

        if (figureEnd === -1) return false;

        return editor.chain()
          .insertContentAt(figureEnd, { type: 'paragraph' })
          .setTextSelection(figureEnd + 1)
          .run();
      }
    };
  }
});