import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import {
  ICommandPalette,
  MainAreaWidget,
  ToolbarButton
} from '@jupyterlab/apputils';
import { Widget, BoxLayout } from '@lumino/widgets';
import { Message } from '@lumino/messaging';
import { IDisposable, DisposableDelegate } from '@lumino/disposable';
import { DocumentRegistry } from '@jupyterlab/docregistry';
import { NotebookPanel, INotebookModel } from '@jupyterlab/notebook';
import { toArray } from '@lumino/algorithm';
import { StickyLand } from './stickyland';

export class ButtonExtension
  implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel>
{
  stickyLand: StickyLand | null;

  constructor() {
    this.stickyLand = null;
  }

  createNew(
    panel: NotebookPanel,
    context: DocumentRegistry.IContext<INotebookModel>
  ): IDisposable {
    /**
     * Handler for the click event.
     */
    const onClickHandler = () => {
      console.log(panel);
      console.log(context);

      // Check if we have already created stickyland

      // Create it if we don't have it yet
      if (this.stickyLand === null) {
        this.stickyLand = new StickyLand(panel);
      }

      // Check if we should show or hide this container
      if (this.stickyLand.isHidden()) {
        this.stickyLand.show();
      } else {
        this.stickyLand.hide();
      }

      // Alternative way to insert StickyLand to the notebook widget (boxLayout)
      // const stickyLand = new StickyLand();
      // const panelLayout = panel.layout as BoxLayout;
      // panelLayout.addWidget(stickyLand);
    };

    const button = new ToolbarButton({
      className: 'sticky-button',
      iconClass: 'far fa-sticky-note',
      onClick: onClickHandler,
      tooltip: 'Show/Hide StickyLand'
    });

    // const numItems = toArray(panel.toolbar.children()).length;
    const insertIndex = 10;
    panel.toolbar.insertItem(insertIndex, 'stickyLand', button);

    return new DisposableDelegate(() => {
      button.dispose();
    });
  }
}