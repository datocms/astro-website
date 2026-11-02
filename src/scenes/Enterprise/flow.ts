import { DIAGRAM_MS, type Live, replay, sleep, startDiagramLoop } from '~/lib/motion/diagramLoop';
import { WebComponent } from '~/lib/WebComponent';

// The loops of the diagrams of the security chapter. Each diagram is a
// column, and each is a custom element that extends one of these classes.
// The markup is the still: without JS and with reduced motion the diagram
// shows its final state, and a loop never starts.

/**
 * The parts `[data-node]` in their order, and between two of them a link
 * `[data-link]` (an svg with a pulse). One event: a part gets its ring (a
 * panel gets its tint too), the pulse goes along the link to the next
 * part, and the next part gets its ring. A diagram with a way back has
 * links `[data-back]`: after the last part, the pulses go up, and each part
 * gets its ring again. At the end the tints fade.
 */
export class FlowDiagram extends WebComponent {
  parsedCallback() {
    const nodes = this.$$<HTMLElement>('[data-node]');
    const links = this.$$<SVGElement>('[data-link]');
    const backs = this.$$<SVGElement>('[data-back]');

    const clear = () => {
      for (const node of nodes) delete node.dataset.changed;
    };

    const touch = async (node: HTMLElement) => {
      if ('tint' in node.dataset) node.dataset.changed = '';
      replay(node, 'ping');
      await sleep(DIAGRAM_MS.ping);
    };

    const event = async (live: Live) => {
      for (const [i, node] of nodes.entries()) {
        await touch(node);
        if (!live()) return;
        const link = links[i];
        if (link) {
          replay(link, 'pulse');
          await sleep(DIAGRAM_MS.travel);
          if (!live()) return;
        }
      }
      for (let i = backs.length - 1; i >= 0; i -= 1) {
        replay(backs[i]!, 'pulse');
        await sleep(DIAGRAM_MS.travel);
        if (!live()) return;
        await touch(nodes[i]!);
        if (!live()) return;
      }
      await sleep(DIAGRAM_MS.hold);
      if (!live()) return;
      clear();
      await sleep(DIAGRAM_MS.settle);
    };

    startDiagramLoop(this, event, { start: clear });
  }
}

/**
 * The schedule `[data-source]` starts an export: a pulse goes down to the
 * archive. The parts of the export `[data-part]` work one after the other,
 * each with the working mark, then the check. Then a pulse goes to the
 * bucket `[data-node]`, which gets its ring. The still has all the parts
 * done.
 */
export class ArchiveDiagram extends WebComponent {
  parsedCallback() {
    const source = this.$<HTMLElement>('[data-source]');
    const parts = this.$$<HTMLElement>('[data-part]');
    const bucket = this.$<HTMLElement>('[data-node]');
    const [down, out] = this.$$<SVGElement>('[data-link]');

    const clear = () => {
      for (const part of parts) {
        delete part.dataset.done;
        delete part.dataset.working;
      }
    };

    const event = async (live: Live) => {
      replay(source, 'ping');
      await sleep(DIAGRAM_MS.ping);
      if (!live()) return;
      replay(down!, 'pulse');
      await sleep(DIAGRAM_MS.travel);
      if (!live()) return;
      for (const part of parts) {
        part.dataset.working = '';
        await sleep(DIAGRAM_MS.draw);
        if (!live()) return;
        delete part.dataset.working;
        part.dataset.done = '';
        replay(part, 'ping');
      }
      await sleep(DIAGRAM_MS.pop);
      if (!live()) return;
      replay(out!, 'pulse');
      await sleep(DIAGRAM_MS.travel);
      if (!live()) return;
      replay(bucket, 'ping');
      await sleep(DIAGRAM_MS.hold + DIAGRAM_MS.settle);
      if (!live()) return;
      clear();
      await sleep(DIAGRAM_MS.settle);
    };

    startDiagramLoop(this, event, { start: clear });
  }
}
