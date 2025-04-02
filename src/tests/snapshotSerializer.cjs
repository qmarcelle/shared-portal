const { NewPlugin } = require('pretty-format');

const snapshotSerializer = {
  test(value) {
    return (
      typeof value === 'string' &&
      (value.includes('checkbox-') ||
        value.includes('radio-') ||
        value.includes('data-testid="'))
    );
  },
  serialize(value) {
    return value
      .replace(/checkbox-[a-z0-9]+/g, 'checkbox-static-id')
      .replace(/radio-[a-z0-9]+/g, 'radio-static-id')
      .replace(/data-testid="[^"]+"/g, 'data-testid="static-id"');
  },
};

module.exports = snapshotSerializer;
