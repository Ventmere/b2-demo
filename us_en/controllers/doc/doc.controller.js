(function *(context, schema) {
  const tasks = [
    schema.query('category')
    	.pluck('id', 'handle', 'title')
    	.orderBy('order')
    	.toArray(),
    schema.query('topic')
    	.where('published', true)
    	.pluck('handle', 'title', 'category')
    	.orderBy('title')
    	.toArray()
  ];
  
  if (context.params.handle) {
    tasks.push(
    	schema.query('topic')
      	.where('handle', context.params.handle)
      	.first()
    );
  }
  
  const results = yield tasks;
  const categories = results[0];
  const map = {};
  categories.forEach(c => {
    c.topics = [];
    map[c.id] = c;
  });
  results[1].forEach(t => {
    map[t.category].topics.push(t);
  });
  
  var topic;
  if (results.length > 2 && results[2]) {
    topic = results[2];
    categories.find(c => c.id === topic.category).active = true;
  }
  return {
    categories,
    topic
  };
})