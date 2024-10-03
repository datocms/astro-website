import GraphQlDemo from '~/components/GraphQlDemo';

export default function GraphQlDemoB() {
  return (
    <GraphQlDemo height={12}>
      {async (typer, setResult) => {
        typer.insert('{\n  \n}');
        typer.moveTo(-2);
        await typer.wait(1000);

        await typer.wait(300);
        await typer.type('allProducts(first: 10) {');
        typer.insert('\n  }', { moveCursor: false });

        typer.insert('\n');
        typer.indent(2);
        await typer.type('title');

        setResult({
          allProducts: [
            {
              title: 'Y.A.S. Teddy Jacket',
            },
            {
              title: 'Vintage inspired puffer gilet',
            },
          ],
        });

        await typer.wait(500);

        typer.insert('\n');
        typer.indent(2);
        await typer.type('relatedProducts {');
        typer.insert('\n    }', { moveCursor: false });
        typer.insert('\n');
        typer.indent(3);
        await typer.wait(300);

        await typer.type('slug');
        setResult({
          allProducts: [
            {
              title: 'Y.A.S. Teddy Jacket',
              relatedProducts: [{ slug: 'belted-wrap-coat' }],
            },
            {
              title: 'Vintage inspired puffer gilet',
              relatedProducts: [{ slug: 'denim-gilet' }],
            },
          ],
        });
        await typer.wait(800);

        await typer.typeBackspace(12);
        await typer.deleteForward(6);
        await typer.typeBackspace(16);

        setResult({
          allProducts: [
            {
              title: 'Y.A.S. Teddy Jacket',
            },
            {
              title: 'Vintage inspired puffer gilet',
            },
          ],
        });

        await typer.wait(500);

        await typer.type('categories {');
        typer.insert('\n    }', { moveCursor: false });
        typer.insert('\n');
        typer.indent(3);
        await typer.wait(500);

        await typer.type('title');
        setResult({
          allProducts: [
            {
              title: 'Y.A.S. Teddy Jacket',
              categories: [{ title: 'Jackets & Coats' }],
            },
            {
              title: 'Vintage inspired puffer gilet',
              categories: [{ title: 'Gilets' }],
            },
          ],
        });
        await typer.wait(1000);

        await typer.typeBackspace(12);
        await typer.deleteForward(6);
        await typer.typeBackspace(16);
        await typer.typeBackspace(12);
        await typer.deleteForward(4);
        await typer.typeBackspace(23);

        typer.reset();
      }}
    </GraphQlDemo>
  );
}
