import GraphQlDemo from './index';

export default function GraphQlDemoSpecializzato() {
  return (
    <GraphQlDemo height={11}>
      {async (typer, setResult) => {
        typer?.insert('{\n  blogPost {}\n}');
        typer?.moveTo(-3);

        await typer?.wait(1000);

        typer?.insert('\n');
        typer?.insert('\n  ', { moveCursor: false });
        typer?.indent(2);
        await typer?.type('title');
        setResult({ blogPost: { title: 'Awesome post!' } });

        await typer?.wait(800);
        typer?.insert('\n');
        typer?.indent(2);

        await typer?.type('coverImage {');
        typer?.insert('}', { moveCursor: false });
        await typer?.wait(300);
        typer?.insert('\n');
        typer?.insert('\n    ', { moveCursor: false });
        typer?.indent(3);
        await typer?.wait(150);
        await typer?.type('url');
        setResult({
          blogPost: {
            title: 'Awesome post!',
            coverImage: { url: 'https://datocms-assets.com/cover.png' },
          },
        });
        await typer?.wait(1000);

        await typer?.moveTo(6, { animate: true });

        await typer?.type('\n');
        typer?.indent(2);

        await typer?.type('author {');
        typer?.insert('}', { moveCursor: false });
        await typer?.wait(300);
        typer?.insert('\n');
        typer?.indent(3);
        typer?.insert('\n    ', { moveCursor: false });
        await typer?.wait(150);
        await typer?.type('name');
        setResult({
          blogPost: {
            title: 'Awesome post!',
            coverImage: { url: 'https://datocms-assets.com/cover.png' },
            author: { name: 'Mark Smith' },
          },
        });
        await typer?.wait(2000);

        await typer?.typeBackspace(12);
        await typer?.deleteForward(6);
        await typer?.typeBackspace(55);
        await typer?.deleteForward(3);

        typer?.reset();
      }}
    </GraphQlDemo>
  );
}
