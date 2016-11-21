export default class jsonTreeGenerator {
  constructor() {}


  generate(data) {
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
        }
      };
      treeData.core.data.push(treeItem);
    });

    return treeData;
  }
}
