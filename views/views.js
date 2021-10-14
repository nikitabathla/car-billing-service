const views = {
  entryTime: {
    map: `function(doc) { if(doc && doc._id) { emit(doc._id, doc.entryTime) } }`,
  },
};

module.exports = views;