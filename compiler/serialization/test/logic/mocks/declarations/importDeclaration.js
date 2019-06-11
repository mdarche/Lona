const xml = `<?xml version="1.0"?>
<root>
  <Declaration.ImportDeclaration name="Prelude"/>
</root>`

const json = {
  data: {
    block: [
      {
        data: {
          content: {
            data: {
              id: '0',
              name: {
                id: '0',
                name: 'Prelude',
              },
            },
            type: 'importDeclaration',
          },
          id: '0',
        },
        type: 'declaration',
      },
    ],
    id: '0',
  },
  type: 'program',
}

module.exports = { json, xml }
