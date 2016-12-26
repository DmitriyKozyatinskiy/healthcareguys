export function generateJSONTree(data) {
  var treeData = {
    core: {
      data: [],
      themes: {
        icons: false
      }
    },
    'plugins': [ 'checkbox' ]
  };

  data.forEach(item => {
    var treeItem = {
      id: item.id,
      parent: item.parent || '#',
      text: item.name,
      state: {
        opened: true
      },
      a_attr: {
        title: item.name
      }
    };
    treeData.core.data.push(treeItem);
  });

  return treeData;
}
